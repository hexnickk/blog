import { Link } from "app/components/ui/link";
import { LanguageToggle } from "app/components/language-toggle";

export function Navigation() {
  return (
    <nav className="relative mb-8 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-semibold hover:underline">
          Blog
        </Link>
        <span className="text-gray-400">/</span>
        <Link to="/projects" className="font-semibold hover:underline">
          Projects
        </Link>
      </div>
      <div className="absolute right-0">
        <LanguageToggle />
      </div>
    </nav>
  );
}
