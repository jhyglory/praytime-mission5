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

for (const width of [1440, 393, 360]) {
  test(`question reveals its second phrase 1200ms after the first without moving at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => { history.scrollRestoration = "manual"; });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const heading = page.locator("#question-heading");
    const lead = heading.locator('[data-question-part="lead"]');
    const followup = heading.locator('[data-question-part="followup"]');
    await expect(heading).toHaveAttribute("data-question-reveal", "pending");
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await expect(lead).toHaveCSS("opacity", "0");
    await expect(followup).toHaveCSS("opacity", "0");
    await expect(heading).toContainText("무심코 열게 된 SNS,");
    await expect(page.getByText("BEFORE YOU OPEN", { exact: true })).toHaveCount(0);
    const spacing = await heading.evaluate(element => {
      const lead = element.querySelector<HTMLElement>('[data-question-part="lead"]')!;
      const followup = element.querySelector<HTMLElement>('[data-question-part="followup"]')!;
      return { pitch:followup.getBoundingClientRect().top - lead.getBoundingClientRect().top,
        gap:followup.getBoundingClientRect().top - lead.getBoundingClientRect().bottom,
        leading:Number.parseFloat(getComputedStyle(lead).lineHeight), followupLeading:Number.parseFloat(getComputedStyle(followup).lineHeight) };
    });
    expect(spacing.pitch).toBeCloseTo(spacing.leading * 3, 1);
    expect(spacing.gap).toBeCloseTo(spacing.leading * 2, 1);
    expect(spacing.followupLeading).toBe(spacing.leading);

    const result = await heading.evaluate(async element => {
      const geometry = () => {
        const box = element.getBoundingClientRect();
        return { x: box.x, pageY: box.y + scrollY, width: box.width, height: box.height,
          sectionHeight: element.closest("section")!.getBoundingClientRect().height };
      };
      const before = geometry();
      const lead = element.querySelector<HTMLElement>('[data-question-part="lead"]')!;
      const followup = element.querySelector<HTMLElement>('[data-question-part="followup"]')!;
      const samples: { time: number; lead: number; followup: number }[] = [];
      const starts: Record<string, number> = {};
      const startedAt = performance.now();
      const onStart = (event: Event) => {
        const target = event.target as HTMLElement;
        if ((event as TransitionEvent).propertyName === "opacity" && target.dataset.questionPart) starts[target.dataset.questionPart] = performance.now() - startedAt;
      };
      element.addEventListener("transitionstart", onStart);
      element.scrollIntoView({ block: "center", behavior: "instant" });
      await new Promise<void>(resolve => {
        const sample = () => {
          const time = performance.now() - startedAt;
          samples.push({ time, lead: Number(getComputedStyle(lead).opacity), followup: Number(getComputedStyle(followup).opacity) });
          if (time >= 2300) resolve();
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      element.removeEventListener("transitionstart", onStart);
      return { before, after: geometry(), samples, starts, scroll: scrollY };
    });
    expect(result.scroll).toBeGreaterThan(0);
    expect(result.samples.some(sample => sample.lead > .05 && sample.lead < .95 && sample.followup === 0)).toBe(true);
    expect(result.samples.some(sample => sample.lead === 1 && sample.followup === 0)).toBe(true);
    expect(result.samples.some(sample => sample.lead === 1 && sample.followup > .05 && sample.followup < .95)).toBe(true);
    expect(result.starts.followup - result.starts.lead).toBeGreaterThanOrEqual(1150);
    expect(result.starts.followup - result.starts.lead).toBeLessThan(1300);
    await expect(heading).toHaveAttribute("data-question-reveal", "shown");
    await expect(lead).toHaveCSS("opacity", "1");
    await expect(followup).toHaveCSS("opacity", "1");
    for (const property of ["x", "pageY", "width", "height", "sectionHeight"] as const) {
      expect(result.after[property], `${property} must not move during opacity reveal`).toBeCloseTo(result.before[property], 1);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await heading.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(100);
    await expect(heading).toHaveAttribute("data-question-reveal", "shown");
    await expect(lead).toHaveCSS("opacity", "1");
    await expect(followup).toHaveCSS("opacity", "1");
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
    await expect(heading.locator('[data-question-part="lead"]')).toHaveCSS("opacity", "1");
    await expect(heading.locator('[data-question-part="followup"]')).toHaveCSS("opacity", "1");
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
      await expect(page.locator('#question-heading [data-question-part="lead"]')).toHaveCSS("opacity", "1");
      await expect(page.locator('#question-heading [data-question-part="followup"]')).toHaveCSS("opacity", "1");
      await expect(page.locator("#question-heading")).toContainText("진짜 꼭 필요해서");
      await expect(page.locator(".one-question")).toHaveAttribute("aria-labelledby", "question-heading");
      await expect(page.getByText("BEFORE YOU OPEN", { exact: true })).toHaveCount(0);
    }
  });
});
