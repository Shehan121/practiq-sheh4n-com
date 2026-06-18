import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const items = [
  { to: "/home", label: "Home" },
  { to: "/matches", label: "Matches" },
  { to: "/applications", label: "Applications" },
  { to: "/profile", label: "Profile" },
] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

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
          <Link to="/home" className="flex items-center gap-2">
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

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            className="flex items-center gap-2 rounded-full border-thick bg-lime px-4 py-2 text-xs font-bold uppercase tracking-wide lg:px-5 lg:py-2.5 lg:text-sm"
          >
            <span className="hidden sm:inline">Menu</span>
            <Menu className="h-4 w-4" strokeWidth={2.5} />
          </motion.button>
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
              className="fixed right-0 top-0 z-50 flex h-full w-[min(420px,90vw)] flex-col border-l-[2.5px] border-foreground bg-background p-8"
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

              <nav className="mt-10 flex flex-col gap-2">
                {items.map((item, i) => {
                  const active = pathname === item.to;
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={item.to}
                        className={`group flex items-baseline justify-between border-b-[2.5px] border-foreground/20 py-4 transition-colors hover:border-foreground ${
                          active ? "border-foreground" : ""
                        }`}
                      >
                        <span
                          className="font-display text-4xl uppercase leading-none lg:text-5xl"
                          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="font-mono text-xs"
                          style={{ fontFamily: "var(--font-mono)", color: active ? "var(--purple-match)" : "inherit" }}
                        >
                          0{i + 1}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

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