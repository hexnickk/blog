import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Neobrutalist: hard borders, no rounded corners
        "h-10 w-full min-w-0 border border-foreground bg-card px-3 py-2 text-base outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
