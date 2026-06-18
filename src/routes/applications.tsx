import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { usePractiq, STAGES } from "@/lib/practiq-store";

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
  const { state, advanceStage } = usePractiq();
  const active = state.applications.filter((a) => a.status === "active");
  const rejected = state.applications.filter((a) => a.status === "rejected");

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32">
      <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
        Your quests
      </p>
      <h1 className="font-display text-3xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
        Applications: {state.applications.length}
      </h1>

      <h2 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wide">Active</h2>
      <div className="space-y-4">
        {active.map((a) => (
          <article key={a.id} className="rounded-2xl border-thick p-5">
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
          </article>
        ))}
      </div>

      {rejected.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--salmon)" }}>
            Rejected
          </h2>
          {rejected.map((a) => (
            <article key={a.id} className="rounded-2xl border-thick p-5">
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
            </article>
          ))}
        </>
      )}

      <BottomNav />
    </main>
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