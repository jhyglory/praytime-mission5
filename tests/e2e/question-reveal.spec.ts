import { expect, test, type Page } from "@playwright/test";

const observations = new WeakMap<Page, { errors: string[]; posts: string[] }>();

test.beforeEach(async ({ page, baseURL }) => {
  const observation = { errors: [] as string[], posts: [] as string[] };
  observations.set(page, observation);
  const origin = new URL(baseURL!).origin;
  page.on("pageerror", error => observation.errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") observation.errors.push(message.text()); });
  page.on("request", request => { if (request.method() === "POST") observation.posts.push(request.url()); });
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

for (const width of [1440, 393]) {
  test(`question stays hidden until scrolling and fades once without moving at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => { history.scrollRestoration = "manual"; });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const heading = page.locator("#question-heading");
    await expect(heading).toHaveAttribute("data-question-reveal", "pending");
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await expect(heading).toHaveCSS("opacity", "0");
    await expect(heading).toContainText("무심코 열게 된 SNS,");
    await expect(page.getByText("BEFORE YOU OPEN", { exact: true })).toHaveCount(0);

    const result = await heading.evaluate(async element => {
      const geometry = () => {
        const box = element.getBoundingClientRect();
        return { x: box.x, pageY: box.y + scrollY, width: box.width, height: box.height,
          sectionHeight: element.closest("section")!.getBoundingClientRect().height };
      };
      const before = geometry();
      const samples: { time: number; opacity: number }[] = [];
      const startedAt = performance.now();
      element.scrollIntoView({ block: "center", behavior: "instant" });
      await new Promise<void>(resolve => {
        const sample = () => {
          const time = performance.now() - startedAt;
          samples.push({ time, opacity: Number(getComputedStyle(element).opacity) });
          if (time >= 1100) resolve();
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      return { before, after: geometry(), samples, scroll: scrollY };
    });
    expect(result.scroll).toBeGreaterThan(0);
    expect(result.samples.some(sample => sample.opacity > .05 && sample.opacity < .95)).toBe(true);
    await expect(heading).toHaveAttribute("data-question-reveal", "shown");
    await expect(heading).toHaveCSS("opacity", "1");
    for (const property of ["x", "pageY", "width", "height", "sectionHeight"] as const) {
      expect(result.after[property], `${property} must not move during opacity reveal`).toBeCloseTo(result.before[property], 1);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await heading.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(100);
    await expect(heading).toHaveAttribute("data-question-reveal", "shown");
    await expect(heading).toHaveCSS("opacity", "1");
    expect(await heading.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("question is immediately readable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 393, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const heading = page.locator("#question-heading");
    await expect(heading).toHaveCSS("opacity", "1");
    await expect(heading).toContainText("연 적이 얼마나 있나요?");
    expect(await heading.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  }
});

test.describe("question without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("keeps the question readable without a scroll controller", async ({ page }) => {
    for (const width of [1440, 393, 360]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.locator("#question-heading")).toHaveCSS("opacity", "1");
      await expect(page.locator("#question-heading")).toContainText("진짜 꼭 필요해서");
      await expect(page.locator(".one-question")).toHaveAttribute("aria-labelledby", "question-heading");
      await expect(page.getByText("BEFORE YOU OPEN", { exact: true })).toHaveCount(0);
    }
  });
});
