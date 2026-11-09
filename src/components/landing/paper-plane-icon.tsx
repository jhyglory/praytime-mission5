import type { SVGProps } from "react";

// Shared decorative send/share mark; keep the original 11px card / 18px
// particle slots and their surrounding opacity and animation layers.
export function PaperPlaneIcon({ width = 11, height = 11, style, ...props }: SVGProps<SVGSVGElement>) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f1f1ee"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    data-share-icon="paper-plane"
    style={{ position: "absolute", display: "block", left: 0, top: 0, ...style }}
    {...props}
  >
    <path d="M22 2 15 22 11 13 2 9 22 2Z" />
    <path d="M11 13 22 2" />
  </svg>;
}
