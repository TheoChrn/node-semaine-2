import { VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef } from "react";
import { cva } from "class-variance-authority";
import { classVariants } from "@/src/lib/utils";

export const wrapperVariants = cva("max-w-lg w-full mx-auto");

interface WrapperProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof wrapperVariants> {}

export const Wrapper = ({ className, ...props }: WrapperProps) => (
  <div {...props} className={classVariants(wrapperVariants({ className }))} />
);
