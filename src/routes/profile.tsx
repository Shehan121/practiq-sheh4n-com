import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { usePractiq } from "@/lib/practiq-store";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import avatar from "@/assets/avatar.png.asset.json";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Practiq — Profile" },
      { name: "description", content: "Your Practiq profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, reset } = usePractiq();
  const navigate = useNavigate();
  const skills = state.skills.length ? state.skills : ["Python", "JavaScript", "SQL", "React"];

  const logout = () => {
    reset();
    navigate({ to: "/" });
  };

  return (
    <PageTransition>
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32 lg:max-w-6xl lg:pl-28 lg:pr-12 lg:pt-14 lg:pb-16">
      <h1 className="font-display text-3xl uppercase lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
        Your Profile
      </h1>

      <div className="mt-6 lg:grid lg:grid-cols-[320px_1fr] lg:gap-10">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="h-28 w-28 overflow-hidden rounded-full border-thick bg-lime lg:h-36 lg:w-36"
        >
          <img src={avatar.url} alt="Amir Hossein" className="h-full w-full object-cover" />
        </motion.div>
        <p className="mt-3 text-2xl font-bold italic" style={{ fontFamily: "var(--font-serif-italic)" }}>
          Amir Hossein
        </p>
        <p className="text-sm text-foreground/70">CS @ TU Berlin ; Backend curious</p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="rounded-full border-thick px-3 py-1 text-xs font-bold uppercase">Level 4</span>
          <span
            className="rounded-full border-thick px-3 py-1 text-xs font-bold uppercase"
            style={{ background: "var(--purple-match)", color: "white" }}
          >
            240 XP
          </span>
          <span className="rounded-full border-thick px-3 py-1 text-xs font-bold uppercase">7 days</span>
        </div>

        <div className="mt-6 w-full">
        <div className="flex justify-between text-xs font-bold uppercase">
          <span>Profile Strength</span>
          <span>98%</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-thick">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "98%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="h-full bg-lime"
          />
        </div>
        </div>
      </div>

      <div className="mt-6 space-y-5 lg:mt-0">
      <section className="rounded-2xl border-thick p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">About</h2>
        <dl className="mt-3 space-y-2 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          <Row k="Email" v="amir@tu-berlin.de" />
          <Row k="University" v="TU Berlin" />
          <Row k="VISA" v="Accepted" />
          <Row k="German" v="B1" />
        </dl>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full border-thick px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">Preferred Cities</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Berlin", "Remote"].map((s) => (
            <span key={s} className="rounded-full border-thick px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-thick p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">Settings</h2>
        <dl className="mt-3 space-y-2 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          <Row k="Notifications" v="ON" />
          <Row k="Language" v="English" />
          <Row k="Privacy" v="Manage" />
          <Row k="Help and Support" v="→" />
        </dl>
      </section>

      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={logout}
        className="w-full rounded-full border-thick py-3 text-sm font-bold uppercase tracking-wide"
        style={{ background: "var(--salmon)" }}
      >
        Logout
      </motion.button>
      </div>
      </div>

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