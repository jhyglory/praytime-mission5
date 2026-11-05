import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function buttonClass(variant: "primary" | "secondary" = "primary", className?: string) {
  return cn("pt-button", `pt-button--${variant}`, className);
}

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
