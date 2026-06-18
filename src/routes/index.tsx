import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePractiq } from "@/lib/practiq-store";
import { Send } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Practiq — Choose your Stack" },
      { name: "description", content: "Practiq matches international students in Germany with internships." },
      { property: "og:title", content: "Practiq — Choose your Stack" },
      { property: "og:description", content: "Pick your skills to start matching with German internships." },
    ],
  }),
  component: Onboarding,
});

const STACK = ["CSS","HTML","Ruby","Java","Python","Kotlin","JavaScript","SQL","React","TypeScript","Swift","Go","C++","Rust"];

function Onboarding() {
  const { state, setSkills } = usePractiq();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>([]);
  const [other, setOther] = useState("");

  useEffect(() => {
    if (state.onboarded) navigate({ to: "/home" });
    if (state.skills.length) setPicked(state.skills);
  }, [state.onboarded]);

  const toggle = (s: string) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const submit = () => {
    const extras = other.split(",").map((s) => s.trim()).filter(Boolean);
    const all = Array.from(new Set([...picked, ...extras]));
    if (!all.length) return;
    setSkills(all);
    navigate({ to: "/home" });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-12 pb-32">
      <p className="font-serif-italic italic text-lg text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
        Step 01
      </p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Choose your<br />Stack
      </h1>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {STACK.map((s) => {
          const active = picked.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`rounded-full border-thick px-4 py-2 text-sm font-medium transition-colors ${
                active ? "bg-lime" : "bg-background"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <input
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder="Enter Others (comma separated)"
          className="w-full rounded-full border-thick bg-background px-5 py-3 text-sm placeholder:text-foreground/40 focus:outline-none"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={submit}
          aria-label="Continue"
          className="flex h-16 w-16 items-center justify-center rounded-full border-thick bg-lime transition-transform hover:scale-105 active:scale-95"
        >
          <Send className="h-6 w-6 -rotate-12" strokeWidth={2.5} />
        </button>
      </div>
    </main>
  );
}
