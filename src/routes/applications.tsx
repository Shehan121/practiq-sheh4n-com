import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { usePractiq, STAGES } from "@/lib/practiq-store";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition, StaggerList, StaggerItem } from "@/components/PageTransition";
import { X, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage, translateRole, translateStage, type Dict } from "@/lib/i18n";

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
  const { t } = useLanguage();
  const active = state.applications.filter((a) => a.status === "active");
  const rejected = state.applications.filter((a) => a.status === "rejected");

  return (
    <PageTransition>
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 pt-28 pb-20 lg:px-10 lg:pt-32">
      <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
        {t.applications.yourQuests}
      </p>
      <h1 className="font-display text-3xl uppercase lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
        {t.applications.applications} {state.applications.length}
      </h1>

      <h2 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>{t.applications.active}</h2>
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
                <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>{translateRole(a.role, t)}</p>
              </div>
              <span className="rounded-full border-thick px-2.5 py-0.5 text-[11px] font-bold uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                {a.daysLeft}{t.applications.daysLeft}
              </span>
            </div>
            <Stepper
              stageIndex={a.stageIndex}
              status="active"
              onTap={() => advanceStage(a.id)}
              t={t}
            />
            <div className="mt-4 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  advanceStage(a.id);
                  if (a.stageIndex >= 2) toast.success(`${a.company}: Decision reached!`);
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-full border-thick bg-lime px-3 py-2 text-xs font-bold uppercase text-black"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {t.applications.advance} <ChevronRight className="h-3 w-3" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  rejectApp(a.id);
                  toast(`${a.company} marked rejected. +30 XP`);
                }}
                aria-label={t.applications.reject}
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
            <p className="mt-3 text-sm text-foreground/60" style={{ fontFamily: "var(--font-mono)" }}>
              {t.applications.noActiveApplications}
            </p>
          </div>
        )}
      </div>
      </StaggerList>

      {rejected.length > 0 && (
        <>
          <div className="mt-8 flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--salmon)", fontFamily: "var(--font-mono)" }}>
              {t.applications.rejected}
            </h2>
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
                  <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>{translateRole(a.role, t)}</p>
                </div>
                <span
                  className="rounded-full border-thick px-2.5 py-0.5 text-[11px] font-bold uppercase"
                  style={{ color: "var(--purple-match)", fontFamily: "var(--font-mono)" }}
                >
                  {t.applications.questComplete}
                </span>
              </div>
              <Stepper stageIndex={3} status="rejected" t={t} />
              <p className="mt-4 italic text-sm text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
                {t.applications.rejectedMessage}
              </p>
              <button
                onClick={() => removeApp(a.id)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase text-foreground/60 hover:text-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Trash2 className="h-3 w-3" /> {t.applications.remove}
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
  t,
}: {
  stageIndex: number;
  status: "active" | "rejected";
  onTap?: () => void;
  t: Dict;
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
                aria-label={translateStage(s, t)}
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
          <span key={s} className="w-1/4 text-center">{translateStage(s, t)}</span>
        ))}
      </div>
    </div>
  );
}