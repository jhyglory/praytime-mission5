import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GapLightMotion } from "../src/components/motion/gap-light-motion";
import {
  GAP_LIGHT_BASE, GAP_LIGHT_CENTER, GAP_LIGHT_DURATION, GAP_LIGHT_FINAL_WIDTH,
  GAP_LIGHT_FALL_SPEED, GAP_LIGHT_HEIGHT, GAP_LIGHT_SLIT_WIDTH, GAP_LIGHT_TIMING, GAP_LIGHT_TOP,
  GAP_LIGHT_TRAVELER_LENGTH, GAP_LIGHT_VIEW_HEIGHT, GAP_LIGHT_VIEW_WIDTH, gapLightFrameAt,
} from "../src/components/motion/gap-light-timeline";

const visibleOpacities = (time: number) => {
  const frame = gapLightFrameAt(time);
  return [frame.travelerOpacity, frame.slitOpacity, frame.faceOpacity, frame.ambientOpacity,
    frame.floorOpacity, frame.contactOpacity, frame.impactOpacity];
};

describe("Ivory gap light choreography", () => {
  it("holds darkness for 200ms, then drops only one short light until its lower tip touches the ground", () => {
    expect(GAP_LIGHT_FALL_SPEED).toBe(0.7);
    expect(750 / (GAP_LIGHT_TIMING.fallEnd - GAP_LIGHT_TIMING.darkEnd)).toBeCloseTo(0.7, 12);
    expect(GAP_LIGHT_DURATION).toBeCloseTo(200 + 750 / 0.7 + 1850 + 1100 + 300, 10);
    for (const time of [0, 90, 199, GAP_LIGHT_TIMING.darkEnd]) {
      expect(visibleOpacities(time)).toEqual([0, 0, 0, 0, 0, 0, 0]);
      expect(gapLightFrameAt(time).revealHeight).toBe(0);
    }
    expect(GAP_LIGHT_TRAVELER_LENGTH).toBeCloseTo(GAP_LIGHT_HEIGHT * 0.04 * 1.2 * 1.5, 10);
    expect(GAP_LIGHT_TRAVELER_LENGTH / GAP_LIGHT_HEIGHT).toBeCloseTo(0.072, 10);
    let previousY = gapLightFrameAt(GAP_LIGHT_TIMING.darkEnd).travelerY;
    for (let time = 225; time < GAP_LIGHT_TIMING.fallEnd; time += 25) {
      const frame = gapLightFrameAt(time);
      expect(frame.phase).toBe("fall");
      expect(frame.travelerLength).toBe(GAP_LIGHT_TRAVELER_LENGTH);
      expect(frame.travelerY).toBeGreaterThan(previousY);
      expect(frame.travelerOpacity).toBeGreaterThan(0);
      expect(frame.revealHeight).toBe(0);
      expect(frame.slitOpacity).toBe(0);
      expect(frame.faceOpacity).toBe(0);
      expect(frame.floorOpacity).toBe(0);
      expect(frame.contactOpacity).toBe(0);
      expect(frame.impactOpacity).toBe(0);
      previousY = frame.travelerY;
    }
    const landing = gapLightFrameAt(GAP_LIGHT_TIMING.fallEnd);
    expect(landing.travelerY + landing.travelerLength).toBeCloseTo(GAP_LIGHT_BASE, 9);
  });

  it("softens the drop with a small curved drift and no abrupt landing speed", () => {
    const { darkEnd, fallEnd } = GAP_LIGHT_TIMING;
    const middle = (darkEnd + fallEnd) / 2;
    const firstStep = gapLightFrameAt(darkEnd + 10).travelerY - gapLightFrameAt(darkEnd).travelerY;
    const middleStep = gapLightFrameAt(middle + 5).travelerY - gapLightFrameAt(middle - 5).travelerY;
    const lastStep = gapLightFrameAt(fallEnd).travelerY - gapLightFrameAt(fallEnd - 10).travelerY;
    expect(firstStep).toBeGreaterThan(0);
    expect(lastStep).toBeGreaterThan(0);
    expect(firstStep).toBeLessThan(middleStep * 0.15);
    expect(lastStep).toBeLessThan(middleStep * 0.15);
    expect(gapLightFrameAt(darkEnd).travelerX).toBeCloseTo(GAP_LIGHT_CENTER, 10);
    expect(gapLightFrameAt(fallEnd).travelerX).toBeCloseTo(GAP_LIGHT_CENTER, 10);
    const drift = [];
    for (let time = darkEnd; time <= fallEnd; time += 25) {
      const distance = Math.abs(gapLightFrameAt(time).travelerX - GAP_LIGHT_CENTER);
      expect(distance).toBeLessThanOrEqual(12 + 1e-8);
      drift.push(distance);
    }
    expect(Math.max(...drift)).toBeGreaterThan(1);
  });

  it("starts the return and filled ground spread together at contact, without a stationary hold", () => {
    expect(GAP_LIGHT_TIMING.riseStart).toBe(GAP_LIGHT_TIMING.fallEnd);
    const landed = gapLightFrameAt(GAP_LIGHT_TIMING.fallEnd);
    for (const time of [GAP_LIGHT_TIMING.fallEnd + 1, GAP_LIGHT_TIMING.fallEnd + 25]) {
      const frame = gapLightFrameAt(time);
      expect(frame.travelerY).toBeLessThan(landed.travelerY);
      expect(frame.travelerX).toBeCloseTo(GAP_LIGHT_CENTER, 10);
      expect(frame.impactRadius).toBeGreaterThan(0);
      expect(frame.impactRY).toBeGreaterThan(0);
      expect(frame.revealHeight).toBeGreaterThan(0);
      expect(frame.slitOpacity).toBeGreaterThan(0);
    }
    let previousRadius = 0;
    let previousY = landed.travelerY;
    let previousHeight = 0;
    for (let time = GAP_LIGHT_TIMING.fallEnd + 25; time <= GAP_LIGHT_TIMING.impactEnd; time += 25) {
      const frame = gapLightFrameAt(time);
      expect(frame.travelerY).toBeLessThan(previousY);
      expect(frame.travelerX).toBeCloseTo(GAP_LIGHT_CENTER, 10);
      expect(frame.impactRadius).toBeGreaterThanOrEqual(previousRadius);
      expect(frame.impactRY).toBeGreaterThan(0);
      expect(frame.floorRadius).toBeGreaterThan(0);
      expect(frame.contactOpacity).toBeGreaterThan(0);
      expect(frame.revealHeight).toBeGreaterThan(previousHeight);
      expect(frame.slitOpacity).toBeGreaterThan(0);
      previousRadius = frame.impactRadius;
      previousY = frame.travelerY;
      previousHeight = frame.revealHeight;
    }
    for (let time = GAP_LIGHT_TIMING.impactEnd + 25; time <= GAP_LIGHT_TIMING.riseEnd; time += 25) {
      const frame = gapLightFrameAt(time);
      expect(frame.travelerLength).toBe(GAP_LIGHT_TRAVELER_LENGTH);
      expect(frame.travelerX).toBeCloseTo(GAP_LIGHT_CENTER, 10);
      expect(frame.travelerY).toBeLessThanOrEqual(previousY);
      expect(frame.revealHeight).toBeGreaterThanOrEqual(previousHeight);
      // The slit top overlaps the moving segment: no detached gap and no
      // premature line above its leading edge.
      expect(frame.revealTop).toBeGreaterThanOrEqual(frame.travelerY - 1e-8);
      expect(frame.revealTop).toBeLessThanOrEqual(frame.travelerY + frame.travelerLength + 1e-8);
      expect(frame.revealTop + frame.revealHeight).toBeCloseTo(GAP_LIGHT_BASE, 9);
      expect(frame.faceWidth).toBe(GAP_LIGHT_SLIT_WIDTH);
      expect(frame.faceOpacity).toBe(0);
      previousY = frame.travelerY;
      previousHeight = frame.revealHeight;
    }
    const returned = gapLightFrameAt(GAP_LIGHT_TIMING.riseEnd);
    expect(returned.travelerY).toBeCloseTo(GAP_LIGHT_TOP, 9);
    expect(returned.travelerOpacity).toBe(0);
    expect(returned.revealTop).toBeCloseTo(GAP_LIGHT_TOP, 9);
    expect(returned.revealHeight).toBeCloseTo(GAP_LIGHT_HEIGHT, 9);
  });

  it("hands the falling dash to one opaque continuous ascent core without an overlapping core or clipped join", () => {
    const beforeContact = gapLightFrameAt(GAP_LIGHT_TIMING.fallEnd - 0.001);
    expect(beforeContact.travelerCoreOpacity).toBe(1);
    expect(beforeContact.slitOpacity).toBe(0);

    const contact = gapLightFrameAt(GAP_LIGHT_TIMING.fallEnd);
    expect(contact.travelerCoreOpacity).toBe(0);
    expect(contact.slitOpacity).toBe(1);
    expect(contact.joinedY).toBeCloseTo(GAP_LIGHT_BASE - GAP_LIGHT_TRAVELER_LENGTH, 9);
    expect(contact.joinedHeight).toBeCloseTo(GAP_LIGHT_TRAVELER_LENGTH, 9);
    expect(contact.joinedY).toBeCloseTo(beforeContact.travelerY, 6);

    for (let time = GAP_LIGHT_TIMING.riseStart; time <= GAP_LIGHT_TIMING.riseEnd; time += 25) {
      const frame = gapLightFrameAt(time);
      expect(frame.travelerCoreOpacity).toBe(0);
      expect(frame.slitOpacity).toBe(1);
      expect(frame.joinedY).toBe(frame.travelerY);
      expect(frame.joinedY + frame.joinedHeight).toBeCloseTo(GAP_LIGHT_BASE, 9);
      expect(frame.joinedHeight).toBeGreaterThanOrEqual(GAP_LIGHT_TRAVELER_LENGTH - 1e-8);
    }

    const html = renderToStaticMarkup(createElement(GapLightMotion, { mode: "still" }));
    const movingCore = html.match(/<rect\b[^>]*data-gap-part="traveler-core"[^>]*>/)![0];
    const joinedCore = html.match(/<rect\b[^>]*data-gap-part="trail-core"[^>]*>/)![0];
    const trailGroup = html.match(/<g\b[^>]*data-gap-part="trail"[^>]*>/)![0];
    for (const core of [movingCore, joinedCore]) {
      expect(core).toContain(`width="${GAP_LIGHT_SLIT_WIDTH}"`);
      expect(core).toContain(`x="${GAP_LIGHT_CENTER - GAP_LIGHT_SLIT_WIDTH / 2}"`);
      expect(core).toContain('fill="#FFFFF6"');
    }
    expect(trailGroup).not.toMatch(/\b(?:clip-path|mask)=/);
    expect(joinedCore).not.toMatch(/\b(?:clip-path|mask|filter)=/);
    expect(html.match(/<rect\b[^>]*data-gap-part="trail-glow"[^>]*>/)![0]).toContain('mask="url(#');
  });

  it("opens the completed slit symmetrically to the new PNG proportion and holds without overshoot", () => {
    expect(GAP_LIGHT_VIEW_WIDTH).toBe(1200);
    expect(GAP_LIGHT_VIEW_HEIGHT / GAP_LIGHT_VIEW_WIDTH).toBeCloseTo(1381 / 1139, 10);
    expect(GAP_LIGHT_FINAL_WIDTH / GAP_LIGHT_VIEW_WIDTH).toBeCloseTo(46 / 1139, 10);
    let previousWidth = GAP_LIGHT_SLIT_WIDTH;
    let previousFloor = gapLightFrameAt(GAP_LIGHT_TIMING.riseEnd).floorRadius;
    let previousAmbient = gapLightFrameAt(GAP_LIGHT_TIMING.riseEnd).ambientRadius;
    for (let time = GAP_LIGHT_TIMING.riseEnd; time <= GAP_LIGHT_DURATION; time += 25) {
      const frame = gapLightFrameAt(time);
      expect(frame.faceX + frame.faceWidth / 2).toBe(GAP_LIGHT_CENTER);
      expect(frame.faceWidth).toBeGreaterThanOrEqual(previousWidth);
      expect(frame.faceWidth).toBeLessThanOrEqual(GAP_LIGHT_FINAL_WIDTH);
      expect(frame.revealTop).toBeCloseTo(GAP_LIGHT_TOP, 9);
      expect(frame.revealTop + frame.revealHeight).toBeCloseTo(GAP_LIGHT_BASE, 9);
      expect(frame.floorRadius).toBeGreaterThanOrEqual(previousFloor);
      expect(frame.ambientRadius).toBeGreaterThanOrEqual(previousAmbient);
      for (const opacity of visibleOpacities(time)) {
        expect(opacity).toBeGreaterThanOrEqual(0);
        expect(opacity).toBeLessThanOrEqual(1);
      }
      previousWidth = frame.faceWidth;
      previousFloor = frame.floorRadius;
      previousAmbient = frame.ambientRadius;
    }
    const final = gapLightFrameAt(GAP_LIGHT_DURATION);
    expect(final.faceWidth).toBe(GAP_LIGHT_FINAL_WIDTH);
    expect(final.faceOpacity).toBe(1);
    expect(final.slitOpacity).toBe(0);
    expect(final.travelerOpacity).toBe(0);
    expect(final.phase).toBe("complete");
    expect(gapLightFrameAt(20_000)).toEqual(final);
  });

  it("renders seven independent layers with an ivory filled rectangle and no outline, capsule or image substitute", () => {
    const html = renderToStaticMarkup(createElement(GapLightMotion, { mode: "still" }));
    expect([...html.matchAll(/data-gap-layer="([^"]+)"/g)].map(match => match[1])).toEqual([
      "background", "ambient", "floor-spread", "floor-contact", "trail", "face", "traveler",
    ]);
    expect(html).toContain(`viewBox="0 0 ${GAP_LIGHT_VIEW_WIDTH} ${GAP_LIGHT_VIEW_HEIGHT}"`);
    expect(html).toContain(`data-duration="${GAP_LIGHT_DURATION}"`);
    expect(html).not.toMatch(/\bstroke(?:-|=)|\bborder(?:-|:)|<(?:image|img)\b/);
    expect(html).not.toContain("edge-path");
    expect(html).not.toContain("edge-caps");
    expect(html).not.toContain("scaleX");
    const face = html.match(/<rect\b[^>]*data-gap-part="face-rect"[^>]*>/)?.[0];
    expect(face).toBeDefined();
    expect(face).toContain('fill="#FEF9E7"');
    expect(face).toContain(`x="${GAP_LIGHT_CENTER - GAP_LIGHT_FINAL_WIDTH / 2}"`);
    expect(face).toContain(`y="${GAP_LIGHT_TOP}"`);
    expect(face).toContain(`width="${GAP_LIGHT_FINAL_WIDTH}"`);
    expect(face).toContain(`height="${GAP_LIGHT_HEIGHT}"`);
    expect(face).not.toMatch(/\br[xy]=/);
    const pool = html.match(/<ellipse\b[^>]*data-gap-part="impact-pool"[^>]*>/)?.[0];
    expect(pool).toBeDefined();
    expect(pool).toContain(`cx="${GAP_LIGHT_CENTER}"`);
    expect(pool).toContain(`cy="${GAP_LIGHT_BASE}"`);
    expect(pool).toMatch(/fill="url\(#/);
  });

  it("scopes all gradients, filters, clips and accessible titles to each instance", () => {
    const html = renderToStaticMarkup(createElement("div", null,
      createElement(GapLightMotion, { mode: "still" }),
      createElement(GapLightMotion, { mode: "still" }),
    ));
    const instances = html.match(/<svg\b[\s\S]*?<\/svg>/g)!;
    expect(instances).toHaveLength(2);
    const allIds: string[] = [];
    for (const instance of instances) {
      const ids = [...instance.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      const references = [...instance.matchAll(/url\(#([^\)]+)\)/g)].map(match => match[1]);
      expect(references.length).toBeGreaterThan(8);
      for (const reference of references) expect(ids).toContain(reference);
      expect(ids).toContain(instance.match(/aria-labelledby="([^"]+)"/)?.[1]);
      allIds.push(...ids);
    }
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
