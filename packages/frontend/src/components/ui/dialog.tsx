import * as Ariakit from "@ariakit/react";
import { cva, VariantProps } from "class-variance-authority";

const dialogVariant = cva(
  "fixed top-1/2 left-1/2 max-w-prose w-full  -translate-x-1/2 -translate-y-1/2 bg-background p-8 rounded-lg  rounded-lg border  shadow-lg"
);

interface DialogProps
  extends Ariakit.DialogProps,
    VariantProps<typeof dialogVariant> {}
export const Dialog = ({ className, ...props }: DialogProps) => (
  <Ariakit.Dialog
    portal={false}
    open={true}
    className={dialogVariant({ className })}
    backdrop={<div className="bg-black/70"></div>}
    {...props}
  />
);

