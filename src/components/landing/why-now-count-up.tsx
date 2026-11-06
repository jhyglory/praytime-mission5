"use client";

import { useEffect, useRef } from "react";

const sessionPrefix = "praytime:why-now-countup:v3";
const duration = 3000;
type CountState = "pending" | "running" | "complete";

// SSR and accessible spans stay final. Only the visual spans/fills are enhanced.
export function WhyNowCountUp() {
  const seen = useRef(new Set<number>());

  useEffect(() => {
    const grid = document.getElementById("why-stats");
    if (!grid) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const counters = [...grid.querySelectorAll<HTMLElement>("[data-stat-number]")].flatMap(number => {
      const card = number.closest<HTMLElement>(".stat-card");
      if (!card) return [];
      const rate = Number(number.dataset.rate);
      return [{ number, card, rate, fill: card.querySelector<HTMLElement>(".stat-fill"), key: `${sessionPrefix}:${rate}`, state: "pending" as CountState, ran: false, inView: false, startedAt: 0 }];
    });
    if (!counters.length) return;
    let frame = 0;

    const syncState = () => {
      for (const counter of counters) {
        counter.card.dataset.countState = counter.state;
        counter.card.dataset.countRuns = counter.ran ? "1" : "0";
      }
      grid.dataset.countState = counters.some(counter => counter.state === "running") ? "running" : counters.every(counter => counter.state === "complete") ? "complete" : "pending";
      grid.dataset.countRuns = counters.some(counter => counter.ran) ? "1" : "0";
    };

    const remember = (counter: typeof counters[number]) => {
      seen.current.add(counter.rate);
      try { sessionStorage.setItem(counter.key, "done"); } catch { /* Once per mount when storage is blocked. */ }
    };

    const finish = (counter: typeof counters[number]) => {
      counter.number.textContent = `${counter.rate.toFixed(1)}%`;
      counter.fill?.style.removeProperty("transform");
      counter.state = "complete";
      observer?.unobserve(counter.card);
      if (!counters.some(item => item.state === "running")) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      syncState();
    };

    // At most two cards share one pending rAF, with independent start times.
    const tick = (now: number) => {
      frame = 0;
      for (const counter of counters) {
        if (counter.state !== "running") continue;
        const progress = Math.min(1, Math.max(0, (now - counter.startedAt) / duration));
        const eased = 1 - (1 - progress) ** 3;
        counter.number.textContent = `${Math.min(counter.rate, counter.rate * eased).toFixed(1)}%`;
        if (counter.fill) counter.fill.style.transform = `scaleX(${eased})`;
        if (progress === 1) finish(counter);
      }
      if (counters.some(counter => counter.state === "running")) frame = requestAnimationFrame(tick);
    };

    const start = (counter: typeof counters[number]) => {
      if (counter.state !== "pending" || !counter.inView || document.hidden) return;
      remember(counter);
      if (reduced.matches) { finish(counter); return; }
      counter.state = "running";
      counter.ran = true;
      counter.startedAt = performance.now();
      syncState();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
      for (const entry of entries) {
        const counter = counters.find(item => item.card === entry.target);
        if (!counter || counter.state === "complete") continue;
        counter.inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (!entry.isIntersecting && counter.state === "running") finish(counter);
        else start(counter);
      }
    }, { threshold: 0.5, rootMargin: "0px 0px -15% 0px" });

    for (const counter of counters) {
      let sessionSeen = seen.current.has(counter.rate);
      try { sessionSeen ||= sessionStorage.getItem(counter.key) === "done"; } catch { /* Keep SSR fallback available. */ }
      if (sessionSeen || reduced.matches || !observer) {
        remember(counter);
        finish(counter);
      } else {
        counter.number.textContent = "0.0%";
        if (counter.fill) counter.fill.style.transform = "scaleX(0)";
        observer.observe(counter.card);
      }
    }
    syncState();

    const onReducedChange = () => {
      if (!reduced.matches) return;
      for (const counter of counters) { remember(counter); finish(counter); }
    };
    const onVisibilityChange = () => {
      for (const counter of counters) {
        if (document.hidden && counter.state === "running") finish(counter);
        else if (!document.hidden) start(counter);
      }
    };
    reduced.addEventListener("change", onReducedChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", onReducedChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      counters.forEach(finish);
    };
  }, []);

  return null;
}
