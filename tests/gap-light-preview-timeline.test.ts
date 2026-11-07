import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GapLightMotion } from "../src/components/motion/gap-light-motion";
import {
  GAP_LIGHT_BASE, GAP_LIGHT_CENTER, GAP_LIGHT_FINAL_WIDTH, GAP_LIGHT_HEIGHT,
  GAP_LIGHT_SLIT_WIDTH, GAP_LIGHT_TOP, GAP_LIGHT_TRAVELER_LENGTH, gapLightFrameAt,
} from "../src/components/motion/gap-light-timeline";
import {
  GAP_LIGHT_PREVIEW_DURATION, GAP_LIGHT_PREVIEW_TIMING, gapLightPreviewFrameAt,
} from "../src/components/motion/gap-light-preview-timeline";

describe("seven-second local gap light study", () => {
  it("opts into the local study without changing the approved default landing face or duration", () => {
    const landing = renderToStaticMarkup(createElement(GapLightMotion, { mode: "still" }));
    const preview = renderToStaticMarkup(createElement(GapLightMotion, { mode: "still", variant: "preview" }));
    expect(landing).toContain('data-motion-variant="landing"');
    expect(landing).toContain('data-start-delay="0"');
    expect(landing).toContain('data-duration="4521.428571428572"');
    expect(landing.match(/<rect\b[^>]*data-gap-part="face-rect"[^>]*>/)?.[0]).toContain('fill="#FEF9E7"');
    expect(landing).not.toContain("faceSoftness");
    expect(preview).toContain('data-motion-variant="preview"');
    expect(preview).toContain('data-duration="7000"');
    expect(preview).toContain('stdDeviation=".8"');
    expect(preview).not.toMatch(/\bstroke(?:-|=)|\bborder(?:-|:)/);
    const face = preview.match(/<rect\b[^>]*data-gap-part="face-rect"[^>]*>/)?.[0];
    expect(face).toMatch(/fill="url\(#[^\)]+-faceColor\)"/);
    expect(face).toMatch(/filter="url\(#[^\)]+-faceSoftness\)"/);
    expect(face).not.toMatch(/\br[xy]=/);
    const ids = [...preview.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    for (const [, reference] of preview.matchAll(/url\(#([^\)]+)\)/g)) expect(ids).toContain(reference);
  });

  it("uses the real seven-second boundaries, including the contact spread and separate ground hold", () => {
    expect(GAP_LIGHT_PREVIEW_DURATION).toBe(7000);
    const phases = [[0, "dark"], [399, "dark"], [400, "fall"], [1299, "fall"],
      [1300, "impact"], [1999, "impact"], [2000, "hold"], [2299, "hold"],
      [2300, "rise"], [4499, "rise"], [4500, "open"], [6499, "open"],
      [6500, "settle"], [6999, "settle"], [7000, "complete"]] as const;
    for (const [time, phase] of phases) expect(gapLightPreviewFrameAt(time).phase).toBe(phase);
    expect(GAP_LIGHT_PREVIEW_TIMING.riseStart - GAP_LIGHT_PREVIEW_TIMING.impactEnd).toBe(300);
    expect(gapLightPreviewFrameAt(0)).toEqual(gapLightPreviewFrameAt(-100));
    expect(gapLightPreviewFrameAt(0)).toEqual(gapLightPreviewFrameAt(NaN));
    expect(gapLightPreviewFrameAt(7000)).toEqual(gapLightPreviewFrameAt(10000));
  });

  it("drops a short centered dash with acceleration and leaves no long trace before lift-off", () => {
    const firstStep = gapLightPreviewFrameAt(500).travelerY - gapLightPreviewFrameAt(450).travelerY;
    const lastStep = gapLightPreviewFrameAt(1250).travelerY - gapLightPreviewFrameAt(1200).travelerY;
    expect(lastStep).toBeGreaterThan(firstStep * 5);
    for (let time = 0; time < GAP_LIGHT_PREVIEW_TIMING.riseStart; time += 25) {
      const frame = gapLightPreviewFrameAt(time);
      expect(frame.travelerLength).toBe(GAP_LIGHT_TRAVELER_LENGTH);
      expect(frame.travelerLength / GAP_LIGHT_HEIGHT).toBeCloseTo(0.072, 10);
      expect(frame.travelerX).toBe(GAP_LIGHT_CENTER);
      expect(frame.travelerCoreOpacity).toBe(1);
      expect(frame.revealHeight).toBe(0);
      expect(frame.slitOpacity).toBe(0);
      expect(frame.faceOpacity).toBe(0);
      if (time <= GAP_LIGHT_PREVIEW_TIMING.darkEnd) {
        expect(frame.travelerOpacity).toBe(0);
        expect(frame.ambientOpacity).toBe(0);
      }
      if (time <= GAP_LIGHT_PREVIEW_TIMING.fallEnd) {
        expect(frame.floorOpacity).toBe(0);
        expect(frame.contactOpacity).toBe(0);
      }
    }
    expect(gapLightPreviewFrameAt(1300).travelerY + GAP_LIGHT_TRAVELER_LENGTH).toBeCloseTo(GAP_LIGHT_BASE, 10);
  });

  it("spreads a filled ground field, lets its contact pulse settle, then keeps the fully spread field for 300ms", () => {
    let previousRadius = 0;
    let previousRY = 0;
    const landedY = gapLightPreviewFrameAt(1300).travelerY;
    for (let time = 1325; time <= 2000; time += 25) {
      const frame = gapLightPreviewFrameAt(time);
      expect(frame.travelerY).toBe(landedY);
      expect(frame.floorRadius).toBeGreaterThan(previousRadius);
      expect(frame.floorRY).toBeGreaterThan(previousRY);
      expect(frame.floorOpacity).toBeGreaterThan(0);
      expect(frame.impactRadius).toBeGreaterThan(0);
      expect(frame.contactOpacity).toBeGreaterThan(0);
      previousRadius = frame.floorRadius;
      previousRY = frame.floorRY;
    }
    expect(gapLightPreviewFrameAt(1370).contactOpacity).toBeGreaterThan(gapLightPreviewFrameAt(1800).contactOpacity);
    const hold = gapLightPreviewFrameAt(2000);
    for (const time of [2050, 2150, 2299]) {
      const frame = gapLightPreviewFrameAt(time);
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
    const held = gapLightPreviewFrameAt(2300 - 0.001);
    const departing = gapLightPreviewFrameAt(2300);
    expect(held.travelerCoreOpacity).toBe(1);
    expect(departing.travelerCoreOpacity).toBe(0);
    expect(departing.slitOpacity).toBe(1);
    expect(departing.joinedY).toBe(held.travelerY);
    expect(departing.joinedHeight).toBeCloseTo(GAP_LIGHT_TRAVELER_LENGTH, 9);
    let previousY = departing.travelerY;
    for (let time = 2325; time <= 4500; time += 25) {
      const frame = gapLightPreviewFrameAt(time);
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
    expect(gapLightPreviewFrameAt(4500).travelerY).toBeCloseTo(GAP_LIGHT_TOP, 9);
    expect(gapLightPreviewFrameAt(4500).travelerOpacity).toBe(0);
  });

  it("opens symmetrically with fixed height and base, continuous ground light, and distinct near/far glow", () => {
    let previousWidth = GAP_LIGHT_SLIT_WIDTH;
    let previousFloor = gapLightPreviewFrameAt(4500).floorRadius;
    let previousNear = 0;
    let previousFar = 0;
    for (let time = 4500; time <= 7000; time += 25) {
      const frame = gapLightPreviewFrameAt(time);
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
    const final = gapLightPreviewFrameAt(7000);
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
