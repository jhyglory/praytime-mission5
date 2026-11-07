import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GapLightMotion } from "../src/components/motion/gap-light-motion";
import {
  GAP_LIGHT_BASE, GAP_LIGHT_CENTER, GAP_LIGHT_FINAL_WIDTH, GAP_LIGHT_HEIGHT,
  GAP_LIGHT_SLIT_WIDTH, GAP_LIGHT_TOP, GAP_LIGHT_TRAVELER_LENGTH, gapLightFrameAt,
} from "../src/components/motion/gap-light-timeline";
import {
  GAP_LIGHT_PREVIEW_DURATION, GAP_LIGHT_PREVIEW_PLAYBACK_RATE, GAP_LIGHT_PREVIEW_TIMING, gapLightPreviewFrameAt,
} from "../src/components/motion/gap-light-preview-timeline";

// Sample the approved source poses at the correspondingly faster elapsed time.
const sourceFrameAt = (sourceTime: number) => gapLightPreviewFrameAt(sourceTime / GAP_LIGHT_PREVIEW_PLAYBACK_RATE);

describe("gap light choreography at 1.3x playback speed", () => {
  it("uses the faster ivory preset without changing the legacy default face or duration", () => {
    const landing = renderToStaticMarkup(createElement(GapLightMotion, { mode: "still" }));
    const preview = renderToStaticMarkup(createElement(GapLightMotion, { mode: "still", variant: "preview" }));
    expect(landing).toContain('data-motion-variant="landing"');
    expect(landing).toContain('data-start-delay="0"');
    expect(landing).toContain('data-duration="4521.428571428572"');
    expect(landing.match(/<rect\b[^>]*data-gap-part="face-rect"[^>]*>/)?.[0]).toContain('fill="#FEF9E7"');
    expect(landing).not.toContain("faceSoftness");
    expect(preview).toContain('data-motion-variant="preview"');
    expect(preview).toContain(`data-duration="${GAP_LIGHT_PREVIEW_DURATION}"`);
    expect(preview).toContain('stdDeviation="2.2"');
    expect(preview).not.toMatch(/\bstroke(?:-|=)|\bborder(?:-|:)/);
    const face = preview.match(/<rect\b[^>]*data-gap-part="face-rect"[^>]*>/)?.[0];
    expect(face).toMatch(/fill="url\(#[^\)]+-faceColor\)"/);
    expect(face).toMatch(/filter="url\(#[^\)]+-faceSoftness\)"/);
    expect(face).not.toMatch(/\br[xy]=/);
    const ids = [...preview.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    for (const [, reference] of preview.matchAll(/url\(#([^\)]+)\)/g)) expect(ids).toContain(reference);
  });

  it("scales every source boundary by 1.3 while preserving contact spread and a proportionally shorter hold", () => {
    expect(GAP_LIGHT_PREVIEW_PLAYBACK_RATE).toBe(1.3);
    expect(GAP_LIGHT_PREVIEW_DURATION).toBe(7000 / 1.3);
    expect(GAP_LIGHT_PREVIEW_TIMING).toEqual({ darkEnd: 400 / 1.3, fallEnd: 1300 / 1.3, impactEnd: 2000 / 1.3, riseStart: 2300 / 1.3, riseEnd: 4500 / 1.3, openEnd: 6500 / 1.3, end: 7000 / 1.3 });
    const phases = [[0, "dark"], [399, "dark"], [400, "fall"], [1299, "fall"],
      [1300, "impact"], [1999, "impact"], [2000, "hold"], [2299, "hold"],
      [2300, "rise"], [4499, "rise"], [4500, "open"], [6499, "open"],
      [6500, "settle"], [6999, "settle"], [7000, "complete"]] as const;
    for (const [time, phase] of phases) expect(sourceFrameAt(time).phase).toBe(phase);
    expect(GAP_LIGHT_PREVIEW_TIMING.riseStart - GAP_LIGHT_PREVIEW_TIMING.impactEnd).toBeCloseTo(300 / 1.3, 10);
    expect(sourceFrameAt(500).time).toBeCloseTo(500 / 1.3, 10);
    expect(sourceFrameAt(7000).time).toBe(GAP_LIGHT_PREVIEW_DURATION);
    expect(sourceFrameAt(0)).toEqual(sourceFrameAt(-100));
    expect(sourceFrameAt(0)).toEqual(sourceFrameAt(NaN));
    expect(sourceFrameAt(7000)).toEqual(sourceFrameAt(10000));
  });

  it("drops a short centered dash with acceleration and leaves no long trace before lift-off", () => {
    const firstStep = sourceFrameAt(500).travelerY - sourceFrameAt(450).travelerY;
    const lastStep = sourceFrameAt(1250).travelerY - sourceFrameAt(1200).travelerY;
    expect(lastStep).toBeGreaterThan(firstStep * 5);
    const start = sourceFrameAt(400).travelerY;
    const distance = sourceFrameAt(1300).travelerY - start;
    // The first half glides; the fastest motion happens near the ground.
    const halfway = (sourceFrameAt(850).travelerY - start) / distance;
    expect(halfway).toBeGreaterThan(.1);
    expect(halfway).toBeLessThan(.15);
    const steps = Array.from({ length: 100 }, (_, index) =>
      sourceFrameAt(400 + (index + 1) * 9).travelerY - sourceFrameAt(400 + index * 9).travelerY);
    expect(steps.every(step => step >= -1e-8)).toBe(true);
    const peak = (steps.indexOf(Math.max(...steps)) + .5) / steps.length;
    expect(peak).toBeGreaterThan(.7);
    expect(peak).toBeLessThan(.85);
    const contact = GAP_LIGHT_PREVIEW_TIMING.fallEnd;
    const atContact = gapLightPreviewFrameAt(contact).travelerY;
    const justBefore = gapLightPreviewFrameAt(contact - 1).travelerY;
    const beforeThat = gapLightPreviewFrameAt(contact - 2).travelerY;
    // A moving dash must settle into the stationary contact without a speed
    // or acceleration jump, rather than arrive at full speed and freeze.
    expect(atContact - justBefore).toBeLessThan(0.001);
    expect(Math.abs(atContact - 2 * justBefore + beforeThat)).toBeLessThan(0.002);
    expect(gapLightPreviewFrameAt(contact + 1).travelerY).toBe(atContact);
    for (let time = 0; time < 2300; time += 25) {
      const frame = sourceFrameAt(time);
      expect(frame.travelerLength).toBe(GAP_LIGHT_TRAVELER_LENGTH);
      expect(frame.travelerLength / GAP_LIGHT_HEIGHT).toBeCloseTo(0.072, 10);
      expect(frame.travelerX).toBe(GAP_LIGHT_CENTER);
      expect(frame.travelerCoreOpacity).toBe(1);
      expect(frame.revealHeight).toBe(0);
      expect(frame.slitOpacity).toBe(0);
      expect(frame.faceOpacity).toBe(0);
      if (time <= 400) {
        expect(frame.travelerOpacity).toBe(0);
        expect(frame.ambientOpacity).toBe(0);
      }
      if (time <= 1300) {
        expect(frame.floorOpacity).toBe(0);
        expect(frame.contactOpacity).toBe(0);
      }
    }
    expect(sourceFrameAt(1300).travelerY + GAP_LIGHT_TRAVELER_LENGTH).toBeCloseTo(GAP_LIGHT_BASE, 10);
  });

  it("spreads a filled ground field, lets its contact pulse settle, then keeps the fully spread field for 300/1.3ms", () => {
    let previousRadius = 0;
    let previousRY = 0;
    const landedY = sourceFrameAt(1300).travelerY;
    for (let time = 1325; time <= 2000; time += 25) {
      const frame = sourceFrameAt(time);
      expect(frame.travelerY).toBe(landedY);
      expect(frame.floorRadius).toBeGreaterThan(previousRadius);
      expect(frame.floorRY).toBeGreaterThan(previousRY);
      expect(frame.floorOpacity).toBeGreaterThan(0);
      expect(frame.impactRadius).toBeGreaterThan(0);
      expect(frame.contactOpacity).toBeGreaterThan(0);
      previousRadius = frame.floorRadius;
      previousRY = frame.floorRY;
    }
    expect(sourceFrameAt(1370).contactOpacity).toBeGreaterThan(sourceFrameAt(1800).contactOpacity);
    const hold = sourceFrameAt(2000);
    for (const time of [2050, 2150, 2299]) {
      const frame = sourceFrameAt(time);
      expect(frame.phase).toBe("hold");
      expect(frame.travelerY).toBe(landedY);
      expect(frame.floorRadius).toBe(hold.floorRadius);
      expect(frame.floorRY).toBe(hold.floorRY);
      expect(frame.floorOpacity).toBe(hold.floorOpacity);
      expect(frame.impactOpacity).toBe(hold.impactOpacity);
      expect(frame.revealHeight).toBe(0);
    }
  });

  it("hands the held short dash to one continuous ascent core with its ground connection intact", () => {
    const held = sourceFrameAt(2300 - 0.001);
    const departing = sourceFrameAt(2300);
    expect(held.travelerCoreOpacity).toBe(1);
    expect(departing.travelerCoreOpacity).toBe(0);
    expect(departing.slitOpacity).toBe(1);
    expect(departing.joinedY).toBe(held.travelerY);
    expect(departing.joinedHeight).toBeCloseTo(GAP_LIGHT_TRAVELER_LENGTH, 9);
    let previousY = departing.travelerY;
    for (let time = 2325; time <= 4500; time += 25) {
      const frame = sourceFrameAt(time);
      expect(frame.travelerY).toBeLessThan(previousY);
      expect(frame.travelerLength).toBe(GAP_LIGHT_TRAVELER_LENGTH);
      expect(frame.joinedY).toBe(frame.travelerY);
      expect(frame.joinedY + frame.joinedHeight).toBeCloseTo(GAP_LIGHT_BASE, 9);
      expect(frame.revealTop).toBeGreaterThanOrEqual(frame.travelerY - 1e-8);
      expect(frame.revealTop).toBeLessThanOrEqual(frame.travelerY + frame.travelerLength + 1e-8);
      expect(frame.floorOpacity).toBeGreaterThan(0);
      expect(frame.faceWidth).toBe(GAP_LIGHT_SLIT_WIDTH);
      previousY = frame.travelerY;
    }
    expect(sourceFrameAt(4500).travelerY).toBeCloseTo(GAP_LIGHT_TOP, 9);
    expect(sourceFrameAt(4500).travelerOpacity).toBe(0);
  });

  it("opens symmetrically with fixed height and base, continuous ground light, and distinct near/far glow", () => {
    let previousWidth = GAP_LIGHT_SLIT_WIDTH;
    let previousFloor = sourceFrameAt(4500).floorRadius;
    let previousNear = 0;
    let previousFar = 0;
    for (let time = 4500; time <= 7000; time += 25) {
      const frame = sourceFrameAt(time);
      expect(frame.faceX + frame.faceWidth / 2).toBe(GAP_LIGHT_CENTER);
      expect(frame.faceWidth).toBeGreaterThanOrEqual(previousWidth);
      expect(frame.faceWidth).toBeLessThanOrEqual(GAP_LIGHT_FINAL_WIDTH);
      expect(frame.revealTop).toBeCloseTo(GAP_LIGHT_TOP, 9);
      expect(frame.revealTop + frame.revealHeight).toBeCloseTo(GAP_LIGHT_BASE, 9);
      expect(frame.floorRadius).toBeGreaterThanOrEqual(previousFloor);
      expect(frame.floorOpacity).toBeGreaterThan(0);
      expect(frame.nearGlowOpacity).toBeGreaterThanOrEqual(previousNear);
      expect(frame.farGlowOpacity).toBeGreaterThanOrEqual(previousFar);
      expect(frame.nearGlowOpacity).toBeGreaterThan(frame.farGlowOpacity);
      for (const value of [frame.travelerOpacity, frame.slitOpacity, frame.faceOpacity, frame.ambientOpacity,
        frame.floorOpacity, frame.contactOpacity, frame.impactOpacity, frame.nearGlowOpacity,
        frame.midGlowOpacity, frame.farGlowOpacity]) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
      previousWidth = frame.faceWidth;
      previousFloor = frame.floorRadius;
      previousNear = frame.nearGlowOpacity;
      previousFar = frame.farGlowOpacity;
    }
    const final = sourceFrameAt(7000);
    const previousFinal = gapLightFrameAt(Infinity);
    expect(final.faceWidth).toBe(GAP_LIGHT_FINAL_WIDTH);
    expect(final.faceOpacity).toBe(1);
    expect(final.floorRadius / previousFinal.floorRadius).toBeCloseTo(1.4, 10);
    expect(final.floorRY / previousFinal.floorRY).toBeCloseTo(1.4, 10);
    expect(final.floorInnerRadius / previousFinal.floorInnerRadius).toBeCloseTo(1.4, 10);
    expect(final.floorInnerRY / previousFinal.floorInnerRY).toBeCloseTo(1.4, 10);
    expect(final.travelerOpacity).toBe(0);
    expect(final.slitOpacity).toBe(0);
    expect(final.nearGlowOpacity).toBeGreaterThan(final.midGlowOpacity * 4);
    expect(final.farGlowOpacity).toBeLessThan(0.04);
  });
});
