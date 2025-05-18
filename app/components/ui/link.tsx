import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "app/lib/utils";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router";

const linkVariants = cva("text-blue-700 hover:underline", {
  variants: {},
  defaultVariants: {},
});

export type LinkProps = RouterLinkProps & VariantProps<typeof linkVariants>;

export function Link({ className, ...props }: LinkProps) {
  return <RouterLink className={cn(linkVariants({ className }))} {...props} />;
}
