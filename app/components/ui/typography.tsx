import { cn } from "app/lib/utils";
import type { ComponentProps } from "react";

export type H1Props = ComponentProps<"h1">;

export function H1({ className, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        "text-primary mb-4 scroll-m-20 text-2xl font-bold md:text-3xl",
        className,
      )}
      {...props}
    >
      {props.children}
    </h1>
  );
}

export type H2Props = ComponentProps<"h2">;

export function H2({ className, children, ...props }: H2Props) {
  return (
    <h2
      className={cn(
        "text-secondary mb-3 scroll-m-20 text-xl font-medium first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export type H3Props = ComponentProps<"h3">;

export function H3({ className, children, ...props }: H3Props) {
  return (
    <h3
      className={cn(
        "text-chart-3 mb-2 scroll-m-20 text-lg font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export type H4Props = ComponentProps<"h4">;

export function H4({ className, children, ...props }: H4Props) {
  return (
    <h4
      className={cn(
        "text-chart-4 scroll-m-20 text-base font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export type PProps = ComponentProps<"p">;

export function P({ className, children, ...props }: PProps) {
  return (
    <p
      className={cn(
        "text-foreground leading-7 [&:not(:last-child)]:mb-3",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export type BlockquoteProps = ComponentProps<"blockquote">;

export function Blockquote({ className, children, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "border-border text-muted-foreground mt-6 border-l-2 pl-6 italic",
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export type MutedProps = ComponentProps<"p">;

export function Muted({ className, children, ...props }: MutedProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props}>
      {children}
    </p>
  );
}
