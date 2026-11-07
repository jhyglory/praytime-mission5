"use client";

import { useEffect, useRef, useState } from "react";
import { AnchorLink } from "@/components/landing/anchor-link";

const links = [
  { href: "#how-it-works", label: "작동 방식" },
  { href: "#prayer-choice", label: "기도와 선택" },
  { href: "#faq", label: "FAQ" },
] as const;

export function ActiveSectionNav() {
  const navigation = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const header = navigation.current?.closest("header");
    const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
    if (!header || !sections.length || typeof IntersectionObserver === "undefined") return;

    const destinations = new Set<string>(links.map(link => link.href));
    const visible = new Set<Element>();
    let observer: IntersectionObserver | undefined;
    let current: Element | null = null;
    let activeHref: string | null = null;
    let resizeFrame = 0;
    let disposed = false;

    const configure = () => {
      if (disposed) return;
      observer?.disconnect();
      visible.clear();
      current = null;

      const height = window.innerHeight;
      const headerHeight = Math.min(header.getBoundingClientRect().height, height * 0.3);
      const center = headerHeight + (height - headerHeight) / 2;
      const halfBand = Math.min(48, Math.max(16, height * 0.06));
      const top = Math.max(0, Math.round(center - halfBand));
      const bottom = Math.max(0, Math.round(height - center - halfBand));

      observer = new IntersectionObserver(entries => {
        if (disposed) return;
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }

        // Keep the current section until it leaves the narrow center band.
        // This small hysteresis avoids swapping links at every boundary pixel.
        if (!current || !visible.has(current)) {
          current = null;
          let nearest = Infinity;
          for (const section of sections) {
            if (!visible.has(section)) continue;
            const rect = section.getBoundingClientRect();
            const distance = rect.top <= center && rect.bottom >= center
              ? 0
              : Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center));
            if (distance < nearest) {
              nearest = distance;
              current = section;
            }
          }
        }

        const href = current?.id ? `#${current.id}` : null;
        const next = href && destinations.has(href) ? href : null;
        if (next !== activeHref) {
          activeHref = next;
          setActive(next);
        }
      }, { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 });
      sections.forEach(section => observer?.observe(section));
    };

    const resize = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        configure();
      });
    };

    configure();
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      disposed = true;
      observer?.disconnect();
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <nav ref={navigation} className="section-navigation" aria-label="주요 메뉴">
    {links.map(({ href, label }) => <AnchorLink key={href} href={href} aria-current={active === href ? "location" : undefined}>{label}</AnchorLink>)}
  </nav>;
}
