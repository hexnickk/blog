import { type ComponentProps } from "react";
import { cn } from "app/lib/utils";
import { Navigation } from "app/components/navigation";

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
      {/* header */}
      <main className="flex-1 border-[5px] border-black p-8 md:p-16">
        <Navigation />
        {children}
      </main>
      {/* <footer></footer> */}
    </div>
  );
}
