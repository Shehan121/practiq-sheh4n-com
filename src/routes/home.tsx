import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { usePractiq } from "@/lib/practiq-store";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useEffect, useRef, useState } from "react";
import { JOBS } from "@/lib/practiq-store";
import { Parallax } from "@/components/Parallax";
import celebrate from "@/assets/celebrate.png.asset.json";
import cat from "@/assets/cat.png.asset.json";
import handshake from "@/assets/handshake.png.asset.json";
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

  // Global page scroll for background parallax
  const { scrollY: pageScrollY } = useScroll();
  const bgBlobY = useTransform(pageScrollY, [0, 2000], [0, -400]);
  const bgBlobRot = useTransform(pageScrollY, [0, 2000], [0, 60]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], [0, -260]);
  const heroSubY = useTransform(heroScroll, [0, 1], [0, -140]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const imgY = useTransform(heroScroll, [0, 1], [0, 280]);
  const imgScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  const imgRotate = useTransform(heroScroll, [0, 1], [-4, 12]);

  // Smooth scroll to hash on mount/hash change
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      // wait a tick for layout
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <PageTransition>
    <main className="relative w-full overflow-x-hidden">
      {/* Global decorative lime blob, parallaxes through whole page */}
      <motion.div
        style={{ y: bgBlobY, rotate: bgBlobRot }}
        className="pointer-events-none absolute right-[-12%] top-[18%] -z-10 h-[520px] w-[520px] rounded-full bg-lime opacity-50 blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(pageScrollY, [0, 2500], [0, 600]) }}
        className="pointer-events-none absolute left-[-10%] top-[60%] -z-10 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        // @ts-ignore
        // eslint-disable-next-line
        // tailwind doesn't know purple-match utility; inline style
      />

      {/* HERO */}
      <section
        id="home"
        ref={heroRef}
        className="relative mx-auto flex h-screen max-h-[900px] min-h-[640px] max-w-7xl flex-col justify-center overflow-hidden px-6 pt-24 lg:px-10"
      >
        {/* Floating celebrate illustration — anchored bottom-right, parallaxes */}
        <motion.img
          style={{ y: imgY, scale: imgScale, rotate: imgRotate }}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          src={celebrate.url}
          alt="Celebrating student"
          className="pointer-events-none absolute right-[-6%] top-[20%] z-0 w-[48vw] max-w-[520px] opacity-95 lg:right-[2%] lg:top-[16%] lg:w-[38vw] dark:invert dark:hue-rotate-180 dark:brightness-125 dark:saturate-150"
        />


        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10">
          <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)", fontSize: "clamp(1.25rem, 3vw, 2.5rem)" }}>
            Welcome back, {state.name} —
          </p>
          <div className="mt-2 space-y-1">
            {["Learn /", "Grow /", "Achieve"].map((w, i) => (
              <motion.p
                key={w}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + 0.14 * i, ease: [0.22, 1, 0.36, 1] }}
                className="text-stroke-black italic"
                style={{ fontFamily: "var(--font-serif-italic)", fontSize: "clamp(3rem, 10vw, 8.5rem)", lineHeight: 0.88 }}
              >
                {w}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: heroSubY, opacity: heroOpacity }} className="relative z-10 mt-6 max-w-md">
          <p className="text-sm text-foreground/70 lg:text-base">
            The internship platform built for international students in Germany. Match by stack, visa status & language — track every quest from application to offer.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/matches" className="inline-flex items-center gap-2 rounded-full border-thick bg-lime px-6 py-3 text-sm font-bold uppercase text-black transition-transform hover:scale-105 active:scale-95">
              Browse matches <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link to="/applications" className="inline-flex items-center rounded-full border-thick bg-background px-6 py-3 text-sm font-bold uppercase transition-transform hover:scale-105 active:scale-95">
              Track quests
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-foreground/50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          scroll ↓
        </motion.div>
      </section>

      {/* SEARCH STRIP */}
      <section id="discover" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="relative rounded-3xl border-thick bg-lime p-6 lg:p-12">
          <p className="italic text-black" style={{ fontFamily: "var(--font-serif-italic)" }}>
            Find your match
          </p>
          <h2 className="mt-1 font-display text-3xl uppercase text-black lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
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
      <section id="how" className="relative mx-auto max-w-7xl overflow-hidden px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="relative">
            <Parallax speed={0.5}>
              <img src={handshake.url} alt="" className="mx-auto w-[90%] max-w-xl lg:w-full dark:invert dark:hue-rotate-180 dark:brightness-125 dark:saturate-150" />
            </Parallax>
            <Parallax speed={-0.3} className="absolute -bottom-6 left-4 hidden lg:block">
              <span
                className="font-display uppercase opacity-10"
                style={{ fontFamily: "var(--font-display)", fontSize: "8rem", lineHeight: 1, letterSpacing: "-0.04em" }}
              >
                Deal
              </span>
            </Parallax>
          </div>
          <Parallax speed={-0.2}>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>How it works</p>
            <h2 className="mt-2 font-display uppercase leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 6rem)", letterSpacing: "-0.03em" }}>
              Match.<br />Apply.<br />
              <span style={{ color: "var(--purple-match)" }}>Get hired.</span>
            </h2>
            <ul className="mt-8 space-y-4 text-base lg:text-lg">
              {[
                ["01", "Pick your stack", "Tell us what you build with."],
                ["02", "We match by visa & B1", "No more rejections for paperwork."],
                ["03", "Track every quest", "From application to offer."],
              ].map(([n, t, d], i) => (
                <motion.li
                  key={n}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-4 border-t-[2.5px] border-foreground/15 pt-4"
                >
                  <span className="font-mono text-sm text-foreground/50" style={{ fontFamily: "var(--font-mono)" }}>{n}</span>
                  <div>
                    <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>{t}</p>
                    <p className="text-foreground/70">{d}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </Parallax>
        </div>
      </section>

      {/* STATS — sticky parallax band */}
      <section className="relative overflow-hidden border-y-[2.5px] border-foreground bg-foreground py-24 text-background">
        <Parallax speed={0.6} className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2">
          <p
            className="whitespace-nowrap font-display uppercase opacity-[0.06]"
            style={{ fontFamily: "var(--font-display)", fontSize: "12rem", color: "var(--lime)", letterSpacing: "-0.05em" }}
          >
            Practiq · Practiq · Practiq
          </p>
        </Parallax>
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 lg:grid-cols-4 lg:px-10">
          {[
            ["4k+", "students matched"],
            ["120", "partner companies"],
            ["73%", "interview rate"],
            ["B1+", "language friendly"],
          ].map(([n, l], i) => (
            <Parallax key={l} speed={0.2 + i * 0.1}>
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
      <section id="matches" className="relative mx-auto max-w-7xl overflow-hidden px-6 py-28 lg:px-10 lg:py-40">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>Today's matches</p>
            <h2 className="mt-1 font-display uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
              Hot right now
            </h2>
          </div>
          <Link to="/matches" className="hidden rounded-full border-thick px-5 py-2 text-xs font-bold uppercase hover:bg-lime sm:inline-flex">See all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {JOBS.slice(0, 3).map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
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

      {/* APPLICATIONS preview — parallax with thinking illustration */}
      <section id="applications" className="relative mx-auto max-w-7xl overflow-hidden px-6 py-28 lg:px-10 lg:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <Parallax speed={-0.25}>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>Your quests</p>
            <h2 className="mt-2 font-display uppercase leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.03em" }}>
              Track <span style={{ color: "var(--purple-match)" }}>every</span> step
            </h2>
            <p className="mt-6 max-w-md text-foreground/70 lg:text-lg">
              Applied → In review → Interview → Decision. Watch your applications progress through every stage, in one place.
            </p>
            <Link to="/applications" className="mt-6 inline-flex rounded-full border-thick bg-lime px-6 py-3 text-sm font-bold uppercase text-black hover:scale-105 transition-transform">
              Open my quests →
            </Link>
          </Parallax>
          <Parallax speed={0.4}>
            <img src={thinking.url} alt="" className="mx-auto w-[90%] max-w-md dark:invert dark:hue-rotate-180 dark:brightness-125 dark:saturate-150" />
          </Parallax>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-28 lg:px-10 lg:py-40">
        <Parallax speed={-0.4} className="pointer-events-none absolute -bottom-10 left-2">
          <p className="font-display uppercase opacity-[0.06]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(8rem, 22vw, 22rem)", lineHeight: 0.85, letterSpacing: "-0.05em" }}>
            Go
          </p>
        </Parallax>

        {/* Cat sticker — right side of CTA */}
        <motion.img
          initial={{ opacity: 0, x: 80, rotate: 8 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          src={cat.url}
          alt="Cat"
          className="pointer-events-none absolute right-[-5%] top-[8%] z-0 hidden h-[75vh] w-auto max-w-none opacity-90 lg:block dark:invert dark:hue-rotate-180 dark:brightness-125 dark:saturate-150"
        />

        <div className="relative max-w-3xl">
          <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>Today's quest</p>
          <h2 className="mt-2 font-display uppercase leading-[0.85]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 12vw, 10rem)", letterSpacing: "-0.04em" }}>
            Ready to level up?
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/matches" className="rounded-full border-thick bg-lime px-7 py-3 text-sm font-bold uppercase text-black transition-transform hover:scale-105">
              Start matching
            </Link>
            <Link to="/profile" className="rounded-full border-thick bg-background px-7 py-3 text-sm font-bold uppercase transition-transform hover:scale-105">
              My profile
            </Link>
          </div>
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