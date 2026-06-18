import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { JOBS, usePractiq, type JobMatch } from "@/lib/practiq-store";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { PageTransition, StaggerList, StaggerItem } from "@/components/PageTransition";
import { toast } from "sonner";
import handshake from "@/assets/handshake.png.asset.json";

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
  const { state, applyToJob } = usePractiq();

  const list = JOBS.filter((j) => {
    if (filter === "Visa ok") return j.visaOk;
    if (filter === "B1 Friendly") return j.language === "B1";
    return true;
  });

  return (
    <PageTransition>
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32 lg:max-w-6xl lg:pl-28 lg:pr-12 lg:pt-14 lg:pb-16">
      <header className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
            Today's quest
          </p>
          <h1 className="font-display text-3xl uppercase lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Matches found — {list.length}
          </h1>
        </div>
        <motion.img
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={handshake.url}
          alt="Handshake"
          className="hidden lg:block w-64"
        />
      </header>

      <LayoutGroup>
      <div className="mt-5 flex gap-2">
        {FILTERS.map((f) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={f}
            onClick={() => setFilter(f)}
            className="relative rounded-full border-thick px-4 py-1.5 text-xs font-bold uppercase"
          >
            {filter === f && (
              <motion.span
                layoutId="filter-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-full bg-lime"
              />
            )}
            <span className="relative">{f}</span>
          </motion.button>
        ))}
      </div>
      </LayoutGroup>

      <StaggerList delay={0.05}>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
        {list.map((j) => {
          const applied = state.applications.some((a) => a.id === j.id);
          return (
          <StaggerItem key={j.id}>
          <motion.button
            layout
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                {applied ? (
                  <span className="inline-block rounded-full border-thick bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase text-background">
                    Applied
                  </span>
                ) : j.badge && (
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
          </motion.button>
          </StaggerItem>
        );})}
        </AnimatePresence>
      </div>
      </StaggerList>

      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
          onClick={() => setOpen(null)}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
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
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setOpen(null)}
                className="flex-1 rounded-full border-thick px-4 py-2.5 text-sm font-bold uppercase"
              >
                Close
              </motion.button>
              {state.applications.some((a) => a.id === open.id) ? (
                <button disabled className="flex-1 rounded-full border-thick bg-foreground px-4 py-2.5 text-sm font-bold uppercase text-background opacity-80">
                  Applied ✓
                </button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    applyToJob(open);
                    toast.success(`Applied to ${open.company} — +50 XP`);
                    setOpen(null);
                  }}
                  className="flex-1 rounded-full border-thick bg-lime px-4 py-2.5 text-sm font-bold uppercase"
                >
                  Apply Now
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <BottomNav />
    </main>
    </PageTransition>
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