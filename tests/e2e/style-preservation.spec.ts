import { test, expect } from "@playwright/test";
import baseline from "../fixtures/style-baseline.json" with { type: "json" };

// Captured from the approved pre-refactor screen, not generated from new utilities.
// This guards actual geometry/colors/type across both sides of responsive boundaries.
test("Tailwind migration preserves the approved responsive layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of baseline) {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const actual = await page.evaluate(slots => slots.map(({ selector, styles }) => {
      const element = document.querySelector(selector)!;
      const rect = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      return { selector, rect: [rect.x, rect.y, rect.width, rect.height], styles: Object.fromEntries(Object.keys(styles).map(key => [key, computed.getPropertyValue(key)])) };
    }), viewport.slots);
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i].styles, `${viewport.width}px ${actual[i].selector}`).toEqual(viewport.slots[i].styles);
      for (let axis = 0; axis < 4; axis++) {
        expect(Math.abs(actual[i].rect[axis] - viewport.slots[i].rect[axis]), `${viewport.width}px ${actual[i].selector} rect[${axis}]`).toBeLessThan(0.1);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  }
});
