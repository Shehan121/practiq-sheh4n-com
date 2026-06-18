import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { usePractiq } from "@/lib/practiq-store";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Practiq — Home" },
      { name: "description", content: "Your Practiq home: learn, grow, achieve." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state } = usePractiq();
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/60">Welcome Back,</p>
          <h1 className="font-display text-3xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
            {state.name}.
          </h1>
        </div>
        <Link to="/profile" className="flex h-12 w-12 items-center justify-center rounded-full border-thick bg-lime font-display text-lg uppercase" style={{ fontFamily: "var(--font-display)" }}>
          {state.name[0]}
        </Link>
      </header>

      <div className="mt-6 flex items-center gap-2 rounded-full border-thick bg-background px-5 py-3">
        <Search className="h-4 w-4" strokeWidth={2.5} />
        <input
          placeholder="Search internships, skills, cities..."
          className="flex-1 bg-transparent text-sm placeholder:text-foreground/40 focus:outline-none"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      </div>

      <section className="mt-16 space-y-1 text-center">
        {["Learn /", "Grow /", "Achieve"].map((w) => (
          <p
            key={w}
            className="text-stroke-black italic"
            style={{ fontFamily: "var(--font-serif-italic)", fontSize: "5rem", lineHeight: 1 }}
          >
            {w}
          </p>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border-thick p-5">
        <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
          Today's quest
        </p>
        <h2 className="mt-1 font-display text-2xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
          Check your matches
        </h2>
        <Link
          to="/matches"
          className="mt-4 inline-flex items-center rounded-full border-thick bg-lime px-5 py-2 text-sm font-bold uppercase"
        >
          View matches →
        </Link>
      </section>

      <BottomNav />
    </main>
  );
}