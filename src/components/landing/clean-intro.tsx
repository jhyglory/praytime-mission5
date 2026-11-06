// Actual exported Figma wordmark, including its original Pause Mark.
"use client";

import { useEffect, useRef } from "react";
import introMotion from "./clean-intro-motion.json";

export function CleanIntro({ variant, viewport }: { variant:"desktop"|"mobile"; viewport:string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!viewport.endsWith(":motion") || typeof element.animate !== "function") {
      element.dataset.introState = viewport ? "reduced" : "static";
      return;
    }
    // Preview1265:8215 /11339 supplies the two entrance tracks.
    // Preserve their absolute onsets/easing; the user's separate-section
    // requirement removes the combined preview's scene crossfade/repeat.
    const animations = introMotion.tracks.map(track => {
      const target = element.querySelector<HTMLElement>('[data-intro-part="' + track.part + '"]')!;
      const animation = target.animate(track.frames, { duration:introMotion.duration, iterations:1, fill:"both" });
      animation.pause(); animation.currentTime = 0;
      return animation;
    });
    let inView = false;
    const sync = () => {
      const time = animations[0].currentTime;
      const currentTime = typeof time === "number" ? time : 0;
      if (currentTime >= introMotion.duration) {
        element.dataset.introState = "complete";
        return;
      }
      const play = inView && !document.hidden;
      const now = document.timeline.currentTime;
      for (const animation of animations) {
        if (play) {
          animation.play();
          if (typeof now === "number") animation.startTime = now - currentTime;
        } else { animation.pause(); animation.currentTime = currentTime; }
      }
      element.dataset.introState = play ? "running" : "paused";
    };
    animations[0].onfinish = () => { element.dataset.introState = "complete"; };
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      sync();
    }, { threshold:.35 });
    sync();
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
    };
  }, [viewport]);

  return <section ref={root} className="card-intro__clean" data-clean-intro data-intro-state="static" data-intro-duration={introMotion.duration} data-node-id={variant === "mobile" ? "1265:8099" : "1265:8075"}>
    <div className="card-intro__intro-copy">
      <p className="card-intro__therefore" data-intro-part="therefore" data-node-id={variant === "mobile" ? "1265:8101" : "1265:8077"}>그래서</p>
      <div className="card-intro__brand" data-intro-part="brand" data-node-id={variant === "mobile" ? "1265:8102" : "1265:8078"}>
        <picture className="card-intro__wordmark">
          <source media="(width < 768px)" srcSet="/assets/card-intro/praytime-wordmark-mobile.png" />
          <img src="/assets/card-intro/praytime-wordmark-desktop.png" width={277} height={45} alt="" data-brand-asset />
        </picture>
        <span className="card-intro__suffix">은</span>
      </div>
    </div>
  </section>;
}
