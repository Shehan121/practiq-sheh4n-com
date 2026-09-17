# Practiq

**HCI portfolio project — Summer 2026, B.Sc. Software Design (International), TH Aschaffenburg**
Student: Kaveesha Shehan Nimsara Disanayaka Mudiyanselage · Matriculation 2279147

Practiq is an internship-matching app for **international, non-EU students in
Germany who must complete a Pflichtpraktikum** (mandatory internship) inside a
fixed semester window. Generic job boards make them filter by hand, one tab at a
time, for the two things that decide eligibility before skills are even
discussed: *does this employer sponsor a student visa?* and *is the German level
they want realistic?* Practiq puts those two filters in front of every listing,
ranks the remaining matches by fit, and turns the application pipeline into
visible progress against the deadline.

This repository is the complete project: the written documentation, the Figma
prototype and design system, the physical prototype, the usability tests, the
presentation, and the deployed web application built as a bonus task.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TanStack](https://img.shields.io/badge/TanStack_Start-1.16-FF4154)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-prototype-F24E1E?logo=figma&logoColor=white)

---

## Repository map

| Folder | Contents |
|---|---|
| [`docs/`](docs/) | `HCI_Practiq_final_document.pdf` — the full written submission (research, design, iterations, WCAG analysis, user testing, physical prototype, review) |
| [`figma-prototype/`](figma-prototype/) | `Practiq.fig` source file plus PDF exports of the design system, mobile screens and tablet screens |
| [`images/iterations/`](images/iterations/) | Wireframe, wireflow and every design iteration from the first ranked dashboard to the final prototype |
| [`images/physical-prototype/`](images/physical-prototype/) | Photos of the physical "Deadline Companion" prototype |
| [`images/inspirations/`](images/inspirations/) | UI references collected during the *Consume* phase |
| [`images/memes/`](images/memes/) | The two HCI memes from the *Produce* phase |
| [`testing/`](testing/) | Screen recordings and audio of the moderated usability tests on mobile and tablet |
| [`presentation/`](presentation/) | `practiq-presentation.html` — the self-contained portfolio presentation (open in a browser) |
| [`prompts/`](prompts/) | The prompts used to scaffold and build the web application |
| `src/`, `public/`, `package.json` … | The web application (Bonus II) — see below |

Large binaries (`*.fig`, `*.mp4`, `*.m4a` and the Figma PDF exports) are
stored with **Git LFS**. Run `git lfs install` once before cloning, or the
files come down as small pointer stubs.

Live Figma file: https://www.figma.com/design/xCXgrj9VWwUYwUpBD8PtTm/Practiq

---

## The design project

### Process

Design Thinking (Empathize → Define → Ideate → Prototype → Test), with one
deliberate loop back from Prototype to Define. The first concept was a plain
ranked dashboard: correct information, but it answered only half the problem.
Next to the empathy map it told the persona what existed and did nothing about
how he felt while looking at it. The whole prototype was reframed around that
FEELS quadrant, and every gamified element in the final UI traces back to one
line in it.

### Persona

**Amir Hossein**, 23, Iranian national, 5th-semester Computer Science student.
Technically capable (Python, Java) — the friction is almost entirely outside the
code: not knowing which companies take non-EU applicants, German that is not
strong enough for most postings, and a graduation deadline that keeps moving
closer while the shortlist does not grow.

### How might we

> help international students in Germany **efficiently discover and apply** for
> internships **compatible with their visa status, language level and technical
> background** — without manually filtering hundreds of irrelevant listings?

### What was built

- **Design system v1.0** — Swiss/International Typographic Style skeleton with a
  neo-brutalist voice: hard offset shadows, flat lime accent (`#CBFF00`), a
  three-voice type hierarchy, light and dark modes designed rather than inverted
- **Mobile prototype** — dashboard home, quest-framed ranked match list
  (`All · Visa ok · B1 Friendly` filters), application tracker with a four-step
  stepper, profile with XP and streaks
- **Tablet prototype** — rethought for the wider canvas with a side rail rather
  than stretched from the phone layout
- **Bilingual EN/DE** on every screen (Bonus I)
- **Physical prototype** — the "Deadline Companion", a tangible answer to the
  deadline anxiety the digital tracker addresses on screen
- **Evaluation** — Laws of UX and Gestalt review, UX writing pass, WCAG 2.2
  accessibility analysis, moderated usability tests on both device classes,
  ISO 9241-11 self-review

The full reasoning behind each decision is in `docs/HCI_Practiq_final_document.pdf`.

---

## The web application (Bonus II)

A stateful build of the prototype, not a click-through. It runs on real state:
advancing an application walks it through the stepper, a rejection moves it to
"Quest complete", and the whole tracker together with the theme and language
choice survives a reload in `localStorage`.

Deployed at: **practiq-sheh4n-com-lsiv.vercel.app**

### Features

- **Match scoring** — roles ranked 0–100 against the student's skills, with a
  `Rare` badge on especially strong fits
- **Eligibility filters** — city, German level (B1/B2), visa sponsorship, shown
  on the card itself (`Berlin · B1 German · Visa ok`)
- **Application pipeline** — Applied → In Review → Interview → Decision, with a
  deadline countdown per application
- **Bilingual EN/DE** — a full translation, not a veneer
- **Dark mode** and `prefers-reduced-motion` support
- **Animated UI** — Framer Motion page transitions, Lenis smooth scrolling,
  parallax, splash screen
- **MCP server** — exposes the job catalogue as AI-callable tools

### Routes

File-based routing via TanStack Start; every file in `src/routes` is a route.

| Route | Purpose |
|---|---|
| `index.tsx` | Landing / onboarding |
| `home.tsx` | Dashboard |
| `matches.tsx` | Ranked job matches with filters |
| `applications.tsx` | Pipeline tracker |
| `profile.tsx` | Skills and profile |
| `mcp.ts`, `[.mcp]/*` | MCP endpoints |
| `[.well-known]/oauth-protected-resource.ts` | OAuth resource metadata for MCP clients |

### MCP server

Two tools are defined with Zod schemas so an AI assistant can query the
catalogue as structured tool calls rather than scraping the UI:

| Tool | Parameters |
|---|---|
| `list_jobs` | `city`, `minMatch` (0–100), `visaOk` |
| `get_job` | job id |

Both are annotated `readOnlyHint`, `idempotentHint` and `openWorldHint: false`
— accurate, since they read a fixed in-memory catalogue with no side effects.

### State model

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

`read()` returns the defaults during SSR and merges stored state over them on
the client, so a later state shape does not break an existing user's saved data.
The app is a **working prototype with realistic mock data** (N26, Delivery Hero,
Celonis, Trade Republic), not a live product.

### Running it

Requires Node 20+.

```bash
npm install
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview the build
npm run lint       # eslint
npm run format     # prettier --write .
```

The production build targets Nitro (output in `.output/`).

### Tech stack

| Layer | Choice |
|---|---|
| Framework | TanStack Start 1.16 (file-based routing, SSR) |
| UI | React 19, Tailwind CSS 4, shadcn/ui on Radix primitives |
| Animation | Framer Motion, Lenis |
| Forms | React Hook Form + Zod |
| Data | TanStack Query |
| Build | Vite 8, Nitro |
| Tooling | TypeScript 5.8, ESLint 9, Prettier |

### Project structure

```
src/
├── routes/          file-based routes + MCP endpoints
├── components/
│   ├── ui/          shadcn/ui primitives
│   ├── TopNav, BottomNav, PageTransition, Parallax, Splash
├── lib/
│   ├── practiq-store.ts   state model + job catalogue
│   ├── i18n.ts            EN/DE strings
│   └── mcp/               tool definitions (list-jobs, get-job)
├── hooks/           useDarkMode, use-mobile
├── router.tsx       router configuration
└── server.ts        server entry
```

### Known limitations

- No tests — match scoring and the stage pipeline are the logic worth covering first
- No persistence beyond the browser; a real version needs a backend and auth
- The job catalogue is four hardcoded companies
- Many vendored shadcn/ui primitives are unused by the five actual screens
- `npm run lint` reports Prettier formatting violations; `npm run format` clears them

---

## References

lawsofux.com · w3.org/TR/WCAG22 · ISO 9241-11 · sinus-institut.de ·
hubspot.com/make-my-persona · uxpressia.com

## Author

**Shehan Nimsara** — B.Sc. Software Design (International), TH Aschaffenburg
[sheh4n.com](https://sheh4n.com)
