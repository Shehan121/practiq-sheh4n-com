import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Heart, FileText, User, Plus } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/matches", label: "Matches", icon: Heart },
  { to: "/applications", label: "Apps", icon: FileText },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed bottom-4 left-1/2 z-50 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 border-thick rounded-full bg-background px-3 py-2"
    >
      <ul className="flex items-center justify-between">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className="relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full bg-lime"
                  />
                )}
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                {active && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </Link>
            </li>
          );
        })}
        <li>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            type="button"
            aria-label="Add"
            className="flex h-9 w-9 items-center justify-center rounded-full border-thick text-foreground"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </motion.button>
        </li>
      </ul>
    </motion.nav>
  );
}