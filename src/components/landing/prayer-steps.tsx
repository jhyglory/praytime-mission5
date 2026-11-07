"use client";

import { useEffect, useRef } from "react";
import { GapLightDivider } from "@/components/landing/gap-light-divider";

const duration = 3900;
const stepDuration = 1300;
const steps = [
  ["PAUSE", "잠깐 멈추고", "pause"],
  ["PRAY", "하나님께 시선을 돌리고", "pray"],
  ["CHOOSE", "지금 필요한지 다시 선택합니다.", "choose"],
] as const;

/** One shared clock draws each light in turn; revealed copy stays in place. */
export function PrayerSteps() {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const items = [...element.querySelectorAll<HTMLElement>("[data-prayer-step]")];
    const animations: Animation[] = [];
    let entered = false, inView = false, finished = false;
    const staticResult = () => {
      finished = true;
      animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
      element.dataset.prayerMotion = "reduced";
    };
    if (reduced.matches || typeof element.animate !== "function" || typeof IntersectionObserver === "undefined") {
      staticResult();
      return;
    }

    const animate = (target: Element, frames: Keyframe[]) => {
      const animation = target.animate(frames, { duration, fill: "both", easing: "linear" });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    };
    items.forEach((item, index) => {
      const begin = index * stepDuration;
      const at = (time: number) => (begin + time) / duration;
      const light = item.querySelector<HTMLElement>(".prayer-light-divider")!;
      animate(light, [
        { offset: 0, opacity: 0 }, { offset: at(0), opacity: 0 },
        { offset: at(80), opacity: 1 }, { offset: at(1000), opacity: 1 },
        { offset: at(1200), opacity: 0 }, { offset: 1, opacity: 0 },
      ]);
      animate(light.querySelector(".prayer-light-divider__line")!, [
        { offset: 0, transform: "scaleX(0)" }, { offset: at(0), transform: "scaleX(0)", easing: "cubic-bezier(.22,.61,.36,1)" },
        { offset: at(1000), transform: "scaleX(1)" }, { offset: 1, transform: "scaleX(1)" },
      ]);
      animate(light.querySelector(".prayer-light-divider__sweep")!, [
        { offset: 0, transform: "translateX(calc(0% - var(--light-center)))" },
        { offset: at(0), transform: "translateX(calc(0% - var(--light-center)))", easing: "cubic-bezier(.22,.61,.36,1)" },
        { offset: at(1000), transform: "translateX(calc(100% - var(--light-center)))" },
        { offset: 1, transform: "translateX(calc(100% - var(--light-center)))" },
      ]);
      for (const text of item.querySelectorAll(":scope > p, :scope > h3")) {
        animate(text, [
          { offset: 0, opacity: 0 }, { offset: at(250), opacity: 0, easing: "ease-out" },
          { offset: at(700), opacity: 1 }, { offset: 1, opacity: 1 },
        ]);
      }
    });
    const sync = () => {
      if (finished) return;
      const time = Number(animations[0].currentTime) || 0;
      if (time >= duration) {
        finished = true;
        element.dataset.prayerMotion = "complete";
        return;
      }
      const play = entered && inView && !document.hidden;
      const now = document.timeline.currentTime;
      for (const animation of animations) {
        if (play) {
          animation.play();
          if (typeof now === "number") animation.startTime = now - time;
        } else { animation.pause(); animation.currentTime = time; }
      }
      element.dataset.prayerMotion = !entered ? "pending" : play ? "running" : "paused";
    };
    animations[0].onfinish = () => {
      finished = true;
      element.dataset.prayerMotion = "complete";
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === element) inView = entry.isIntersecting && entry.intersectionRatio > 0;
        else if (entry.isIntersecting && entry.intersectionRatio >= .35) entered = true;
      }
      // A restored scroll or an entry from below must not strand hidden copy.
      if (inView && items[0].getBoundingClientRect().bottom <= 0) entered = true;
      sync();
    }, { threshold: [0, .05, .35] });
    const onReduced = () => { if (reduced.matches) staticResult(); };
    observer.observe(element);
    observer.observe(items[0]);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", onReduced);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", onReduced);
      animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
    };
  }, []);

  return <ol ref={root} className="prayer-steps" data-prayer-motion="pending" data-prayer-duration={duration}>
    {steps.map(([title, meaning, light], index) => <li key={title} data-prayer-step={index + 1}>
      <GapLightDivider variant={light} sweep />
      <p className="eyebrow">0{index + 1}</p><h3>{title}</h3><p>{meaning}</p>
    </li>)}
  </ol>;
}
