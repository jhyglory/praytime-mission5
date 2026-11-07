// Adapted from shadcn/ui's MIT-licensed Radix Button registry source.
// See docs/SHADCN_ADOPTION.md and docs/licenses/shadcn-ui-LICENSE.md.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Retain the approved CSS contract instead of importing shadcn's default theme.
const buttonVariants = cva("pt-button", {
  variants: {
    variant: {
      primary: "pt-button--primary",
      secondary: "pt-button--secondary",
    },
    state: {
      default: "",
      disabled: "pt-button--disabled",
      submitting: "pt-button--submitting",
    },
  },
  defaultVariants: {
    variant: "primary",
    state: "default",
  },
});

type ButtonProps = Omit<React.ComponentProps<"button">, "disabled"> &
  Omit<VariantProps<typeof buttonVariants>, "state"> & (
    | { asChild?: false; disabled?: boolean; state?: "default" | "disabled" | "submitting" }
    | { asChild: true; disabled?: never; state?: never }
  );

function Button({
  className,
  variant,
  state,
  disabled,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isSubmitting = state === "submitting";
  const isDisabled = Boolean(disabled || state === "disabled" || isSubmitting);
  const resolvedState = isSubmitting ? "submitting" : isDisabled ? "disabled" : "default";

  return (
    <Comp
      {...props}
      data-slot="button"
      data-state={resolvedState}
      className={cn(buttonVariants({ variant, state: resolvedState, className }))}
      disabled={asChild ? undefined : isDisabled}
      aria-busy={isSubmitting || undefined}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
