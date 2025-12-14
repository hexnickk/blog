import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "app/lib/utils";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router";

const cardLinkVariants = cva(
  "group block border-[5px] border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] hover:bg-black hover:text-white md:p-8 [&_h3]:underline [&_h3]:decoration-solid [&_h3]:decoration-[3px] [&_h3]:underline-offset-4",
  {
    variants: {},
    defaultVariants: {},
  },
);

export type BlockLinkProps = RouterLinkProps &
  VariantProps<typeof cardLinkVariants>;

export function BlockLink({ className, ...props }: BlockLinkProps) {
  return (
    <RouterLink className={cn(cardLinkVariants({ className }))} {...props} />
  );
}
