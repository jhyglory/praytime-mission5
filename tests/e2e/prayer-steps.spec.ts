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
    if (!["GET", "HEAD"].includes(request.method()) || new URL(request.url()).origin !== origin) return route.abort();
    return route.continue();
  });
});

test.afterEach(async ({ page }) => {
  expect(observations.get(page)?.errors ?? []).toEqual([]);
  expect(observations.get(page)?.posts ?? []).toEqual([]);
});

for (const width of [1440, 393, 360]) {
  test(`prayer steps draw and accumulate PAUSE then PRAY then CHOOSE once on entry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => { history.scrollRestoration = "manual"; });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const steps = page.locator(".prayer-steps");
    await expect(steps).toHaveAttribute("data-prayer-duration", "3900");
    await expect(steps.locator("li")).toHaveCount(3);
    await expect(steps.locator("h3")).toHaveText(["PAUSE", "PRAY", "CHOOSE"]);
    await page.waitForTimeout(150);
    const initial = await steps.locator("li").evaluateAll(items => items.map(item => ({
      text: [...item.querySelectorAll(":scope > p, :scope > h3")].map(element => Number(getComputedStyle(element).opacity)),
      light: Number(getComputedStyle(item.querySelector(".prayer-light-divider")!).opacity),
    })));
    expect(initial).toEqual(Array.from({ length: 3 }, () => ({ text: [0, 0, 0], light: 0 })));

    // Use real elapsed frames through all three phases, not timeline seeking.
    const result = await steps.evaluate(async element => {
      const items = [...element.querySelectorAll<HTMLElement>(":scope > li")];
      const geometry = () => items.map(item => {
        const box = item.getBoundingClientRect();
        return { x: box.x, pageY: box.y + scrollY, width: box.width, height: box.height };
      });
      const before = geometry();
      const samples: { ms: number; clock: number; state: string | undefined; text: number[][]; light: number[]; line: number[] }[] = [];
      const start = performance.now();
      element.scrollIntoView({ block: "center", behavior: "instant" });
      await new Promise<void>(resolve => {
        const sample = () => {
          const clock = element.getAnimations({ subtree: true })[0]?.currentTime;
          samples.push({
            ms: performance.now() - start,
            clock: typeof clock === "number" ? clock : 0,
            state: (element as HTMLElement).dataset.prayerMotion,
            text: items.map(item => [...item.querySelectorAll(":scope > p, :scope > h3")].map(text => Number(getComputedStyle(text).opacity))),
            light: items.map(item => Number(getComputedStyle(item.querySelector(".prayer-light-divider")!).opacity)),
            line: items.map(item => {
              const transform = getComputedStyle(item.querySelector(".prayer-light-divider__line")!).transform;
              return transform === "none" ? 1 : new DOMMatrix(transform).a;
            }),
          });
          if ((element as HTMLElement).dataset.prayerMotion === "complete" || performance.now() - start > 5500) resolve();
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      return { samples, before, after: geometry(), state: (element as HTMLElement).dataset.prayerMotion };
    });
    expect(result.state).toBe("complete");
    expect(result.samples.at(-1)!.ms).toBeGreaterThanOrEqual(3800);
    expect(result.samples.at(-1)!.ms).toBeLessThan(5000);
    for (let stage = 0; stage < 3; stage += 1) {
      const reveal = result.samples.filter(sample => sample.text[stage][1] > .05 && sample.text[stage][1] < .95);
      expect(reveal.length, `step${stage + 1} must fade, not pop in`).toBeGreaterThan(3);
      expect(reveal.some(sample => sample.text.slice(0, stage).every(text => text.every(opacity => opacity > .99)))).toBe(true);
      expect(reveal.every(sample => sample.text.slice(stage + 1).every(text => text.every(opacity => opacity === 0)))).toBe(true);
      const draw = result.samples.filter(sample => sample.clock >= stage * 1300 + 70 && sample.clock < stage * 1300 + 950);
      expect(draw.some(sample => sample.light[stage] > .05 && sample.line[stage] > .05 && sample.line[stage] < .95), `step${stage + 1} line must actually draw`).toBe(true);
      expect(draw.every(sample => sample.light.slice(0, stage).every(opacity => opacity > .99)), `earlier lights must stay visible during step${stage + 1}`).toBe(true);
      expect(draw.every(sample => sample.line.slice(0, stage).every(scale => Math.abs(scale - 1) < .001)), `earlier lines must stay fully drawn during step${stage + 1}`).toBe(true);
      expect(draw.every(sample => sample.light.slice(stage + 1).every(opacity => opacity < .01)), `future lights must stay hidden during step${stage + 1}`).toBe(true);
      const nextPhase = result.samples.find(sample => sample.clock >= stage * 1300 + 1230);
      expect(nextPhase!.light[stage]).toBeGreaterThan(.99);
      expect(nextPhase!.line[stage]).toBeCloseTo(1, 3);
      expect(result.samples.every((sample, index) => index === 0 || sample.light[stage] + .000001 >= result.samples[index - 1].light[stage]), `step${stage + 1} light must never fade out`).toBe(true);
    }
    const final = result.samples.at(-1)!;
    expect(final.text).toEqual(Array.from({ length: 3 }, () => [1, 1, 1]));
    expect(final.light).toEqual([1, 1, 1]);
    expect(final.line).toEqual([1, 1, 1]);
    result.before.forEach((box, index) => {
      for (const property of ["x", "pageY", "width", "height"] as const) expect(result.after[index][property], `${property} stays fixed`).toBeCloseTo(box[property], 1);
    });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await steps.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(steps).toHaveAttribute("data-prayer-motion", "complete");
    for (const text of await steps.locator("li > h3").all()) await expect(text).toHaveCSS("opacity", "1");
    for (const light of await steps.locator("li > .prayer-light-divider").all()) await expect(light).toHaveCSS("opacity", "1");
    const retainedLines = await steps.locator(".prayer-light-divider__line").evaluateAll(lines => lines.map(line => new DOMMatrix(getComputedStyle(line).transform).a));
    expect(retainedLines).toEqual([1, 1, 1]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  });
}

test("prayer sequence pauses outside the viewport and in a background tab then resumes its clock", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const steps = page.locator(".prayer-steps");
  await steps.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(steps).toHaveAttribute("data-prayer-motion", "running");
  await page.waitForTimeout(300);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(steps).toHaveAttribute("data-prayer-motion", "paused");
  const paused = await steps.evaluate(element => Number(element.getAnimations({ subtree: true })[0]?.currentTime));
  await page.waitForTimeout(250);
  const stillPaused = await steps.evaluate(element => Number(element.getAnimations({ subtree: true })[0]?.currentTime));
  expect(stillPaused).toBeCloseTo(paused, 1);
  await steps.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(steps).toHaveAttribute("data-prayer-motion", "running");
  await expect.poll(() => steps.evaluate(element => Number(element.getAnimations({ subtree: true })[0]?.currentTime))).toBeGreaterThan(paused + 30);

  // Existing tests simulate document visibility so this stays deterministic in headless Chrome.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(steps).toHaveAttribute("data-prayer-motion", "paused");
  const background = await steps.evaluate(element => Number(element.getAnimations({ subtree: true })[0]?.currentTime));
  await page.waitForTimeout(250);
  expect(await steps.evaluate(element => Number(element.getAnimations({ subtree: true })[0]?.currentTime))).toBeCloseTo(background, 1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(steps).toHaveAttribute("data-prayer-motion", "running");
  await expect(steps).toHaveAttribute("data-prayer-motion", "complete", { timeout: 5000 });
  for (const light of await steps.locator("li > .prayer-light-divider").all()) await expect(light).toHaveCSS("opacity", "1");
});

test("reduced motion shows readable prayer steps and static original dividers immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 393, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const steps = page.locator(".prayer-steps");
    await expect(steps).toHaveAttribute("data-prayer-motion", "reduced");
    const presentation = await steps.locator("li").evaluateAll(items => items.map(item => ({
      text: [...item.querySelectorAll(":scope > p, :scope > h3")].map(text => getComputedStyle(text).opacity),
      light: getComputedStyle(item.querySelector(".prayer-light-divider")!).opacity,
    })));
    expect(presentation).toEqual(Array.from({ length: 3 }, () => ({ text: ["1", "1", "1"], light: "1" })));
    expect(await steps.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  }
});

test("switching to reduced motion during prayer reveal finishes all text without replay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const steps = page.locator(".prayer-steps");
  await steps.evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(steps).toHaveAttribute("data-prayer-motion", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(steps).toHaveAttribute("data-prayer-motion", "reduced");
  for (const heading of await steps.locator("li > h3").all()) await expect(heading).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(steps).toHaveAttribute("data-prayer-motion", /^(complete|reduced)$/);
  for (const heading of await steps.locator("li > h3").all()) await expect(heading).toHaveCSS("opacity", "1");
});

test.describe("prayer steps without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("keeps all three meanings and original lights visible", async ({ page }) => {
    for (const width of [1440, 393, 360]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const steps = page.locator(".prayer-steps");
      await expect(steps.locator("h3")).toHaveText(["PAUSE", "PRAY", "CHOOSE"]);
      for (const item of await steps.locator("li").all()) {
        await expect(item.locator(".prayer-light-divider")).toHaveCSS("opacity", "1");
        for (const text of await item.locator(":scope > p, :scope > h3").all()) await expect(text).toHaveCSS("opacity", "1");
      }
    }
  });
});
