# Practiq

An internship-matching app for **international students looking for a
Pflichtpraktikum in Germany** — the mandatory placement a German degree requires.
It surfaces roles filtered by the things that actually decide whether a student
can take a job: required German level, visa sponsorship, and city.

Alongside the web UI it exposes an **MCP server**, so an AI assistant can query
the job catalogue directly as a tool.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TanStack](https://img.shields.io/badge/TanStack_Start-1.16-FF4154)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646E7F?logo=vite&logoColor=white)

---

## The problem

Generic job boards are close to useless for an international student in Germany,
because they omit the three filters that determine eligibility:

| Constraint | Why it decides everything |
|---|---|
| **German level** | A role wanting B2 is out of reach for a B1 speaker, regardless of technical fit |
| **Visa sponsorship** | Without it, a non-EU student cannot accept the role at all |
| **"Mandatory internship"** | A Pflichtpraktikum is legally distinct from a working-student role, with different permissions |

Every job in Practiq carries all three as first-class fields, so the listing is
filtered by eligibility before it is ranked by fit.

## Features

- **Match scoring** — roles ranked 0–100 against the student's skills, with a
  `Rare` badge on especially strong fits
- **Eligibility filters** — city, German level (B1/B2), visa sponsorship
- **Application pipeline** — four stages (Applied → In Review → Interview →
  Decision) with a deadline countdown per application
- **Bilingual EN/DE** — a hand-rolled i18n layer, appropriate given the audience
- **Dark mode**
- **Animated UI** — Framer Motion page transitions, Lenis smooth scrolling,
  parallax and a splash screen
- **MCP server** — exposes the catalogue as AI-callable tools

---

## Routes

File-based routing via TanStack Start; every file in `src/routes` is a route.

| Route | Purpose |
|---|---|
| `index.tsx` | Landing / onboarding |
| `home.tsx` | Dashboard |
| `matches.tsx` | Ranked job matches with filters |
| `applications.tsx` | Pipeline tracker |
| `profile.tsx` | Skills and profile |
| `mcp.ts`, `[.mcp]/*` | MCP endpoints (see below) |
| `[.well-known]/oauth-protected-resource.ts` | OAuth resource metadata for MCP clients |

`__root.tsx` is the only root layout.

## The MCP server

The interesting part of this project. Two tools are defined with
`@lovable.dev/mcp-js` and Zod schemas, letting an AI assistant query the job
catalogue as structured tool calls rather than scraping the UI:

| Tool | Parameters |
|---|---|
| `list_jobs` | `city`, `minMatch` (0–100), `visaOk` |
| `get_job` | job id |

Both are annotated `readOnlyHint: true`, `idempotentHint: true`,
`openWorldHint: false` — accurate, since they read a fixed in-memory catalogue
and have no side effects. Those annotations are what let a client reason about
whether a call is safe to retry.

`[.well-known]/oauth-protected-resource.ts` publishes the discovery document an
MCP client needs to negotiate access.

## State model

There is no backend. State lives in `localStorage` under `practiq-state-v1`,
with the job catalogue hardcoded in `src/lib/practiq-store.ts`:

```ts
export interface JobMatch {
  id: string; company: string; role: string;
  type: string;            // "Mandatory internship"
  city: string;
  language: string;        // "B1" | "B2"
  visaOk: boolean;
  skills: string[];
  badge?: "Rare";
  match: number;           // 0-100
}
```

`read()` guards on `typeof window === "undefined"` and returns the defaults
during server-side rendering, then merges stored state over the defaults —
so a state shape added in a later version does not break an existing user's
saved data.

This makes the app a **working prototype with realistic mock data** (N26,
Delivery Hero, Celonis, Trade Republic), not a live product.

---

## Running it

Requires Node 20+ (verified on Node 22).

```bash
npm install
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview the build
npm run lint       # eslint
npm run format     # prettier --write .
```

The production build targets **Nitro**, output to `.output/`, and generates a
Cloudflare Workers `wrangler.json` — so it deploys to Workers rather than to a
Node host.

Verified: `npm run build` succeeds in ~460 ms.

---

## Known issues

1. **721 Prettier violations.** `npm run lint` reports 730 problems, of which
   721 are `prettier/prettier` formatting errors and 721 are auto-fixable.
   `npm run format` clears them. They have been left untouched here deliberately:
   this repository syncs to Lovable, and a whole-tree reformat would bury the
   real history in a single enormous diff. Worth doing as its own commit.

2. **The remaining nine are worth actually reading**, unlike the formatting noise:
   - 7 × `react-refresh/only-export-components` — modules exporting both a
     component and non-component values, which breaks hot-reload granularity
   - 1 × `react-hooks/exhaustive-deps` — a genuine stale-closure risk
   - 1 × `@typescript-eslint/ban-ts-comment` — a suppressed type error

3. **No tests.** Match scoring and the stage pipeline are the logic worth
   covering first.

4. **No persistence beyond the browser.** Clearing site data loses every
   application. A real version needs a backend and auth.

5. **The job catalogue is hardcoded** — four companies in a TypeScript array.
   The MCP tools are already written against a clean interface, so swapping in a
   real data source would not change their shape.

6. **46 shadcn/ui primitives are vendored** into `src/components/ui`, most of
   them unused by the five actual screens. That is the normal shadcn trade-off
   (you own the code), but it inflates the repo considerably.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | TanStack Start 1.16 (file-based routing, SSR) |
| UI | React 19, Tailwind CSS 4, shadcn/ui on Radix primitives |
| Animation | Framer Motion, Lenis |
| Forms | React Hook Form + Zod |
| Data | TanStack Query |
| Charts | Recharts |
| Build | Vite 8, Nitro → Cloudflare Workers |
| Tooling | TypeScript 5.8, ESLint 9, Prettier |
| AI integration | `@lovable.dev/mcp-js` |

## Project structure

```
src/
├── routes/          file-based routes + MCP endpoints
├── components/
│   ├── ui/          46 shadcn/ui primitives
│   ├── TopNav, BottomNav, PageTransition, Parallax, Splash
├── lib/
│   ├── practiq-store.ts   state model + job catalogue
│   ├── i18n.ts            EN/DE strings
│   └── mcp/               tool definitions (list-jobs, get-job)
├── hooks/           useDarkMode, use-mobile
├── router.tsx       router configuration
└── server.ts        server entry
```

> [!NOTE]
> This project is connected to [Lovable](https://lovable.dev) — see
> [AGENTS.md](AGENTS.md). Published history must not be rewritten, as that
> desynchronises the Lovable editor.

## Author

**Shehan Nimsara** — B.Sc. Software Design (International), TH Aschaffenburg
