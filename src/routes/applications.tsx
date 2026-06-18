import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { usePractiq, STAGES } from "@/lib/practiq-store";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition, StaggerList, StaggerItem } from "@/components/PageTransition";
import { X, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import thinking from "@/assets/thinking.png.asset.json";
import cat from "@/assets/cat.png.asset.json";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Practiq — Applications" },
      { name: "description", content: "Track your internship applications." },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { state, advanceStage, rejectApp, removeApp } = usePractiq();
  const active = state.applications.filter((a) => a.status === "active");
  const rejected = state.applications.filter((a) => a.status === "rejected");

  return (
    <PageTransition>
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32 lg:max-w-6xl lg:pl-28 lg:pr-12 lg:pt-14 lg:pb-16">
      <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
        Your quests
      </p>
      <h1 className="font-display text-3xl uppercase lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
        Applications: {state.applications.length}
      </h1>

      <h2 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wide">Active</h2>
      <StaggerList>
      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
        {active.map((a) => (
          <StaggerItem key={a.id}>
          <motion.article layout exit={{ opacity: 0, x: -40 }} className="rounded-2xl border-thick p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  {a.company}
                </h3>
                <p className="text-sm">{a.role}</p>
              </div>
              <span className="rounded-full border-thick px-2.5 py-0.5 text-[11px] font-bold uppercase">
                {a.daysLeft}D left
              </span>
            </div>
            <Stepper
              stageIndex={a.stageIndex}
              status="active"
              onTap={() => advanceStage(a.id)}
            />
            <div className="mt-4 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  advanceStage(a.id);
                  if (a.stageIndex >= 2) toast.success(`${a.company}: Decision reached!`);
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-full border-thick bg-lime px-3 py-2 text-xs font-bold uppercase"
              >
                Advance <ChevronRight className="h-3 w-3" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  rejectApp(a.id);
                  toast(`${a.company} marked rejected. +30 XP`);
                }}
                aria-label="Reject"
                className="flex items-center justify-center rounded-full border-thick px-3 py-2 text-xs font-bold uppercase"
                style={{ background: "var(--salmon)" }}
              >
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.button>
            </div>
          </motion.article>
          </StaggerItem>
        ))}
        </AnimatePresence>
        {active.length === 0 && (
          <div className="rounded-2xl border-thick border-dashed p-8 text-center lg:col-span-2">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={thinking.url}
              alt="No applications yet"
              className="mx-auto w-40"
            />
            <p className="mt-3 text-sm text-foreground/60">
              No active applications yet. Head to Matches to apply.
            </p>
          </div>
        )}
      </div>
      </StaggerList>

      {rejected.length > 0 && (
        <>
          <div className="mt-8 flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--salmon)" }}>
              Rejected
            </h2>
            <img src={cat.url} alt="" className="h-10 w-auto" />
          </div>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <AnimatePresence>
          {rejected.map((a) => (
            <motion.article
              layout
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="rounded-2xl border-thick p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
                    {a.company}
                  </h3>
                  <p className="text-sm">{a.role}</p>
                </div>
                <span
                  className="rounded-full border-thick px-2.5 py-0.5 text-[11px] font-bold uppercase"
                  style={{ color: "var(--purple-match)" }}
                >
                  Quest complete
                </span>
              </div>
              <Stepper stageIndex={3} status="rejected" />
              <p className="mt-4 italic text-sm text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
                Even though it did not work this time, you still got +30 XP. Keep Applying!!
              </p>
              <button
                onClick={() => removeApp(a.id)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase text-foreground/60 hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </motion.article>
          ))}
          </AnimatePresence>
          </div>
        </>
      )}

      <BottomNav />
    </main>
    </PageTransition>
  );
}

function Stepper({
  stageIndex,
  status,
  onTap,
}: {
  stageIndex: number;
  status: "active" | "rejected";
  onTap?: () => void;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center">
        {STAGES.map((s, i) => {
          const completed = i < stageIndex;
          const current = i === stageIndex;
          const isFinalRejected = status === "rejected" && i === 3;
          const bg = isFinalRejected
            ? "var(--salmon)"
            : completed
              ? "var(--lime)"
              : "var(--background)";
          const dashed = !completed && !current && !isFinalRejected;
          return (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={onTap}
                aria-label={s}
                className="h-5 w-5 shrink-0 rounded-full border-thick"
                style={{ background: bg, borderStyle: dashed ? "dashed" : "solid" }}
              />
              {i < STAGES.length - 1 && (
                <div
                  className="mx-1 h-0 flex-1"
                  style={{
                    borderTop:
                      i < stageIndex
                        ? "2.5px solid var(--foreground)"
                        : "2.5px dashed var(--foreground)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-foreground/60" style={{ fontFamily: "var(--font-mono)" }}>
        {STAGES.map((s) => (
          <span key={s} className="w-1/4 text-center">{s}</span>
        ))}
      </div>
    </div>
  );
}