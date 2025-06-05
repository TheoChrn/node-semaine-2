import { buttonVariants } from "@/src/components/variants/button-variants";
import { Link, LinkComponentProps } from "@tanstack/react-router";

import type { VariantProps } from "class-variance-authority";

interface ButtonLinkProps
  extends LinkComponentProps,
    VariantProps<typeof buttonVariants> {}
export const ButtonLink = ({
  className,
  variant = "link",
  ...props
}: ButtonLinkProps) => (
  <Link {...props} className={buttonVariants({ variant, className })} />
);
