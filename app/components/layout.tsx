import type { ComponentProps } from "react";
import { Header } from "app/components/header";
import { cn } from "app/lib/utils";

export type LayoutProps = ComponentProps<"div">;

export function Layout({ children, className, ...rest }: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen m-auto max-w-2xl px-4 py-4 flex flex-col",
        className,
      )}
      {...rest}
    >
      <Header />

      <main className="flex-1">{children}</main>
    </div>
  );
}
