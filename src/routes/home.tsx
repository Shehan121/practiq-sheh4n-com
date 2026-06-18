import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { usePractiq } from "@/lib/practiq-store";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useRef, useState } from "react";
import { JOBS } from "@/lib/practiq-store";
import { Parallax } from "@/components/Parallax";
import celebrate from "@/assets/celebrate.png.asset.json";
import handshake from "@/assets/handshake.png.asset.json";
import cat from "@/assets/cat.png.asset.json";
import thinking from "@/assets/thinking.png.asset.json";

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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, -120]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const imgY = useTransform(heroScroll, [0, 1], [0, 200]);
  const imgRotate = useTransform(heroScroll, [0, 1], [0, 8]);

  return (
    <PageTransition>
    <main className="w-full overflow-x-hidden pt-24">
      {/* HERO */}
      <section ref={heroRef} className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 lg:px-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>
              Welcome back, {state.name} —
            </p>
            <div className="mt-2 space-y-1">
              {["Learn /", "Grow /", "Achieve"].map((w, i) => (
                <motion.p
                  key={w}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="text-stroke-black italic"
                  style={{ fontFamily: "var(--font-serif-italic)", fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 0.9 }}
                >
                  {w}
                </motion.p>
              ))}
            </div>
            <p className="mt-6 max-w-md text-base text-foreground/70 lg:text-lg">
              The internship platform built for international students in Germany. Match by stack, visa status & language — track every quest from application to offer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/matches" className="inline-flex items-center gap-2 rounded-full border-thick bg-lime px-6 py-3 text-sm font-bold uppercase transition-transform hover:scale-105 active:scale-95">
                Browse matches <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link to="/applications" className="inline-flex items-center rounded-full border-thick px-6 py-3 text-sm font-bold uppercase transition-transform hover:scale-105 active:scale-95">
                Track quests
              </Link>
            </div>
          </div>

          <motion.img
            style={{ y: imgY, rotate: imgRotate }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            src={celebrate.url}
            alt="Celebrating"
            className="mx-auto w-64 lg:w-full lg:max-w-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-foreground/50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          scroll ↓
        </motion.div>
      </section>

      {/* SEARCH STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="rounded-3xl border-thick bg-lime p-6 lg:p-10">
          <p className="italic text-foreground/80" style={{ fontFamily: "var(--font-serif-italic)" }}>
            Find your match
          </p>
          <h2 className="mt-1 font-display text-3xl uppercase lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Search internships
          </h2>
          <div className="mt-6 flex items-center gap-2 rounded-full border-thick bg-background px-5 py-3">
            <Search className="h-4 w-4" strokeWidth={2.5} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by company, skill, city..."
              className="flex-1 bg-transparent text-sm placeholder:text-foreground/40 focus:outline-none lg:text-base"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>
          {q && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {results.length === 0 ? (
                <p className="rounded-2xl border-thick border-dashed bg-background p-6 text-center text-sm text-foreground/60 lg:col-span-2">
                  No matches for "{q}"
                </p>
              ) : (
                results.map((j) => (
                  <Link key={j.id} to="/matches" className="block rounded-2xl border-thick bg-background p-4 transition-transform hover:-translate-y-0.5">
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
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS — parallax columns */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Parallax speed={0.25}>
            <img src={handshake.url} alt="" className="mx-auto w-72 lg:w-full lg:max-w-lg" />
          </Parallax>
          <div>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>How it works</p>
            <h2 className="mt-2 font-display text-4xl uppercase leading-none lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              Match.<br />Apply.<br />
              <span style={{ color: "var(--purple-match)" }}>Get hired.</span>
            </h2>
            <ul className="mt-8 space-y-4 text-base lg:text-lg">
              {[
                ["01", "Pick your stack", "Tell us what you build with."],
                ["02", "We match by visa & B1", "No more rejections for paperwork."],
                ["03", "Track every quest", "From application to offer."],
              ].map(([n, t, d]) => (
                <li key={n} className="flex gap-4 border-t-[2.5px] border-foreground/15 pt-4">
                  <span className="font-mono text-sm text-foreground/50" style={{ fontFamily: "var(--font-mono)" }}>{n}</span>
                  <div>
                    <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>{t}</p>
                    <p className="text-foreground/70">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STATS — sticky parallax band */}
      <section className="border-y-[2.5px] border-foreground bg-foreground py-20 text-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 lg:grid-cols-4 lg:px-10">
          {[
            ["4k+", "students matched"],
            ["120", "partner companies"],
            ["73%", "interview rate"],
            ["B1+", "language friendly"],
          ].map(([n, l]) => (
            <Parallax key={l} speed={0.15}>
              <div>
                <p className="font-display text-5xl lg:text-7xl" style={{ fontFamily: "var(--font-display)", color: "var(--lime)" }}>
                  {n}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-background/70" style={{ fontFamily: "var(--font-mono)" }}>{l}</p>
              </div>
            </Parallax>
          ))}
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>Today's matches</p>
            <h2 className="mt-1 font-display text-4xl uppercase lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              Hot right now
            </h2>
          </div>
          <Link to="/matches" className="hidden rounded-full border-thick px-5 py-2 text-xs font-bold uppercase hover:bg-lime sm:inline-flex">See all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {JOBS.slice(0, 3).map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border-thick bg-background p-6 transition-transform hover:-translate-y-2"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-2xl uppercase" style={{ fontFamily: "var(--font-display)" }}>{j.company}</h3>
                <span className="font-display text-3xl" style={{ color: "var(--purple-match)", fontFamily: "var(--font-display)" }}>{j.match}</span>
              </div>
              <p className="mt-1 text-sm">{j.role}</p>
              <p className="mt-2 text-xs italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{j.city} · {j.language} · {j.visaOk ? "Visa ok" : "Visa: tbd"}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {j.skills.map((s) => (
                  <span key={s} className="rounded-full border-thick px-2.5 py-0.5 text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA with parallax cat */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>Today's quest</p>
            <h2 className="mt-2 font-display uppercase leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 9vw, 8rem)", letterSpacing: "-0.04em" }}>
              Ready to level up?
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/matches" className="rounded-full border-thick bg-lime px-7 py-3 text-sm font-bold uppercase transition-transform hover:scale-105">
                Start matching
              </Link>
              <Link to="/profile" className="rounded-full border-thick px-7 py-3 text-sm font-bold uppercase transition-transform hover:scale-105">
                My profile
              </Link>
            </div>
          </div>
          <Parallax speed={0.4}>
            <img src={cat.url} alt="" className="w-48 lg:w-72" />
          </Parallax>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[2.5px] border-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-10">
          <div className="flex items-center gap-3">
            <img src={thinking.url} alt="" className="h-12 w-12" />
            <div>
              <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>Practiq</p>
              <p className="text-xs italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>learn / grow / achieve</p>
            </div>
          </div>
          <p className="text-xs uppercase tracking-wider text-foreground/50" style={{ fontFamily: "var(--font-mono)" }}>
            © 2026 Practiq — Built for international students in Germany
          </p>
        </div>
      </footer>
    </main>
    </PageTransition>
  );
}