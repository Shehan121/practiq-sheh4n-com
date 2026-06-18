import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { usePractiq } from "@/lib/practiq-store";

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
    <main className="mx-auto min-h-screen w-full max-w-md px-6 pt-10 pb-32">
      <h1 className="font-display text-3xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
        Your Profile
      </h1>

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-thick bg-lime font-display text-4xl uppercase" style={{ fontFamily: "var(--font-display)" }}>
          A
        </div>
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
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-bold uppercase">
          <span>Profile Strength</span>
          <span>98%</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-thick">
          <div className="h-full bg-lime" style={{ width: "98%" }} />
        </div>
      </div>

      <section className="mt-6 rounded-2xl border-thick p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">About</h2>
        <dl className="mt-3 space-y-2 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          <Row k="Email" v="amir@tu-berlin.de" />
          <Row k="University" v="TU Berlin" />
          <Row k="VISA" v="Accepted" />
          <Row k="German" v="B1" />
        </dl>
      </section>

      <section className="mt-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full border-thick px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">Preferred Cities</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Berlin", "Remote"].map((s) => (
            <span key={s} className="rounded-full border-thick px-3 py-1 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border-thick p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-foreground/60">Settings</h2>
        <dl className="mt-3 space-y-2 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          <Row k="Notifications" v="ON" />
          <Row k="Language" v="English" />
          <Row k="Privacy" v="Manage" />
          <Row k="Help and Support" v="→" />
        </dl>
      </section>

      <button
        onClick={logout}
        className="mt-6 w-full rounded-full border-thick py-3 text-sm font-bold uppercase tracking-wide"
        style={{ background: "var(--salmon)" }}
      >
        Logout
      </button>

      <BottomNav />
    </main>
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