import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "app/lib/utils";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router";

const linkVariants = cva(
  "text-foreground font-bold underline underline-offset-4 decoration-solid decoration-[2px] transition-all hover:bg-black hover:text-white hover:no-underline px-1",
  {
    variants: {},
    defaultVariants: {},
  },
);

export type LinkProps = RouterLinkProps & VariantProps<typeof linkVariants>;

export function Link({ className, ...props }: LinkProps) {
  return <RouterLink className={cn(linkVariants({ className }))} {...props} />;
}
