import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { usePractiq } from "@/lib/practiq-store";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useEffect, useRef, useState } from "react";
import { JOBS } from "@/lib/practiq-store";
import { Parallax } from "@/components/Parallax";
import { useLanguage, translateRole } from "@/lib/i18n";

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
  const { t } = useLanguage();
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
  const springScroll = { stiffness: 100, damping: 22, mass: 0.5 };
  const bgBlobY = useSpring(useTransform(pageScrollY, [0, 2000], [0, -520]), springScroll);
  const bgBlobRot = useSpring(useTransform(pageScrollY, [0, 2000], [0, 80]), springScroll);
  const bgBlob2Y = useSpring(useTransform(pageScrollY, [0, 2500], [0, 760]), springScroll);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useSpring(useTransform(heroScroll, [0, 1], [0, -340]), springScroll);
  const heroSubY = useSpring(useTransform(heroScroll, [0, 1], [0, -180]), springScroll);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

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
        style={{ y: bgBlob2Y }}
        className="pointer-events-none absolute left-[-10%] top-[60%] -z-10 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        // @ts-ignore
        // eslint-disable-next-line
        // tailwind doesn't know purple-match utility; inline style
      />

      {/* HERO */}
      <section
        id="home"
        ref={heroRef}
        className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center overflow-hidden px-6 py-28 text-center lg:px-10"
      >
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10">
          <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)", fontSize: "clamp(1.25rem, 3vw, 2.5rem)" }}>
            {t.home.welcomeBack}, {state.name} —
          </p>
          <div className="mt-2 space-y-1">
            {[t.home.learn, t.home.grow, t.home.achieve].map((w, i) => (
              <motion.p
                key={w}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + 0.14 * i, ease: [0.22, 1, 0.36, 1] }}
                className="text-stroke-black italic"
                style={{ fontFamily: "var(--font-serif-italic)", fontSize: "clamp(2.75rem, 10vw, 7.5rem)", lineHeight: 0.9 }}
              >
                {w}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: heroSubY, opacity: heroOpacity }} className="relative z-10 mx-auto mt-6 max-w-md">
          <p className="text-sm text-foreground/70 lg:text-base" style={{ fontFamily: "var(--font-mono)" }}>
            {t.home.heroDescription}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/matches" className="inline-flex items-center gap-2 rounded-full border-thick bg-lime px-6 py-3 text-sm font-bold uppercase text-black transition-transform hover:scale-105 active:scale-95" style={{ fontFamily: "var(--font-mono)" }}>
              {t.home.browseMatches} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link to="/applications" className="inline-flex items-center rounded-full border-thick bg-background px-6 py-3 text-sm font-bold uppercase transition-transform hover:scale-105 active:scale-95" style={{ fontFamily: "var(--font-mono)" }}>
              {t.home.trackQuests}
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
          {t.home.scroll}
        </motion.div>
      </section>

      {/* SEARCH STRIP */}
      <section id="discover" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="relative rounded-3xl border-thick bg-lime p-6 text-center lg:p-12">
          <p className="italic text-black" style={{ fontFamily: "var(--font-serif-italic)" }}>
            {t.home.findYourMatch}
          </p>
          <h2 className="mt-1 font-display text-3xl uppercase text-black lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            {t.home.searchInternships}
          </h2>
          <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-full border-thick bg-background px-5 py-3">
            <Search className="h-4 w-4" strokeWidth={2.5} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.home.searchPlaceholder}
              className="flex-1 bg-transparent text-sm placeholder:text-foreground/40 focus:outline-none lg:text-base"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>
          {q && (
            <div className="mx-auto mt-5 grid max-w-xl gap-3 text-left lg:grid-cols-2">
              {results.length === 0 ? (
                <p className="rounded-2xl border-thick border-dashed bg-background p-6 text-center text-sm text-foreground/60 lg:col-span-2">
                  {t.home.noMatchesFor} "{q}"
                </p>
              ) : (
                results.map((j) => (
                  <Link key={j.id} to="/matches" className="block rounded-2xl border-thick bg-background p-4 transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>{j.company}</p>
                        <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>{translateRole(j.role, t)} · {j.city}</p>
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

      {/* HOW IT WORKS */}
      <section id="how" className="relative mx-auto max-w-7xl px-6 py-28 text-center lg:px-10 lg:py-40">
        <Parallax speed={-0.2} className="relative mx-auto max-w-4xl">
          <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{t.home.howItWorks}</p>
          <h2 className="mt-2 text-balance break-words font-display uppercase leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            {t.home.matchApply}<br />{t.home.apply}<br />
            <span style={{ color: "var(--purple-match)" }}>{t.home.getHired}</span>
          </h2>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-6 text-base sm:grid-cols-3 lg:text-lg">
            {[
              ["01", t.home.step1Title, t.home.step1Desc],
              ["02", t.home.step2Title, t.home.step2Desc],
              ["03", t.home.step3Title, t.home.step3Desc],
            ].map(([n, stepTitle, d], i) => (
              <motion.li
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 border-t-[2.5px] border-foreground/15 pt-4"
              >
                <span className="font-mono text-sm text-foreground/50" style={{ fontFamily: "var(--font-mono)" }}>{n}</span>
                <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>{stepTitle}</p>
                <p className="text-foreground/70" style={{ fontFamily: "var(--font-mono)" }}>{d}</p>
              </motion.li>
            ))}
          </ul>
        </Parallax>
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
            ["4k+", t.home.statsStudents],
            ["120", t.home.statsCompanies],
            ["73%", t.home.statsInterview],
            ["B1+", t.home.statsLanguage],
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
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div>
            <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{t.home.todaysMatches}</p>
            <h2 className="mt-1 max-w-4xl text-balance break-words font-display uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 5.5rem)", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
              {t.home.hotRightNow}
            </h2>
          </div>
          <Link to="/matches" className="inline-flex rounded-full border-thick px-5 py-2 text-xs font-bold uppercase hover:bg-lime" style={{ fontFamily: "var(--font-mono)" }}>{t.home.seeAll}</Link>
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
              <p className="mt-1 text-sm" style={{ fontFamily: "var(--font-mono)" }}>{translateRole(j.role, t)}</p>
              <p className="mt-2 text-xs italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{j.city} · {j.language} · {j.visaOk ? t.home.visaOk : t.home.visaTbd}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {j.skills.map((s) => (
                  <span key={s} className="rounded-full border-thick px-2.5 py-0.5 text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* APPLICATIONS preview */}
      <section id="applications" className="relative mx-auto max-w-7xl px-6 py-28 text-center lg:px-10 lg:py-40">
        <Parallax speed={-0.25} className="mx-auto max-w-3xl">
          <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{t.home.yourQuests}</p>
          <h2 className="mt-2 text-balance break-words font-display uppercase leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            {t.home.trackEveryStepPre}<span style={{ color: "var(--purple-match)" }}>{t.home.trackEveryStepMid}</span>{t.home.trackEveryStepPost}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-foreground/70 lg:text-lg" style={{ fontFamily: "var(--font-mono)" }}>
            {t.home.trackDescription}
          </p>
          <Link to="/applications" className="mt-6 inline-flex rounded-full border-thick bg-lime px-6 py-3 text-sm font-bold uppercase text-black hover:scale-105 transition-transform" style={{ fontFamily: "var(--font-mono)" }}>
            {t.home.openMyQuests}
          </Link>
        </Parallax>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-28 text-center lg:px-10 lg:py-40">
        <div className="relative mx-auto max-w-5xl">
          <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{t.home.todaysQuest}</p>
          <h2 className="mt-2 text-balance break-words font-display uppercase leading-[0.9]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 8vw, 7rem)", letterSpacing: "-0.03em" }}>
            {t.home.readyToLevelUp}
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/matches" className="rounded-full border-thick bg-lime px-7 py-3 text-sm font-bold uppercase text-black transition-transform hover:scale-105" style={{ fontFamily: "var(--font-mono)" }}>
              {t.home.startMatching}
            </Link>
            <Link to="/profile" className="rounded-full border-thick bg-background px-7 py-3 text-sm font-bold uppercase transition-transform hover:scale-105" style={{ fontFamily: "var(--font-mono)" }}>
              {t.home.myProfile}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-[2.5px] border-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 py-10 text-center lg:px-10">
          <div>
            <p className="font-display uppercase" style={{ fontFamily: "var(--font-display)" }}>Practiq</p>
            <p className="text-xs italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>{t.home.footerTagline}</p>
          </div>
          <p className="text-xs uppercase tracking-wider text-foreground/50" style={{ fontFamily: "var(--font-mono)" }}>
            {t.home.footerCopyright}
          </p>
        </div>
      </footer>
    </main>
    </PageTransition>
  );
}