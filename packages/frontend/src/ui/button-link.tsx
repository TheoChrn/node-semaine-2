import { buttonVariants } from "@/src/styles/variants/button-variants";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";

interface ButtonLinkProps
  extends LinkComponentProps,
    VariantProps<typeof buttonVariants> {}
export const ButtonLink = ({ className, ...props }: ButtonLinkProps) => (
  <Link {...props} className={buttonVariants({ className, variant: "link" })} />
);
