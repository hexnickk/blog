import { type ComponentProps } from "react";
import { cn } from "app/lib/utils";
import { useLocation } from "react-router";
import { Link } from "./ui/link";
import { LanguageToggle } from "./language-toggle";

export function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="relative mb-8 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className={cn(
            "font-semibold",
            pathname === "/" && "bg-black text-white",
          )}
        >
          Blog
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          to="/projects"
          className={cn(
            "font-semibold",
            pathname === "/projects" && "bg-black text-white",
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

export type LayoutProps = ComponentProps<"div">;

export function Layout({ children, className, ...rest }: LayoutProps) {
  return (
    <div
      className={cn(
        "m-auto flex min-h-screen max-w-7xl flex-col p-6 md:p-12",
        className,
      )}
      {...rest}
    >
      <main>
        <Navigation />
        {children}
      </main>
    </div>
  );
}
