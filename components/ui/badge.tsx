import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        glossy: "border-transparent gradient-primary text-white shadow-glow glossy",
        glossySecondary: "border-transparent gradient-secondary text-foreground shadow-glow glossy",
        glossyAccent: "border-transparent gradient-accent text-white shadow-glow glossy",
      },
      animation: {
        none: "",
        bounce: "animate-bounce-in",
        wiggle: "hover-wiggle",
        float: "hover-float",
        pulse: "animate-pulse-custom",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, animation, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, animation }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
