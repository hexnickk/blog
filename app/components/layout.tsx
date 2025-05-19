import type { ComponentProps } from "react";
import { cn } from "app/lib/utils";

export type LayoutProps = ComponentProps<"div">;

export function Layout({ children, className, ...rest }: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen m-auto max-w-3xl px-4 py-8 flex flex-col",
        className,
      )}
      {...rest}
    >
      {/* header */}
      <main className="flex-1">{children}</main>
      {/* footer */}
    </div>
  );
}
