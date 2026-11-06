"use client";

import { useEffect, useRef } from "react";

// Opacity values and choreography from Figma 1088:916 / 1088:1251.
// User feedback overrides the dot prelude with a letter-by-letter reveal.
const opacity = {
  paper: [1, 1, 0, 0],
  letterFirst: [0, 1, 1, 0, 0],
  letterNext: [0, 0, 1, 1, 0, 0],
  slit: [0, 0, 1, 1, 0, 0],
  edge: [0, 0, 1, 0.15, 0.15],
  bridge: [0, 0, 1, 1, 0, 0],
} as const;

const timeline = {
  duration: 6000,
  // Milliseconds make the readable holds explicit for both viewports.
  times: {
    paper: [0, 1950, 2700, 6000],
    letterFirst: [0, 300, 2050, 2500, 6000],
    letterSecond: [0, 350, 650, 2050, 2500, 6000],
    letterThird: [0, 700, 1000, 2050, 2500, 6000],
    slit: [0, 2600, 3050, 3500, 4000, 6000],
    edge: [0, 4200, 4750, 5250, 6000],
    bridgeFirst: [0, 2850, 3400, 5100, 5650, 6000],
    bridgeSecond: [0, 3000, 3550, 5100, 5650, 6000],
  },
} as const;

const trackValues = {
  paper: opacity.paper,
  ambient: opacity.paper,
  letterFirst: opacity.letterFirst,
  letterSecond: opacity.letterNext,
  letterThird: opacity.letterNext,
  slit: opacity.slit,
  edge: opacity.edge,
  bridgeFirst: opacity.bridge,
  bridgeSecond: opacity.bridge,
  apertureOuter: opacity.bridge,
  apertureMiddle: opacity.bridge,
  apertureInner: opacity.bridge,
} as const;

type Track = keyof typeof trackValues;

// Newly restored light tracks use the exact Figma snippet values/easing and
// viewport offsets. The shared six-second reading pace remains user-approved.
const lightTiming = {
  desktop: {
    ambient: [0, .2211, .3993, 1],
    apertureOuter: [0, .3993, .5529, .7186, .8293, 1],
    apertureMiddle: [0, .4332, .5775, .7186, .82, 1],
    apertureInner: [0, .47, .5989, .7186, .8079, 1],
  },
  mobile: {
    ambient: [0, .2568, .4639, 1],
    apertureOuter: [0, .4639, .6423, .8349, .9635, 1],
    apertureMiddle: [0, .5033, .671, .8349, .9527, 1],
    apertureInner: [0, .5461, .6959, .8349, .9386, 1],
  },
} as const;
const apertureScale = {
  apertureOuter: [.06, .06, 1, 1, .08, .08],
  apertureMiddle: [.03, .03, 1, 1, .08, .08],
  apertureInner: [.03, .03, 1, 1, .07, .07],
} as const;

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
      root.dataset.motionVariant = variant;
      root.dataset.motionDuration = String(timeline.duration);
      if (reduced.matches || typeof root.animate !== "function") {
        root.dataset.motionState = reduced.matches ? "reduced" : "static";
        return;
      }
      for (const track of Object.keys(trackValues) as Track[]) {
        const values = trackValues[track];
        const offsets = track in lightTiming[variant]
          ? lightTiming[variant][track as keyof typeof lightTiming.desktop]
          : timeline.times[track as keyof typeof timeline.times].map(time => time / timeline.duration);
        const scale = track in apertureScale ? apertureScale[track as keyof typeof apertureScale] : undefined;
        const frames = values.map((value, index) => ({
          opacity: value,
          offset: offsets[index],
          ...(scale ? { transform: `scaleX(${scale[index]})` } : {}),
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
      <div className="signature-transition__ambient" data-motion-track="ambient" data-node-id="1117:1259" data-mobile-node-id="1088:1299">
        <picture><source media="(width < 768px)" srcSet="/assets/landing-transition-mobile-ambient.svg" /><img src="/assets/landing-transition-desktop-ambient.svg" alt="" /></picture>
      </div>
      {[
        { letter: "그", track: "letterFirst", wordId: "1117:1270", mobileWordId: "1088:1301" },
        { letter: "래", track: "letterSecond", wordId: "1117:1284", mobileWordId: "1088:1303" },
        { letter: "서", track: "letterThird", wordId: "1117:1298", mobileWordId: "1088:1305" },
      ].map(({ letter, track, wordId, mobileWordId }, index) => <div key={letter} className={`signature-transition__cue signature-transition__cue--${index + 1}`}>
        <p className="signature-transition__letter" data-motion-track={track} data-node-id={wordId} data-mobile-node-id={mobileWordId}>{letter}</p>
      </div>)}
      <div className="signature-transition__reflection" data-motion-track="slit" data-node-id="1117:1305" data-mobile-node-id="1088:1306" />
      <div className="signature-transition__slit" data-motion-track="slit" data-node-id="1117:1312" data-mobile-node-id="1088:1307" />
      {[
        { layer: "outer", track: "apertureOuter", node: "1117:1319", mobileNode: "1088:1308" },
        { layer: "middle", track: "apertureMiddle", node: "1117:1334", mobileNode: "1088:1311" },
        { layer: "inner", track: "apertureInner", node: "1117:1347", mobileNode: "1088:1312" },
      ].map(({ layer, track, node, mobileNode }) => <div key={layer} className={`signature-transition__aperture signature-transition__aperture--${layer}`} data-motion-track={track} data-node-id={node} data-mobile-node-id={mobileNode}>
        <picture><source media="(width < 768px)" srcSet={`/assets/landing-transition-mobile-aperture-${layer}.svg`} /><img src={`/assets/landing-transition-desktop-aperture-${layer}.svg`} alt="" /></picture>
      </div>)}
      <div className="signature-transition__edge signature-transition__edge--left" data-motion-track="edge" data-node-id="1117:1360" data-mobile-node-id="1088:1313" />
      <div className="signature-transition__edge signature-transition__edge--right" data-motion-track="edge" data-node-id="1117:1366" data-mobile-node-id="1088:1314" />
      <p className="signature-transition__bridge-first" data-motion-track="bridgeFirst" data-node-id="1117:1372" data-mobile-node-id="1088:1315">행동하기 전에,</p>
      <p className="signature-transition__bridge-second" data-motion-track="bridgeSecond" data-node-id="1117:1379" data-mobile-node-id="1088:1316">잠깐의 틈을 만듭니다.</p>
      <div className="signature-transition__handoff" />
    </div>
  </div>;
}
