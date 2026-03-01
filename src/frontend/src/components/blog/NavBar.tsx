import { Link, useLocation } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { motion } from "motion/react";

export function NavBar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        {/* Blog name */}
        <Link to="/" className="group flex items-center gap-2 no-underline">
          <motion.span
            className="font-display text-xl font-semibold text-foreground tracking-tight"
            whileHover={{ x: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            My Blog
          </motion.span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-6" aria-label="Main navigation">
          <Link
            to="/"
            className={[
              "text-sm font-sans transition-colors duration-150",
              isHome
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Home
          </Link>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 font-sans"
            aria-label="Admin panel"
          >
            <PenLine size={12} strokeWidth={1.5} />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
