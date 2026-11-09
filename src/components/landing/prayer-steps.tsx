"use client";

import { useEffect, useRef } from "react";
import { GapLightDivider } from "@/components/landing/gap-light-divider";
import { MOTION_EASING } from "@/lib/motion";

const duration = 3900;
const stepDuration = 1300;
const steps = [
  ["PAUSE", "설정한 SNS를 열 때 멈춥니다.", "pause"],
  ["PRAY", "직접 기도하거나 가이드를 읽습니다.", "pray"],
  ["CHOOSE", "돌아가거나 사용할 시간을 고릅니다.", "choose"],
] as const;

/** One shared clock adds each light and its copy, retaining every drawn step. */
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
        { offset: 0, opacity: 0 }, { offset: at(0), opacity: 0, easing: MOTION_EASING },
        { offset: at(200), opacity: 1 }, { offset: 1, opacity: 1 },
      ]);
      animate(light.querySelector(".prayer-light-divider__line")!, [
        { offset: 0, transform: "scaleX(0)" }, { offset: at(0), transform: "scaleX(0)", easing: MOTION_EASING },
        { offset: at(1000), transform: "scaleX(1)" }, { offset: 1, transform: "scaleX(1)" },
      ]);
      animate(light.querySelector(".prayer-light-divider__sweep")!, [
        { offset: 0, transform: "translateX(calc(0% - var(--light-center)))" },
        { offset: at(0), transform: "translateX(calc(0% - var(--light-center)))", easing: MOTION_EASING },
        { offset: at(1000), transform: "translateX(calc(100% - var(--light-center)))" },
        { offset: 1, transform: "translateX(calc(100% - var(--light-center)))" },
      ]);
      for (const text of item.querySelectorAll(":scope > p, :scope > h3")) {
        animate(text, [
          { offset: 0, opacity: 0 }, { offset: at(250), opacity: 0, easing: MOTION_EASING },
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

  return <ol ref={root} className="prayer-steps grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12" data-prayer-motion="pending" data-prayer-duration={duration}>
    {steps.map(([title, meaning, light], index) => <li key={title} data-prayer-step={index + 1}>
      <GapLightDivider variant={light} sweep />
      <p className="eyebrow text-muted-foreground font-sans text-xs leading-5 font-normal tracking-[1.2px]">0{index + 1}</p><h3>{title}</h3><p>{meaning}</p>
    </li>)}
  </ol>;
}
