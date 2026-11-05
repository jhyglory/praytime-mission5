"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

export function AnchorLink({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !href?.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", href);
    if (event.detail === 0) target.querySelector<HTMLElement>("h1,h2")?.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <a href={href} onClick={navigate} {...props} />;
}
