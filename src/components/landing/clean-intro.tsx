// Original Figma light SVGs and wordmark preserve their intrinsic bounds.
"use client";

import { useEffect, useRef } from "react";
import { MOTION_EASING } from "@/lib/motion";
import introMotion from "./clean-intro-motion.json";

export function CleanIntro({ variant, viewport }: { variant:"desktop"|"mobile"; viewport:string }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef({ elapsed: 0, complete: false });

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!viewport.endsWith(":motion") || typeof element.animate !== "function") {
      // An explicit reduced-motion preference should never replay the intro
      // when motion is enabled again; the unresolved SSR viewport is different.
      if (viewport) progress.current = { elapsed: introMotion.duration, complete: true };
      element.dataset.introState = viewport ? "reduced" : "static";
      return;
    }
    // Keep light/fade timings; the shared full-word pause is now600ms.
    // The next SNS scene stays independent; play once on entry and hold the logo.
    const animations = introMotion.tracks.map(track => {
      const target = element.querySelector<HTMLElement>('[data-intro-part="' + track.part + '"]')!;
      const frames = track.frames.map(frame => frame.easing === "linear" ? frame : { ...frame, easing: MOTION_EASING });
      const animation = target.animate(frames, { duration:introMotion.duration, iterations:1, fill:"both" });
      animation.pause(); animation.currentTime = progress.current.complete ? introMotion.duration : progress.current.elapsed;
      return animation;
    });
    let inView = false;
    const sync = () => {
      const time = animations[0].currentTime;
      const currentTime = typeof time === "number" ? time : 0;
      progress.current.elapsed = Math.min(introMotion.duration, currentTime);
      if (currentTime >= introMotion.duration) {
        progress.current.complete = true;
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
    animations[0].onfinish = () => {
      progress.current = { elapsed: introMotion.duration, complete: true };
      element.dataset.introState = "complete";
    };
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .35);
      sync();
    }, { threshold:.35 });
    sync();
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      const time = animations[0].currentTime;
      if (typeof time === "number") {
        progress.current.elapsed = Math.min(introMotion.duration, Math.max(0, time));
        progress.current.complete ||= time >= introMotion.duration;
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
    };
  }, [viewport]);

  return <section ref={root} className="card-intro__clean" data-clean-intro data-intro-state="static" data-intro-duration={introMotion.duration} data-node-id={variant === "mobile" ? "1265:8099" : "1265:8075"}>
    <div className="clean-intro__canvas">
      <div className="clean-intro__paper" data-intro-part="paper" data-node-id={variant === "mobile" ? "1339:37875" : "1339:37740"} />
      <div className="clean-intro__ambient" data-intro-part="ambient"><picture><source media="(width < 768px)" srcSet="/assets/restored-intro/mobile-ambient.svg" width="773" height="435" /><img src="/assets/restored-intro/desktop-ambient.svg" width="2370.97" height="590.357" alt="" /></picture></div>
      <p className="card-intro__therefore" data-intro-part="therefore" data-node-id={variant === "mobile" ? "1339:37891" : "1339:37756"}>그래서</p>
      <div className="clean-intro__slit-reflection" data-intro-part="slit-reflection" />
      <div className="clean-intro__slit" data-intro-part="slit" />
      {(["outer", "middle", "inner"] as const).map(kind => <div className={"clean-intro__aperture-position clean-intro__aperture-position--" + kind} key={kind}><picture className="clean-intro__aperture" data-intro-part={kind}><source media="(width < 768px)" srcSet={"/assets/restored-intro/mobile-" + kind + ".svg"} /><img src={"/assets/restored-intro/desktop-" + kind + ".svg"} alt="" /></picture></div>)}
      <div className="clean-intro__edge clean-intro__edge--left" data-intro-part="edge-left" />
      <div className="clean-intro__edge clean-intro__edge--right" data-intro-part="edge-right" />
      <div className="clean-intro__handoff" />
      <div className="card-intro__brand" data-intro-part="brand" data-node-id={variant === "mobile" ? "1339:37866" : "1339:37731"}>
        <picture className="card-intro__wordmark">
          <source media="(width < 768px)" srcSet="/assets/restored-intro/praytime-wordmark-mobile.svg" width="177" height="29" />
          <img src="/assets/restored-intro/praytime-wordmark-desktop.svg" width={277} height={45} alt="" data-brand-asset />
        </picture>
        <span className="card-intro__suffix">은</span>
      </div>
    </div>
  </section>;
}
