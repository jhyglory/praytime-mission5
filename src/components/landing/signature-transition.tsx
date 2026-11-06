"use client";

import { useEffect, useRef } from "react";

// Exact opacity tracks from Figma 1088:916 / 1088:1251. Repeated letters and
// slit edges share tracks so every element stays on the same viewport timeline.
const opacity = {
  paper: [1, 1, 0, 0],
  dotFirst: [0, 1, 1, 0, 0],
  dotNext: [0, 0, 1, 1, 0, 0],
  word: [0, 0, 1, 1, 0, 0],
  slit: [0, 0, 1, 1, 0, 0],
  edge: [0, 0, 1, 0.15, 0.15],
  bridge: [0, 0, 1, 1, 0, 0],
} as const;

const timelines = {
  desktop: {
    duration: 2800,
    offsets: {
      paper: [0, 0.1904, 0.3686, 1],
      dotFirst: [0, 0.0368, 0.2211, 0.3011, 1],
      dotSecond: [0, 0.0368, 0.0736, 0.2211, 0.3011, 1],
      dotThird: [0, 0.0736, 0.1107, 0.2211, 0.3011, 1],
      word: [0, 0.1107, 0.1904, 0.2643, 0.3379, 1],
      slit: [0, 0.3439, 0.4239, 0.5282, 0.6236, 1],
      edge: [0, 0.7004, 0.7864, 0.86, 1],
      bridgeFirst: [0, 0.4793, 0.5775, 0.7218, 0.8139, 1],
      bridgeSecond: [0, 0.5036, 0.6082, 0.7218, 0.8139, 1],
    },
  },
  mobile: {
    duration: 2410,
    offsets: {
      paper: [0, 0.2212, 0.4282, 1],
      dotFirst: [0, 0.0427, 0.2568, 0.3498, 1],
      dotSecond: [0, 0.0427, 0.0855, 0.2568, 0.3498, 1],
      dotThird: [0, 0.0855, 0.1286, 0.2568, 0.3498, 1],
      word: [0, 0.1286, 0.2212, 0.3071, 0.3925, 1],
      slit: [0, 0.3996, 0.4925, 0.6137, 0.7245, 1],
      edge: [0, 0.8137, 0.9137, 0.9992, 1],
      bridgeFirst: [0, 0.5568, 0.671, 0.8386, 0.9456, 1],
      bridgeSecond: [0, 0.5851, 0.7066, 0.8386, 0.9456, 1],
    },
  },
} as const;

const trackValues = {
  paper: opacity.paper,
  dotFirst: opacity.dotFirst,
  dotSecond: opacity.dotNext,
  dotThird: opacity.dotNext,
  word: opacity.word,
  slit: opacity.slit,
  edge: opacity.edge,
  bridgeFirst: opacity.bridge,
  bridgeSecond: opacity.bridge,
} as const;

type Track = keyof typeof trackValues;

