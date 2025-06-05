import { buttonVariants } from "@/src/components/variants/button-variants";
import * as Ariakit from "@ariakit/react";
import { type VariantProps } from "class-variance-authority";

export interface ButtonProps
  extends Ariakit.ButtonProps,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, ...props }: ButtonProps) => (
  <Ariakit.Button
    accessibleWhenDisabled
    className={buttonVariants({ className, variant })}
    {...props}
  />
);
