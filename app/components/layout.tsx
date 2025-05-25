import { type ComponentProps } from "react";
import { cn } from "app/lib/utils";

export type LayoutProps = ComponentProps<"div">;

export function Layout({ children, className, ...rest }: LayoutProps) {
  return (
    <div
      className={cn(
        "m-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 backdrop-blur-[2px]",
        className,
      )}
      {...rest}
    >
      {/* header */}
      <main className="flex-1">{children}</main>
      {/* <footer></footer> */}
    </div>
  );
}
