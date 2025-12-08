import { Link } from "app/components/ui/link";
import { LanguageToggle } from "app/components/language-toggle";
import { useLocation } from "react-router";
import { cn } from "app/lib/utils";

export function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="relative mb-8 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className={cn(
            "font-semibold hover:underline",
            pathname === "/" && "bg-black text-white no-underline"
          )}
        >
          Blog
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          to="/projects"
          className={cn(
            "font-semibold hover:underline",
            pathname === "/projects" && "bg-black text-white no-underline"
          )}
        >
          Projects
        </Link>
      </div>
      <div className="absolute right-0">
        <LanguageToggle />
      </div>
    </nav>
  );
}
