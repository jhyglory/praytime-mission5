"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AccordionContent } from "@/components/ui/accordion";
import { MOTION_EASING } from "@/lib/motion";

type FaqAnswerProps = { id: string; labelledBy: string; open: boolean; children: ReactNode };
const duration = 280;

/** Keep Radix semantics and native hidden while the visible panel settles. */
export function FaqAnswer({ id, labelledBy, open, children }: FaqAnswerProps) {
  const region = useRef<HTMLDivElement>(null);
  const [initialOpen] = useState(open);
  const initialized = useRef(false);
  const player = useRef<Animation | null>(null);

  useLayoutEffect(() => () => {
    initialized.current = false;
    if (player.current) {
      player.current.onfinish = null;
      player.current.cancel();
      player.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    const element = region.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (!player.current) return;
      player.current.onfinish = null;
      player.current.cancel();
      player.current = null;
    };
    const settle = () => {
      // Hide before dropping the animation's final frame on a closed panel.
      element.hidden = !open;
      for (const property of ["height", "opacity", "padding-top", "overflow"]) element.style.removeProperty(property);
      stop();
      element.dataset.faqMotion = open ? "open" : "closed";
    };

    if (!initialized.current || reduced.matches || typeof element.animate !== "function") {
      initialized.current = true;
      settle();
    } else {
      // Read the displayed frame before cancelling a rapid reversal.
      const wasHidden = element.hidden;
      const computed = getComputedStyle(element);
      const fromHeight = wasHidden ? 0 : element.getBoundingClientRect().height;
      const fromOpacity = wasHidden ? 0 : Number(computed.opacity);
      const fromPadding = wasHidden ? 0 : Number.parseFloat(computed.paddingTop);
      element.style.height = `${fromHeight}px`;
      element.style.opacity = String(fromOpacity);
      element.style.paddingTop = `${fromPadding}px`;
      stop();
      element.hidden = false;

      let toHeight = 0, toPadding = 0;
      if (open) {
        // One natural endpoint measurement; the final panel returns to auto.
        element.style.removeProperty("height");
        element.style.removeProperty("padding-top");
        toPadding = Number.parseFloat(getComputedStyle(element).paddingTop);
        toHeight = element.getBoundingClientRect().height;
      }
      element.style.height = `${fromHeight}px`;
      element.style.paddingTop = `${fromPadding}px`;
      element.style.overflow = "hidden";
      element.dataset.faqMotion = open ? "opening" : "closing";
      const animation = element.animate([
        { height: `${fromHeight}px`, opacity: fromOpacity, paddingTop: `${fromPadding}px` },
        { height: `${toHeight}px`, opacity: open ? 1 : 0, paddingTop: `${toPadding}px` },
      ], { duration, easing: MOTION_EASING, fill: "both" });
      player.current = animation;
      animation.onfinish = () => {
        if (player.current === animation) settle();
      };
    }

    const onReduced = () => { if (reduced.matches) settle(); };
    reduced.addEventListener("change", onReduced);
    return () => reduced.removeEventListener("change", onReduced);
  }, [open]);

  // The controller owns hidden after hydration; React keeps its SSR value stable.
  // Closing content leaves the accessibility tree immediately, before its fade.
  return <AccordionContent ref={region} forceMount id={id} aria-labelledby={labelledBy}
    hidden={!initialOpen} aria-hidden={open ? undefined : true} inert={open ? undefined : true}
    data-faq-motion={initialOpen ? "open" : "closed"} data-faq-duration={duration}>
    {children}
  </AccordionContent>;
}
