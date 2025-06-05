import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef } from "react";

const errorMessageVariants = cva("text-destructive");

interface ErrorMessageProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof errorMessageVariants> {
  message: string;
}
export const ErrorMessage = ({
  className,
  message,
  ...props
}: ErrorMessageProps) => (
  <span className={errorMessageVariants({ className })} {...props}>
    {message}
  </span>
);
