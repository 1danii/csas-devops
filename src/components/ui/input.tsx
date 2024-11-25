import * as React from "react";

import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";

const Input = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "size"> & {
    size?: VariantProps<typeof buttonVariants>["size"];
  }
>(({ className, size = "default", type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        buttonVariants({ variant: "outline", size }),
        "font-normal placeholder:text-gray-11 hover:bg-primary",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