export function SignatureTransition() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(width < 768px)");
    let animations: Animation[] = [];
    let inView = false;

    const syncPlayback = () => {
      if (!animations.length) return;
      const time = animations[0].currentTime;
      const currentTime = typeof time === "number" ? time : 0;
      if (inView && !document.hidden) {
        const now = document.timeline.currentTime;
        for (const animation of animations) {
          animation.play();
          if (typeof now === "number") animation.startTime = now - currentTime;
        }
        root.dataset.motionState = "running";
      } else {
        for (const animation of animations) {
          animation.pause();
          animation.currentTime = currentTime;
        }
        root.dataset.motionState = "paused";
      }
    };

    const configure = () => {
      animations.forEach(animation => animation.cancel());
      animations = [];
      const variant = mobile.matches ? "mobile" : "desktop";
      const timeline = timelines[variant];
      root.dataset.motionVariant = variant;
      root.dataset.motionDuration = String(timeline.duration);
      if (reduced.matches || typeof root.animate !== "function") {
        root.dataset.motionState = reduced.matches ? "reduced" : "static";
        return;
      }
      for (const track of Object.keys(trackValues) as Track[]) {
        const values = trackValues[track];
        const frames = values.map((value, index) => ({
          opacity: value,
          offset: timeline.offsets[track][index],
          // Motion's easeInOut has the same cubic-bezier as CSS ease-in-out.
          easing: index < values.length - 2 ? "cubic-bezier(0.42, 0, 0.58, 1)" : "linear",
        }));
        for (const element of root.querySelectorAll<HTMLElement>(`[data-motion-track="${track}"]`)) {
          const animation = element.animate(frames, { duration: timeline.duration, iterations: Infinity, fill: "both" });
          animation.pause();
          animation.currentTime = 0;
          animations.push(animation);
        }
      }
      syncPlayback();
    };

    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      syncPlayback();
    }, { threshold: 0.05 });
    configure();
    observer.observe(root);
    reduced.addEventListener("change", configure);
    mobile.addEventListener("change", configure);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      reduced.removeEventListener("change", configure);
      mobile.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return <div ref={container} className="signature-transition" data-signature-transition data-motion-state="static" data-node-id="1088:965" data-mobile-node-id="1088:1297">
    <p className="sr-only">그래서, 행동하기 전에 잠깐의 틈을 만듭니다.</p>
    <div className="signature-transition__scene" aria-hidden="true">
      <div className="signature-transition__paper" data-motion-track="paper" data-node-id="1117:1254" data-mobile-node-id="1088:1298" />
      {[
        { letter: "그", dotTrack: "dotFirst", dotId: "1117:1264", wordId: "1117:1270", mobileDotId: "1088:1300", mobileWordId: "1088:1301" },
        { letter: "래", dotTrack: "dotSecond", dotId: "1117:1277", wordId: "1117:1284", mobileDotId: "1088:1302", mobileWordId: "1088:1303" },
        { letter: "서", dotTrack: "dotThird", dotId: "1117:1291", wordId: "1117:1298", mobileDotId: "1088:1304", mobileWordId: "1088:1305" },
      ].map(({ letter, dotTrack, dotId, wordId, mobileDotId, mobileWordId }, index) => <div key={letter} className={`signature-transition__cue signature-transition__cue--${index + 1}`}>
        <picture className="signature-transition__dot" data-motion-track={dotTrack} data-node-id={dotId} data-mobile-node-id={mobileDotId}>
          <source media="(width < 768px)" srcSet={`/assets/transition-dot-mobile-${index + 1}.svg`} />
          {/* Exact Figma SVGs retain their intrinsic 5.6px desktop / 4px mobile size. */}
          <img src={`/assets/transition-dot-desktop-${index + 1}.svg`} alt="" />
        </picture>
        <p className="signature-transition__letter" data-motion-track="word" data-node-id={wordId} data-mobile-node-id={mobileWordId}>{letter}</p>
      </div>)}
      <div className="signature-transition__slit" data-motion-track="slit" data-node-id="1117:1312" data-mobile-node-id="1088:1307" />
      <div className="signature-transition__edge signature-transition__edge--left" data-motion-track="edge" data-node-id="1117:1360" data-mobile-node-id="1088:1313" />
      <div className="signature-transition__edge signature-transition__edge--right" data-motion-track="edge" data-node-id="1117:1366" data-mobile-node-id="1088:1314" />
      <p className="signature-transition__bridge-first" data-motion-track="bridgeFirst" data-node-id="1117:1372" data-mobile-node-id="1088:1315">행동하기 전에,</p>
      <p className="signature-transition__bridge-second" data-motion-track="bridgeSecond" data-node-id="1117:1379" data-mobile-node-id="1088:1316">잠깐의 틈을 만듭니다.</p>
      <div className="signature-transition__handoff" />
    </div>
  </div>;
}
