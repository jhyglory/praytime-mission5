"use client";

import { useEffect, useRef } from "react";

const sessionKey = "praytime:why-now-countup:v1";
const duration = 750;

// Final values are rendered by the Server Component. This only enhances the
// visual spans after hydration; accessible values and no-JS output stay final.
export function WhyNowCountUp() {
  const hasRun = useRef(false);

  useEffect(() => {
    const grid = document.getElementById("why-stats");
    if (!grid) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const counters = [...grid.querySelectorAll<HTMLElement>("[data-stat-number]")].map(number => ({
      number,
      rate: Number(number.dataset.rate),
      fill: number.closest(".stat-card")?.querySelector<HTMLElement>(".stat-fill"),
    }));
    let frame = 0;
    let inView = false;

    const finish = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      observer?.disconnect();
      counters.forEach(({ number, rate, fill }) => {
        number.textContent = `${rate.toFixed(1)}%`;
        fill?.style.removeProperty("transform");
      });
      grid.dataset.countState = "complete";
    };

    const remember = () => {
      hasRun.current = true;
      try { sessionStorage.setItem(sessionKey, "done"); } catch { /* Once per mount when storage is blocked. */ }
    };

    const start = () => {
      if (hasRun.current || !inView || document.hidden) return;
      remember();
      if (reduced.matches) { finish(); return; }
      grid.dataset.countState = "running";
      grid.dataset.countRuns = "1";
      counters.forEach(({ number, fill }) => {
        number.textContent = "0.0%";
        if (fill) fill.style.transform = "scaleX(0)";
      });
      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
        const eased = 1 - (1 - progress) ** 3;
        counters.forEach(({ number, rate, fill }) => {
          number.textContent = `${Math.min(rate, rate * eased).toFixed(1)}%`;
          if (fill) fill.style.transform = `scaleX(${eased})`;
        });
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };

    const onReducedChange = () => {
      if (!reduced.matches) return;
      remember();
      observer?.disconnect();
      finish();
    };
    const onVisibilityChange = () => {
      if (document.hidden && hasRun.current) finish();
      else start();
    };

    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.2);
      if (hasRun.current && !inView) finish();
      else start();
    }, { threshold: 0.2 });

    let seenThisSession = false;
    try { seenThisSession = sessionStorage.getItem(sessionKey) === "done"; } catch { /* Final SSR content is still available. */ }
    if (hasRun.current || seenThisSession || reduced.matches || !observer) {
      remember();
      finish();
      return;
    }

    grid.dataset.countState = "pending";
    observer.observe(grid);
    reduced.addEventListener("change", onReducedChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener("change", onReducedChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      finish();
    };
  }, []);

  return null;
}
