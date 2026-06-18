import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

type Item = { label: string; anchor?: string; route?: string };

const items: Item[] = [
  { label: "Home", anchor: "home" },
  { label: "Discover", anchor: "discover" },
  { label: "How it works", anchor: "how" },
  { label: "Matches", anchor: "matches" },
  { label: "Applications", anchor: "applications" },
  { label: "Profile", route: "/profile" },
];

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleAnchor = (anchor: string) => {
    setOpen(false);
    if (pathname === "/home") {
      const el = document.getElementById(anchor);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate({ to: "/home", hash: anchor });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "backdrop-blur-md bg-background/80 border-b-[2.5px] border-foreground" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link
            to="/home"
            onClick={(e) => {
              if (pathname === "/home") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2"
          >
            <span
              className="font-display text-2xl uppercase tracking-tight lg:text-3xl"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}
            >
              Practiq
            </span>
            <span
              className="italic leading-none"
              style={{ fontFamily: "var(--font-serif-italic)", fontSize: "1.5rem", color: "var(--lime)", WebkitTextStroke: "1.5px var(--foreground)" }}
            >
              .
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-10 w-10 items-center justify-center rounded-full border-thick bg-background"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
              className="flex items-center gap-2 rounded-full border-thick bg-lime px-4 py-2 text-xs font-bold uppercase text-black tracking-wide lg:px-5 lg:py-2.5 lg:text-sm"
            >
              <span className="hidden sm:inline">Menu</span>
              <Menu className="h-4 w-4" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[min(440px,92vw)] flex-col overflow-y-auto border-l-[2.5px] border-foreground bg-background p-8"
            >
              <div className="flex items-center justify-between">
                <p className="italic text-foreground/60" style={{ fontFamily: "var(--font-serif-italic)" }}>
                  Navigation
                </p>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-thick"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-1">
                {items.map((item, i) => {
                  const active = item.route ? pathname === item.route : false;
                  const inner = (
                    <div
                      className={`group flex items-baseline justify-between border-b-[2.5px] border-foreground/15 py-3.5 transition-colors hover:border-foreground ${active ? "border-foreground" : ""}`}
                    >
                      <span
                        className="font-display uppercase leading-none transition-transform group-hover:translate-x-1"
                        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 2.75rem)", letterSpacing: "-0.03em" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="font-mono text-xs"
                        style={{ fontFamily: "var(--font-mono)", color: active ? "var(--purple-match)" : "inherit" }}
                      >
                        0{i + 1}
                      </span>
                    </div>
                  );
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {item.route ? (
                        <Link to={item.route} className="block">{inner}</Link>
                      ) : (
                        <button type="button" onClick={() => handleAnchor(item.anchor!)} className="block w-full text-left">
                          {inner}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-8 flex flex-wrap gap-2">
                <Link to="/matches" className="rounded-full border-thick px-4 py-2 text-xs font-bold uppercase hover:bg-lime">Full matches →</Link>
                <Link to="/applications" className="rounded-full border-thick px-4 py-2 text-xs font-bold uppercase hover:bg-lime">My quests →</Link>
              </div>

              <div className="mt-auto pt-10">
                <p className="text-xs uppercase tracking-wider text-foreground/50" style={{ fontFamily: "var(--font-mono)" }}>
                  Practiq © 2026
                </p>
                <p className="mt-1 italic text-foreground/70" style={{ fontFamily: "var(--font-serif-italic)" }}>
                  learn / grow / achieve
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}