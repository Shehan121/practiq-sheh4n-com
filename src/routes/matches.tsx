import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { JOBS, type JobMatch } from "@/lib/practiq-store";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Practiq — Matches" },
      { name: "description", content: "Internships matched to your stack." },
    ],
  }),
  component: MatchesPage,
});

type Filter = "All" | "Visa ok" | "B1 Friendly";
const FILTERS: Filter[] = ["All", "Visa ok", "B1 Friendly"];

function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<JobMatch | null>(null);

  const list = JOBS.filter((j) => {
    if (filter === "Visa ok") return j.visaOk;
    if (filter === "B1 Friendly") return j.language === "B1";
    return true;
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32">
      <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
        Today's quest
      </p>
      <h1 className="font-display text-3xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
        Matches found — {list.length}
      </h1>

      <div className="mt-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border-thick px-4 py-1.5 text-xs font-bold uppercase ${
              filter === f ? "bg-lime" : "bg-background"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {list.map((j) => (
          <button
            key={j.id}
            onClick={() => setOpen(j)}
            className="block w-full rounded-2xl border-thick bg-background p-5 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  {j.company}
                </h3>
                <p className="text-sm">{j.role}</p>
              </div>
              <div className="text-right">
                {j.badge && (
                  <span className="inline-block rounded-full border-thick bg-lime px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    {j.badge}
                  </span>
                )}
                <p className="mt-1 font-display text-2xl" style={{ color: "var(--purple-match)", fontFamily: "var(--font-display)" }}>
                  {j.match}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
              {j.type} · {j.city} · {j.language} German{j.visaOk ? " · Visa ok" : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {j.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border-thick px-2.5 py-0.5 text-[11px]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border-thick bg-background p-6"
          >
            <h2 className="font-display text-2xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
              {open.company}
            </h2>
            <p className="text-sm">{open.role}</p>
            <dl className="mt-4 space-y-2 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              <Row k="Visa" v={open.visaOk ? "Accepted" : "Not supported"} />
              <Row k="Language" v={`${open.language} German`} />
              <Row k="City" v={open.city} />
              <Row k="Duration" v="6 months" />
              <Row k="Match" v={`${open.match}%`} />
            </dl>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setOpen(null)}
                className="flex-1 rounded-full border-thick px-4 py-2.5 text-sm font-bold uppercase"
              >
                Close
              </button>
              <button className="flex-1 rounded-full border-thick bg-lime px-4 py-2.5 text-sm font-bold uppercase">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-foreground/10 pb-1">
      <dt className="text-foreground/60">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}