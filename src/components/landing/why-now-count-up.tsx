"use client";

import { useEffect } from "react";

const duration = 1400;
const startDelay = 700;
const visibilityThreshold = 0.4;
type CountState = "pending" | "waiting" | "running" | "paused" | "complete";

// SSR and accessible spans stay final. Only the visual spans/fills are enhanced.
export function WhyNowCountUp() {
  useEffect(() => {
    const grid = document.getElementById("why-stats");
    if (!grid) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const counters = [...grid.querySelectorAll<HTMLElement>("[data-stat-number]")].flatMap(number => {
      const card = number.closest<HTMLElement>(".stat-card");
      if (!card) return [];
      return [{ number, card, rate: Number(number.dataset.rate), fill: card.querySelector<HTMLElement>(".stat-fill"), state: "pending" as CountState, ran: false, inView: false, startedAt: 0, elapsed: 0, timer: 0 }];
    });
    if (!counters.length) return;
    let frame = 0;
    let disposed = false;

    const syncState = () => {
      for (const counter of counters) {
        counter.card.dataset.countState = counter.state;
        counter.card.dataset.countRuns = counter.ran ? "1" : "0";
      }
      grid.dataset.countState = counters.some(counter => counter.state === "running") ? "running" : counters.some(counter => counter.state === "paused") ? "paused" : counters.some(counter => counter.state === "waiting") ? "waiting" : counters.every(counter => counter.state === "complete") ? "complete" : "pending";
      grid.dataset.countRuns = counters.some(counter => counter.ran) ? "1" : "0";
    };

    const clearDelay = (counter: typeof counters[number]) => {
      window.clearTimeout(counter.timer);
      counter.timer = 0;
    };

    const finish = (counter: typeof counters[number]) => {
      clearDelay(counter);
      counter.number.textContent = `${counter.rate.toFixed(1)}%`;
      counter.fill?.style.removeProperty("transform");
      counter.state = "complete";
      observer?.unobserve(counter.card);
    };

    const pause = (counter: typeof counters[number], now: number) => {
      if (counter.state === "waiting") {
        clearDelay(counter);
        counter.state = "pending";
        return;
      }
      if (counter.state !== "running") return;
      counter.elapsed = Math.min(duration, counter.elapsed + Math.max(0, now - counter.startedAt));
      counter.state = "paused";
    };

    const stopIdleFrame = () => {
      if (counters.some(counter => counter.state === "running")) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Each card has its own active time, while number and fill share one cubic progress.
    const tick = (now: number) => {
      frame = 0;
      if (disposed) return;
      for (const counter of counters) {
        if (counter.state !== "running") continue;
        if (document.hidden || !counter.inView) { pause(counter, now); continue; }
        const progress = Math.min(1, Math.max(0, (counter.elapsed + now - counter.startedAt) / duration));
        const eased = 1 - (1 - progress) ** 3;
        counter.number.textContent = `${Math.min(counter.rate, counter.rate * eased).toFixed(1)}%`;
        if (counter.fill) counter.fill.style.transform = `scaleX(${eased})`;
        if (progress === 1) finish(counter);
      }
      syncState();
      if (counters.some(counter => counter.state === "running")) frame = requestAnimationFrame(tick);
    };

    const begin = (counter: typeof counters[number], now: number) => {
      counter.state = "running";
      counter.ran = true;
      counter.startedAt = now;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const start = (counter: typeof counters[number], now: number) => {
      if (disposed || counter.state === "complete" || counter.state === "running" || counter.state === "waiting" || !counter.inView || document.hidden) return;
      if (reduced.matches) { finish(counter); return; }
      // Only the first start waits; an interrupted count resumes its own progress.
      if (counter.ran) { begin(counter, now); return; }
      counter.state = "waiting";
      counter.timer = window.setTimeout(() => {
        counter.timer = 0;
        if (disposed) return;
        if (!counter.inView || document.hidden) counter.state = "pending";
        else begin(counter, performance.now());
        syncState();
      }, startDelay);
    };

    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
      if (disposed) return;
      const now = performance.now();
      for (const entry of entries) {
        const counter = counters.find(item => item.card === entry.target);
        if (!counter || counter.state === "complete") continue;
        counter.inView = entry.isIntersecting && entry.intersectionRatio >= visibilityThreshold;
        if (counter.inView) start(counter, now);
        else pause(counter, now);
      }
      stopIdleFrame();
      syncState();
    }, { threshold: visibilityThreshold, rootMargin: "0px" });

    // No persisted seen flag: a new page load always gets a fresh enhancement.
    for (const counter of counters) {
      if (reduced.matches || !observer) finish(counter);
      else {
        counter.number.textContent = "0.0%";
        if (counter.fill) counter.fill.style.transform = "scaleX(0)";
        observer.observe(counter.card);
      }
    }
    syncState();

    const onReducedChange = () => {
      if (!reduced.matches) return;
      for (const counter of counters) finish(counter);
      stopIdleFrame();
      syncState();
    };
    const onVisibilityChange = () => {
      const now = performance.now();
      for (const counter of counters) {
        if (document.hidden) pause(counter, now);
        else start(counter, now);
      }
      stopIdleFrame();
      syncState();
    };
    reduced.addEventListener("change", onReducedChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", onReducedChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Restore the static fallback; Strict Mode's next setup can start cleanly.
      counters.forEach(counter => {
        clearDelay(counter);
        counter.number.textContent = `${counter.rate.toFixed(1)}%`;
        counter.fill?.style.removeProperty("transform");
      });
    };
  }, []);

  return null;
}
