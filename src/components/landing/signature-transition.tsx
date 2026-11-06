/* eslint-disable @next/next/no-img-element -- Original decorative Figma assets retain intrinsic SVG bounds; below-fold cards are not LCP imagery. */
"use client";

import { useEffect, useRef } from "react";
import { AmbientCard } from "./ambient-cards";
import motion from "./card-intro-motion.json";

const columns = [
  { id: "1265:8237", y: -144.193405, order: [0, 1, 2, 3, 4, 5] },
  { id: "1265:8252", y: -684.91864, order: [2, 3, 4, 5, 0, 1] },
  { id: "1265:8267", y: -348.467377, order: [4, 5, 0, 1, 2, 3] },
  { id: "1265:8282", y: -937.257141, order: [0, 1, 2, 3, 4, 5] },
  { id: "1265:8297", y: -24.032234, order: [2, 3, 4, 5, 0, 1] },
  { id: "1265:8312", y: -528.709167, order: [4, 5, 0, 1, 2, 3] },
];
// Exact instance positions in the supplied 1440×760 full-motion scene.
const particles = [
  [53.666668, 689, 14], [1363.03955, 497.033325, 16], [123.300003, 277.674988, 18], [1308, 141, 20],
  [171, 414, 14], [1246, 323, 16], [206.458328, 538.19165, 18], [1205.693726, 315.825012, 20],
  [275.200012, 425, 14], [1162, 323, 16], [69, 232, 18], [1344, 141, 20],
  [105.25, 636.75, 14], [1310.3479, 438.766663, 16], [178, 232, 18], [1256, 141, 20],
  [221, 414, 18], [1216.854492, 673.43634, 18], [256.409088, 458.990906, 18], [1155.820435, 214.663635, 18],
];

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
        for (const animation of animations) { animation.pause(); animation.currentTime = currentTime; }
        root.dataset.motionState = "paused";
      }
    };
    const configure = () => {
      animations.forEach(animation => animation.cancel());
      animations = [];
      root.dataset.motionVariant = mobile.matches ? "mobile" : "desktop";
      if (reduced.matches || typeof root.animate !== "function") {
        root.dataset.motionState = reduced.matches ? "reduced" : "static";
        return;
      }
      // Tracks are translated from get_motion_context's snippets, not inferred
      // from sibling order. Static centering/scaling stays on separate wrappers.
      for (const track of motion.tracks) {
        const element = root.querySelector<HTMLElement>(`[data-node-id="${track.nodeId}"]`);
        if (!element) continue;
        const animation = element.animate(track.frames, { duration: motion.duration, iterations: Infinity, fill: "both" });
        animation.pause();
        animation.currentTime = 0;
        animations.push(animation);
      }
      syncPlayback();
    };
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      syncPlayback();
    }, { threshold: .05 });
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

  return <div ref={container} className="signature-transition card-intro" data-signature-transition data-motion-state="static" data-motion-duration="16000" data-node-id="1265:8215">
    <p className="sr-only">그래서, PRAYTIME은 손이 먼저 움직인 순간, 다시 생각할 시간을 돌려드립니다. 잠깐 기도하고, 필요한 만큼만 선택합니다.</p>
    <div className="card-intro__scene" aria-hidden="true">
      <div className="card-intro__clean" data-node-id="1265:8216">
        <div className="card-intro__intro-copy">
          <p className="card-intro__therefore" data-node-id="1265:8218">그래서</p>
          <div className="card-intro__brand" data-node-id="1265:8219">
            <div className="card-intro__wordmark"><span className="card-intro__pause"><i /><i /></span><span>PRAYTIME</span></div><span className="card-intro__suffix">은</span>
          </div>
        </div>
      </div>
      <div className="card-intro__cards" data-node-id="1265:8234">
        <div className="card-intro__art">
          <img className="card-intro__floor" src="/assets/card-intro/7225071c-290a-4eb2-a440-5de004ad0adc.svg" alt="" />
          <div className="card-intro__masonry" data-node-id="1265:8236">
            {columns.map((column, index) => <div className="card-intro__column" key={column.id} style={{ left: 10 + index * 240, top: column.y }} data-node-id={column.id}>
              {[0, 1].map(repeat => <div className="card-intro__tile" key={repeat}>{column.order.map(kind => <AmbientCard key={kind} kind={kind} />)}</div>)}
            </div>)}
          </div>
          <div className="card-intro__quiet" data-node-id="1265:8327" />
          <div className="card-intro__night-edge" data-node-id="1265:8328" />
          {particles.map(([x, y, size], index) => <div className="card-intro__particle-position" key={index} style={{ left: x, top: y }} data-particle-kind={index < 16 ? "heart" : "share"}>
            <div className="card-intro__particle" data-node-id={`1265:${8330 + index}`}>
              <span style={{ transform: `scale(${index < 16 ? size / 14 : 1})` }}><img src={index < 16 ? "/assets/card-intro/71365c2e-0e64-46a7-9834-7512f3867aa5.svg" : "/assets/card-intro/cdbcea2d-4b8c-4e61-97de-c23cf46bc3ee.svg"} alt="" /></span>
            </div>
          </div>)}
          <div className="card-intro__handoff" data-node-id="1265:8353" />
        </div>
        <div className="card-intro__declaration" data-node-id="1265:8350">
          <div className="card-intro__headline" data-node-id="1265:8351"><p>손이 먼저 움직인 순간,</p><p>다시 생각할 시간을 돌려드립니다.</p></div>
          <p className="card-intro__anchor" data-node-id="1265:8352">잠깐 기도하고, 필요한 만큼만 선택합니다.</p>
        </div>
      </div>
    </div>
  </div>;
}
