/* eslint-disable @next/next/no-img-element -- Original decorative Figma SVGs retain their intrinsic bounds. */
"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { CleanIntro } from "./clean-intro";
import { MobileAmbientCard } from "./mobile-ambient-cards";
import { AmbientCard } from "./ambient-cards";
import motion from "./card-intro-motion.json";
import masonry from "./prototype-columns.json";

// Full Landing1209:514 /1209:1051 has separate clean-intro and card scenes.
// Prototype1214:651 (mobile1214:830) loops ONLY the decorative card streams.
const cardPlaybackSpeed = 0.8;
const desktopParticles = [
  [53.666668,689,14],[1363.03955,497.033325,16],[123.300003,277.674988,18],[1308,141,20],
  [171,414,14],[1246,323,16],[206.458328,538.19165,18],[1205.693726,315.825012,20],
  [275.200012,425,14],[1162,323,16],[69,232,18],[1344,141,20],
  [105.25,636.75,14],[1310.3479,438.766663,16],[178,232,18],[1256,141,20],
  [221,414,18],[1216.854492,673.43634,18],[256.409088,458.990906,18],[1155.820435,214.663635,18],
];
const mobileParticles = [
  [22.666666,617.333313,11],[350.039581,446.549988,13],[61.3,252.7,15],[332,129,11],
  [78,384,13],[293,299,15],[81.458336,473.433319,11],[290.693756,277.049988,13],
  [44.2,393.333344,15],[351,299,11],[57,214,13],[314,129,15],
  [64.25,573,11],[307.347931,397.149994,13],[103,214,15],[293,129,11],
  [38,384,14],[356.854553,596.10907,14],[44.409092,406.327271,14],[324.820465,191.381821,14],
];
function subscribeViewport(callback: () => void) {
  const mobile = matchMedia("(width < 768px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  mobile.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => { mobile.removeEventListener("change", callback); reduced.removeEventListener("change", callback); };
}
function getViewport() {
  return (matchMedia("(width < 768px)").matches ? "mobile" : "desktop") + (matchMedia("(prefers-reduced-motion: reduce)").matches ? ":reduced" : ":motion");
}
const getServerViewport = () => "";

export function SignatureTransition() {
  const container = useRef<HTMLDivElement>(null);
  const cardScene = useRef<HTMLElement>(null);
  // Stable SSR/hydration fallback. Mount only one viewport's decorative tree.
  const viewport = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
  const variant = viewport.startsWith("mobile") ? "mobile" : "desktop";
  const animate = viewport.endsWith(":motion");
  const source = motion[variant];
  const cardDuration = source.duration / cardPlaybackSpeed;
  const particles = variant === "mobile" ? mobileParticles : desktopParticles;

  useEffect(() => {
    const scene = cardScene.current;
    if (!scene) return;
    const baseWidth = variant === "mobile" ? 393 : 1440;
    const fitWidth = () => scene.style.setProperty("--card-scene-scale", String(Math.max(1, scene.getBoundingClientRect().width / baseWidth)));
    fitWidth();
    const observer = new ResizeObserver(fitWidth);
    observer.observe(scene);
    return () => observer.disconnect();
  }, [variant]);

  useEffect(() => {
    const root = container.current;
    const scene = cardScene.current;
    if (!root || !scene) return;
    if (!animate || typeof root.animate !== "function") {
      root.dataset.motionState = viewport ? "reduced" : "static";
      return;
    }
    const animations: Animation[] = source.tracks.map(track => {
      const element = scene.querySelector<HTMLElement>('[data-node-id="' + track.nodeId + '"]');
      if (!element) throw new Error("Missing prototype motion node " + track.nodeId);
      // The final whole-page request restores continuous upward movement
      // on every column. Slow only the cards; particles retain source timing.
      const column = masonry[variant].find(column => column.id === track.nodeId);
      const frames = column ? [
        { offset:0, transform:"translate(0px, 0px)", easing:"linear" },
        { offset:1, transform:"translate(0px, " + -column.cycleHeight + "px)", easing:"linear" },
      ] : track.frames;
      const animation = element.animate(frames, { duration:column ? cardDuration : source.duration, iterations:Infinity, fill:"both" });
      animation.pause(); animation.currentTime = 0;
      return animation;
    });
    let inView = false;
    const syncPlayback = () => {
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
        for (const animation of animations) { animation.pause(); animation.currentTime = currentTime; }
        root.dataset.motionState = "paused";
      }
    };
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      syncPlayback();
    }, { threshold:.05 });
    syncPlayback();
    observer.observe(scene);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [animate, cardDuration, source, variant, viewport]);

  return <div ref={container} className="signature-transition card-intro" data-signature-transition data-motion-state="static" data-motion-duration={cardDuration} data-particle-motion-duration={source.duration} data-motion-variant={variant} data-node-id={source.nodeId}>
    <p className="sr-only">그래서, PRAYTIME은 손이 먼저 움직인 순간, 다시 생각할 시간을 돌려드립니다. 잠깐 기도하고, 필요한 만큼만 선택합니다.</p>
    <div className="card-intro__scene" aria-hidden="true">
      <CleanIntro variant={variant} viewport={viewport} />
      <section ref={cardScene} className="card-intro__cards" data-node-id={variant === "mobile" ? "1214:831" : "1214:652"}>
        {viewport && <div className={"card-intro__art card-intro__art--" + variant}>
          <img className="card-intro__floor" src={variant === "mobile" ? "/assets/card-intro/mobile-floor.svg" : "/assets/card-intro/prototype-floor.svg"} alt="" />
          <div className="card-intro__masonry">
            {masonry[variant].map(column => <div className="card-intro__column" data-column-direction="up" key={column.id} style={{ left:column.x, top:column.y, width:column.width, height:column.height }} data-node-id={column.id}>
              {[0,1].map(repeat => <div className="card-intro__tile" key={repeat} style={{ top:repeat * column.cycleHeight }}>
                {column.cards.map(card => <div className="card-intro__card-slot" key={card.id} style={{ top:card.y, height:card.height }}>
                  {variant === "mobile" ? <MobileAmbientCard kind={card.kind} images={card.images.map(image => image.src)} /> : <AmbientCard kind={card.kind} images={card.images.map(image => image.src)} scale={1} height={card.height} />}
                </div>)}
              </div>)}
            </div>)}
          </div>
          <div className="card-intro__quiet" />
          <div className="card-intro__night-edge" />
          {particles.map(([x,y,size],index) => <div className="card-intro__particle-position" key={index} style={{ left:x, top:y }} data-particle-kind={index < 16 ? "heart" : "share"}>
            <div className="card-intro__particle" data-node-id={"1257:" + ((variant === "mobile" ? 3127 : 1615) + index * 62)}>
              <span style={{ transform:"scale(" + size / (index < 16 ? 14 : 18) + ")" }}><img src={index < 16 ? "/assets/card-intro/71365c2e-0e64-46a7-9834-7512f3867aa5.svg" : "/assets/card-intro/cdbcea2d-4b8c-4e61-97de-c23cf46bc3ee.svg"} alt="" /></span>
            </div>
          </div>)}
          <div className="card-intro__handoff" />
        </div>}
        <div className="card-intro__declaration">
          <div className="card-intro__headline"><p>손이 먼저 움직인 순간,</p><p>다시 생각할 시간을<span className="card-intro__desktop-space"> </span><br className="card-intro__mobile-break" />돌려드립니다.</p></div>
          <p className="card-intro__anchor">잠깐 기도하고,<span className="card-intro__desktop-space"> </span><br className="card-intro__mobile-break" />필요한 만큼만 선택합니다.</p>
        </div>
      </section>
    </div>
  </div>;
}
