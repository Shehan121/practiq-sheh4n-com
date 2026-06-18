import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Heart, FileText, User, Plus } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/matches", label: "Matches", icon: Heart },
  { to: "/applications", label: "Apps", icon: FileText },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 border-thick rounded-full bg-background px-3 py-2">
      <ul className="flex items-center justify-between">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  active ? "bg-lime text-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                {active && <span>{label}</span>}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            aria-label="Add"
            className="flex h-9 w-9 items-center justify-center rounded-full border-thick text-foreground"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        </li>
      </ul>
    </nav>
  );
}