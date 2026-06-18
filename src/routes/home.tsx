import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { usePractiq } from "@/lib/practiq-store";
import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useState } from "react";
import { JOBS } from "@/lib/practiq-store";

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
  const [q, setQ] = useState("");
  const results = q.trim()
    ? JOBS.filter((j) =>
        [j.company, j.role, j.city, ...j.skills]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
    : [];
  return (
    <PageTransition>
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/60">Welcome Back,</p>
          <h1 className="font-display text-3xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
            {state.name}.
          </h1>
        </div>
        <Link to="/profile" className="flex h-12 w-12 items-center justify-center rounded-full border-thick bg-lime font-display text-lg uppercase transition-transform hover:scale-105 active:scale-95" style={{ fontFamily: "var(--font-display)" }}>
          {state.name[0]}
        </Link>
      </header>

      <div className="mt-6 flex items-center gap-2 rounded-full border-thick bg-background px-5 py-3">
        <Search className="h-4 w-4" strokeWidth={2.5} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search internships, skills, cities..."
          className="flex-1 bg-transparent text-sm placeholder:text-foreground/40 focus:outline-none"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      </div>

      {q ? (
        <section className="mt-6 space-y-3">
          {results.length === 0 ? (
            <p className="rounded-2xl border-thick border-dashed p-6 text-center text-sm text-foreground/60">
              No matches for "{q}"
            </p>
          ) : (
            results.map((j) => (
              <Link
                key={j.id}
                to="/matches"
                className="block rounded-2xl border-thick p-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>{j.company}</p>
                    <p className="text-xs">{j.role} · {j.city}</p>
                  </div>
                  <span className="font-display" style={{ color: "var(--purple-match)" }}>{j.match}</span>
                </div>
              </Link>
            ))
          )}
        </section>
      ) : (
      <section className="mt-12 space-y-1 text-center">
        {["Learn /", "Grow /", "Achieve"].map((w, i) => (
          <motion.p
            key={w}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
            className="text-stroke-black italic"
            style={{ fontFamily: "var(--font-serif-italic)", fontSize: "5rem", lineHeight: 1 }}
          >
            {w}
          </motion.p>
        ))}
      </section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 rounded-2xl border-thick p-5"
      >
        <p className="italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
          Today's quest
        </p>
        <h2 className="mt-1 font-display text-2xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
          Check your matches
        </h2>
        <Link
          to="/matches"
          className="mt-4 inline-flex items-center rounded-full border-thick bg-lime px-5 py-2 text-sm font-bold uppercase transition-transform hover:scale-105 active:scale-95"
        >
          View matches →
        </Link>
      </motion.section>

      <BottomNav />
    </main>
    </PageTransition>
  );
}