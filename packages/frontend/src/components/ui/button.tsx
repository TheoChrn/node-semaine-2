import { buttonVariants } from "@/src/components/variants/button-variants";
import * as Ariakit from "@ariakit/react";
import { VariantProps } from "tailwind-variants";

export interface ButtonProps
  extends Ariakit.ButtonProps,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  className,
  variant = "default",
  ...props
}: ButtonProps) => (
  <Ariakit.Button
    accessibleWhenDisabled
    className={buttonVariants({ className, variant })}
    {...props}
  />
);
