// Adapted from shadcn/ui's MIT-licensed Radix Button registry source.
// See docs/licenses/shadcn-ui-LICENSE.md and README.md.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Shared Tailwind utilities retain PrayTime styling; semantic hooks serve controllers/tests.
const buttonVariants = cva(
  "pt-button inline-flex h-15 min-h-15 items-center justify-center rounded-action px-6 text-center text-xl font-bold leading-7 text-[#f1f1ee] [box-shadow:0_5px_16px_rgb(0_0_0/12%)] transition-[background-color,opacity] duration-[var(--motion-ui-duration)] ease-praytime",
  {
    variants: {
      variant: {
        primary: "pt-button--primary bg-primary",
        secondary:
          "pt-button--secondary bg-surface border border-[var(--line)]",
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
  },
);

type ButtonProps = Omit<React.ComponentProps<"button">, "disabled"> &
  Omit<VariantProps<typeof buttonVariants>, "state"> &
  (
    | {
        asChild?: false;
        disabled?: boolean;
        state?: "default" | "disabled" | "submitting";
      }
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
  const resolvedState = isSubmitting
    ? "submitting"
    : isDisabled
      ? "disabled"
      : "default";

  return (
    <Comp
      {...props}
      data-slot="button"
      data-state={resolvedState}
      className={cn(
        buttonVariants({ variant, state: resolvedState, className }),
      )}
      disabled={asChild ? undefined : isDisabled}
      aria-busy={isSubmitting || undefined}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
