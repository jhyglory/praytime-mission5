import type { InputHTMLAttributes } from "react";

export function SelectionControl({ label, type = "checkbox", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string; type?: "checkbox" | "radio" }) {
  return <label className="selection-control"><input type={type} {...props} /><span>{label}</span></label>;
}
