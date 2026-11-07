import { expect, test, type Locator, type Page } from "@playwright/test";
import { GAP_LIGHT_FINAL_WIDTH } from "../../src/components/motion/gap-light-timeline";
import { GAP_LIGHT_PREVIEW_DURATION } from "../../src/components/motion/gap-light-preview-timeline";

const observations = new WeakMap<Page, { errors: string[]; posts: string[] }>();

test.beforeEach(async ({ page, baseURL }) => {
  const observation = { errors: [] as string[], posts: [] as string[] };
  observations.set(page, observation);
  const origin = new URL(baseURL!).origin;
  page.on("pageerror", error => observation.errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") observation.errors.push(message.text());
  });
  page.on("request", request => {
    if (request.method() === "POST") observation.posts.push(request.url());
  });
  await page.route("**/*", route => {
    const request = route.request();
    if (request.method() === "POST" || new URL(request.url()).origin !== origin) return route.abort();
    return route.continue();
  });
});

test.afterEach(async ({ page }) => {
  expect(observations.get(page)?.errors ?? []).toEqual([]);
  expect(observations.get(page)?.posts ?? []).toEqual([]);
});

// Put exactly this fraction of the SVG inside the bottom of the viewport.
// Instant scrolling avoids triggering playback while a smooth scroll passes it.
async function expose(motion: Locator, fraction: number) {
  await motion.evaluate((element, fraction) => {
    const box = element.getBoundingClientRect();
    window.scrollTo({ top: scrollY + box.top - innerHeight + box.height * fraction, behavior: "instant" });
  }, fraction);
}

const elapsed = (motion: Locator) => motion.evaluate(element => Number((element as SVGSVGElement).dataset.elapsed));

