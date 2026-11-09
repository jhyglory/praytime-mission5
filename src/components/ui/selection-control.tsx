import type { InputHTMLAttributes } from "react";

export function SelectionControl({
  label,
  type = "checkbox",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  type?: "checkbox" | "radio";
}) {
  return (
    <label className="selection-control flex min-w-0 items-center gap-3 min-h-[46px] py-2.5 font-normal leading-[26px] cursor-pointer">
      <input type={type} {...props} />
      <span>{label}</span>
    </label>
  );
}