async function expectIvorySurface(motion: Locator) {
  const face = motion.locator('[data-gap-part="face-rect"]');
  await expect(face).toHaveAttribute("fill", /^url\(#[^)]+-faceColor\)$/);
  await expect(face).toHaveAttribute("filter", /^url\(#[^)]+-faceSoftness\)$/);
  await expect(motion.locator('filter[id$="-faceSoftness"] feGaussianBlur')).toHaveAttribute("stdDeviation", "2.2");
  expect(await face.evaluate(element => ["stroke", "rx", "ry"].some(attribute => element.hasAttribute(attribute)))).toBe(false);
}

for (const width of [1440, 393, 360]) {
  test(`landing gap light starts on visible entry once and holds its final face at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const motion = page.locator("#the-gap svg[data-gap-light-motion]");
    await expect(motion).toHaveAttribute("data-motion-variant", "preview");
    await expect(motion).toHaveAttribute("data-duration", String(GAP_LIGHT_PREVIEW_DURATION));
    await expect(motion).toHaveAttribute("data-start-delay", "1200");
    await expect(motion).toHaveAttribute("data-motion-state", "paused");
    await page.waitForTimeout(250);
    expect(await elapsed(motion)).toBe(0);
    await expect(page.locator(".gap-architecture")).toHaveAttribute("aria-hidden", "true");

    await expose(motion, .1);
    await page.waitForTimeout(200);
    expect(await elapsed(motion)).toBe(0);
    await motion.evaluate(element => {
      const target = element as SVGSVGElement & { entryTiming?: { waiting: number; playing: number; complete: number } };
      const result = { waiting: 0, playing: 0, complete: 0 };
      target.entryTiming = result;
      const observer = new MutationObserver(() => {
        const state = target.dataset.motionState;
        if (state === "waiting" && !result.waiting) result.waiting = performance.now();
        if (state === "playing" && !result.playing) result.playing = performance.now();
        if (state === "complete" && !result.complete) { result.complete = performance.now(); observer.disconnect(); }
      });
      observer.observe(target, { attributes: true, attributeFilter: ["data-motion-state"] });
    });
    await expose(motion, .25);
    await expect(motion).toHaveAttribute("data-motion-state", "waiting");
    await page.waitForTimeout(300);
    expect(await elapsed(motion)).toBe(0);
    await expect(motion).toHaveAttribute("data-motion-state", "playing");
    const waitDuration = await motion.evaluate(element => {
      const timing = (element as SVGSVGElement & { entryTiming: { waiting: number; playing: number; complete: number } }).entryTiming;
      return timing.playing - timing.waiting;
    });
    expect(waitDuration).toBeGreaterThanOrEqual(1180);
    expect(waitDuration).toBeLessThanOrEqual(1500);
    await expect.poll(() => elapsed(motion)).toBeGreaterThan(0);
    await motion.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(motion).toHaveAttribute("data-motion-state", "complete", { timeout: 12000 });
    const activeDuration = await motion.evaluate(element => {
      const timing = (element as SVGSVGElement & { entryTiming: { playing: number; complete: number } }).entryTiming;
      return timing.complete - timing.playing;
    });
    expect(activeDuration).toBeGreaterThanOrEqual(GAP_LIGHT_PREVIEW_DURATION - 50);
    expect(activeDuration).toBeLessThanOrEqual(GAP_LIGHT_PREVIEW_DURATION + 500);
    expect(await elapsed(motion)).toBeCloseTo(GAP_LIGHT_PREVIEW_DURATION, 4);
    await expect(motion.locator('[data-gap-part="face"]')).toHaveAttribute("opacity", "1");
    await expect(motion.locator('[data-gap-part="traveler"]')).toHaveAttribute("opacity", "0");
    const faceWidth = await motion.locator('[data-gap-part="face-rect"]').getAttribute("width");
    expect(Number(faceWidth)).toBeCloseTo(GAP_LIGHT_FINAL_WIDTH, 4);
    await expectIvorySurface(motion);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(100);
    await motion.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(250);
    await expect(motion).toHaveAttribute("data-motion-state", "complete");
    expect(await elapsed(motion)).toBeCloseTo(GAP_LIGHT_PREVIEW_DURATION, 4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("landing gap light cancels its entry wait and pauses without another delay after playback starts", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const motion = page.locator("#the-gap svg[data-gap-light-motion]");
  await motion.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(motion).toHaveAttribute("data-motion-state", "waiting");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(motion).toHaveAttribute("data-motion-state", "paused");
  await page.waitForTimeout(1400);
  expect(await elapsed(motion)).toBe(0);

  await motion.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(motion).toHaveAttribute("data-motion-state", "waiting");
  await expect.poll(() => elapsed(motion)).toBeGreaterThan(250);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(motion).toHaveAttribute("data-motion-state", "paused");
  const offscreenTime = await elapsed(motion);
  await page.waitForTimeout(250);
  expect(await elapsed(motion)).toBe(offscreenTime);

  await motion.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(motion).toHaveAttribute("data-motion-state", "playing", { timeout: 1000 });
  await expect.poll(() => elapsed(motion)).toBeGreaterThan(offscreenTime + 100);
  // Exercise the same browser visibility event path deterministically. This
  // verifies handling/continuity, not OS-level background throttling behavior.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(motion).toHaveAttribute("data-motion-state", "paused");
  const hiddenTime = await elapsed(motion);
  await page.waitForTimeout(250);
  expect(await elapsed(motion)).toBe(hiddenTime);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(motion).toHaveAttribute("data-motion-state", "playing", { timeout: 1000 });
  await expect.poll(() => elapsed(motion)).toBeGreaterThan(hiddenTime);
  await expect(motion).toHaveAttribute("data-motion-state", "complete", { timeout: 12000 });
});

test("reduced-motion landing keeps a readable static final gap and existing choice links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 393, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const motion = page.locator("#the-gap svg[data-gap-light-motion]");
    await expect(motion).toHaveAttribute("data-motion-state", "reduced");
    await motion.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(motion.locator('[data-gap-part="face"]')).toHaveCSS("opacity", "1");
    await expect(motion.locator('[data-gap-part="traveler"]')).toHaveCSS("opacity", "0");
    expect(await elapsed(motion)).toBeCloseTo(GAP_LIGHT_PREVIEW_DURATION, 4);
    await expectIvorySurface(motion);
    expect(await motion.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    await expect(page.locator("#gap-heading")).toBeVisible();
    await expect(page.locator(".gap-choice--return")).toHaveAttribute("href", "#hero");
    await expect(page.locator(".gap-choice--time")).toHaveAttribute("href", "#how-it-works");
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("landing gap shows the final ivory face with native choice anchors", async ({ page }) => {
    for (const width of [1440, 393, 360]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const motion = page.locator("#the-gap svg[data-gap-light-motion]");
      await expect(motion).toHaveAttribute("data-motion-state", "idle");
      await expect(motion.locator('[data-gap-part="face"]')).toHaveCSS("opacity", "1");
      await expect(motion.locator('[data-gap-part="ambient"]')).toHaveCSS("opacity", "1");
      await expect(motion.locator('[data-gap-part="traveler"]')).toHaveCSS("opacity", "0");
      const faceWidth = await motion.locator('[data-gap-part="face-rect"]').getAttribute("width");
      expect(Number(faceWidth)).toBeCloseTo(GAP_LIGHT_FINAL_WIDTH, 4);
      await expectIvorySurface(motion);
      await expect(page.locator("#gap-heading")).toBeVisible();
      await expect(page.locator(".gap-choice--return")).toHaveAttribute("href", "#hero");
      await expect(page.locator(".gap-choice--time")).toHaveAttribute("href", "#how-it-works");
    }
  });
});
