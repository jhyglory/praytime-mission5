import { expect, test, type Locator, type Page } from "@playwright/test";

declare global {
  interface Window {
    microStats: {
      started: number;
      completed: number;
      cls: number;
      samples: { at: number; values: number[]; scales: number[]; widths: string[] }[];
    };
  }
}

const runtimeProblems = new WeakMap<Page, string[]>();
const accentRatios = [0.8, 0.7] as const;

async function protectPage(page: Page) {
  // These browser checks must never reach an external persistence endpoint.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:3000(?:\/|$)).*/, route => route.abort());
  const problems: string[] = [];
  page.on("pageerror", error => problems.push(error.message));
  page.on("console", message => {
    if (["warning", "error"].includes(message.type())) problems.push(message.text());
  });
  return problems;
}

async function transform(element: Locator) {
  return element.evaluate(el => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return { x: matrix.m41, y: matrix.m42, scaleX: matrix.m11, scaleY: matrix.m22 };
  });
}

async function centerSection(page: Page, selector: string) {
  await page.locator(selector).evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
}

async function expectDecorativeAccents(grid: Locator) {
  for (const [index, ratio] of accentRatios.entries()) {
    const card = grid.locator(".stat-card").nth(index);
    const track = card.locator(".stat-track");
    const fill = card.locator(".stat-fill");
    const available = await card.evaluate(el => {
      const css = getComputedStyle(el);
      return el.getBoundingClientRect().width - Number.parseFloat(css.paddingLeft) - Number.parseFloat(css.paddingRight) - Number.parseFloat(css.borderLeftWidth) - Number.parseFloat(css.borderRightWidth);
    });
    const box = (await track.boundingBox())!;
    expect(box.width).toBeCloseTo(available, 1);
    expect((await fill.boundingBox())!.width).toBeCloseTo(box.width * ratio, 1);
    await expect(track).toHaveCSS("height", "6px");
    await expect(track).toHaveCSS("border-radius", "2px");
    await expect(track).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(track).toHaveAttribute("aria-hidden", "true");
    expect(await track.evaluate(element => element.hasAttribute("data-max"))).toBe(false);
    await expect(fill).toHaveCSS("border-radius", "2px");
    await expect(fill).toHaveCSS("background-color", "rgb(255, 68, 56)");
  }
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  runtimeProblems.set(page, await protectPage(page));
});

test.afterEach(async ({ page }) => {
  expect(runtimeProblems.get(page) ?? []).toEqual([]);
});

test("Hero responds opposite to the primary mouse within 2.5px and returns on leave", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator("#hero");
  const artwork = hero.locator(".hero-artwork img");
  await expect(hero).toHaveAttribute("data-pointer-motion", "enabled");
  const contentBefore = await hero.locator(".hero-content").boundingBox();
  const bounds = (await hero.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.9, bounds.y + bounds.height * 0.9);
  await expect.poll(async () => (await transform(artwork)).x).toBeLessThan(-0.5);
  await expect.poll(async () => (await transform(artwork)).y).toBeLessThan(-0.5);
  const moved = await transform(artwork);
  expect(Math.hypot(moved.x, moved.y)).toBeLessThanOrEqual(2.501);
  expect(moved.scaleX).toBe(1);
  expect(moved.scaleY).toBe(1);
  expect(await hero.locator(".hero-content").boundingBox()).toEqual(contentBefore);

  // Secondary mouse and pen events must not replace the primary mouse sample.
  const pointerPosition = await hero.evaluate(el => [el.style.getPropertyValue("--hero-pointer-x"), el.style.getPropertyValue("--hero-pointer-y")]);
  await hero.dispatchEvent("pointermove", { pointerType: "mouse", isPrimary: false, clientX: 1, clientY: 1 });
  await hero.dispatchEvent("pointermove", { pointerType: "pen", isPrimary: true, clientX: 1, clientY: 1 });
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(await hero.evaluate(el => [el.style.getPropertyValue("--hero-pointer-x"), el.style.getPropertyValue("--hero-pointer-y")])).toEqual(pointerPosition);

  await page.mouse.move(10, bounds.y + bounds.height + 20);
  await expect(hero).toHaveAttribute("data-pointer-state", "idle");
  await expect.poll(async () => Math.hypot(...Object.values(await transform(artwork)).slice(0, 2))).toBeLessThan(0.01);
  expect(await hero.evaluate(el => [el.style.getPropertyValue("--hero-pointer-x"), el.style.getPropertyValue("--hero-pointer-y")])).toEqual(["", ""]);
});

test("changing to reduced motion immediately disables and resets Hero parallax", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#hero");
  const artwork = hero.locator(".hero-artwork img");
  await expect(hero).toHaveAttribute("data-pointer-motion", "enabled");
  await page.mouse.move(1250, 550);
  await expect.poll(async () => (await transform(artwork)).x).toBeLessThan(-0.5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(hero).toHaveAttribute("data-pointer-motion", "disabled");
  await expect(artwork).toHaveCSS("transform", "none");
  await page.mouse.move(150, 150);
  await expect(hero).toHaveAttribute("data-pointer-state", "idle");
  await expect(artwork).toHaveCSS("transform", "none");
});

for (const { name, width, hasTouch } of [
  { name: "desktop coarse pointer", width: 1440, hasTouch: true },
  { name: "mobile-width fine pointer", width: 393, hasTouch: false },
]) {
  test(`Hero stays static with ${name}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch, reducedMotion: "no-preference" });
    try {
      const page = await context.newPage();
      const problems = await protectPage(page);
      await page.goto("/");
      expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(hasTouch);
      await expect(page.locator("#hero")).toHaveAttribute("data-pointer-motion", "disabled");
      await page.mouse.move(width * 0.8, 400);
      await expect(page.locator(".hero-artwork img")).toHaveCSS("transform", "none");
      await expect(page.locator("#hero")).toHaveAttribute("data-pointer-state", "idle");
      expect(problems).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

test("Equal Choice links share visual weight, focus rings and keyboard destination behavior", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const choices = page.locator(".gap-choice");
  await expect(choices).toHaveCount(2);
  const returning = page.getByRole("link", { name: "지금은 돌아가기", exact: true });
  const time = page.getByRole("link", { name: "5 · 10 · 15분 선택", exact: true });
  await expect(returning).toHaveAttribute("href", "#hero");
  await expect(time).toHaveAttribute("href", "#how-it-works");
  const styles = await choices.evaluateAll(elements => elements.map(el => {
    const style = getComputedStyle(el);
    const heading = getComputedStyle(el.querySelector("h3")!);
    const bounds = el.getBoundingClientRect();
    return { height: bounds.height, width: bounds.width, surface: style.backgroundColor, border: style.border, color: heading.color, weight: heading.fontWeight, size: heading.fontSize };
  }));
  expect(styles[0]).toEqual(styles[1]);
  expect(styles[0].height).toBeGreaterThanOrEqual(44);

  await returning.focus();
  await page.keyboard.press("Tab");
  await expect(time).toBeFocused();
  for (const choice of [time, returning]) {
    if (choice === returning) await page.keyboard.press("Shift+Tab");
    await expect(choice).toBeFocused();
    expect(await choice.evaluate(el => el.matches(":focus-visible"))).toBe(true);
    await expect(choice).toHaveCSS("outline-width", "2px");
    await expect(choice).toHaveCSS("outline-style", "solid");
    await expect(choice).toHaveCSS("outline-color", "rgb(167, 156, 182)");
    await expect(choice).toHaveCSS("outline-offset", "3px");
  }
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#hero$/);
  await expect(page.locator("#hero-heading")).toBeFocused();
  await time.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.locator("#how-heading")).toBeFocused();
});

test("both Equal Choice panels lift and press equally, with outward arrows", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const [index, direction] of [[0, -1], [1, 1]]) {
    const choice = page.locator(".gap-choice").nth(index);
    const panel = page.locator(".equal-outcomes > div").nth(index);
    const arrow = choice.locator("img");
    const textColor = await choice.locator("h3").evaluate(el => getComputedStyle(el).color);
    await choice.hover();
    await expect.poll(async () => (await transform(panel)).y).toBeCloseTo(-2, 1);
    await expect.poll(async () => (await transform(arrow)).x).toBeCloseTo(4 * direction, 1);
    await expect(choice.locator("h3")).toHaveCSS("color", textColor);
    await expect(choice).toHaveCSS("box-shadow", "none");
    await expect.poll(() => choice.evaluate(el => getComputedStyle(el, "::before").opacity)).toBe("1");
    await page.mouse.down();
    try {
      await expect.poll(async () => (await transform(panel)).y).toBeCloseTo(0, 2);
      await expect.poll(async () => (await transform(panel)).scaleX).toBeCloseTo(0.995, 3);
      await expect(choice).toHaveCSS("background-color", "rgba(0, 0, 0, 0.08)");
    } finally {
      await page.mouse.up();
    }
  }
});

test("reduced motion keeps Equal Choice hover and press transforms static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (let index = 0; index < 2; index += 1) {
    const choice = page.locator(".gap-choice").nth(index);
    const panel = page.locator(".equal-outcomes > div").nth(index);
    await choice.hover();
    await expect(panel).toHaveCSS("transform", "none");
    await expect(choice.locator("img")).toHaveCSS("transform", "none");
    await page.mouse.down();
    try {
      await expect(panel).toHaveCSS("transform", "none");
      await expect(choice.locator("img")).toHaveCSS("transform", "none");
    } finally {
      await page.mouse.up();
    }
  }
});

test("navigation follows the real center section and clears in unmapped sections", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const nav = page.getByRole("navigation", { name: "주요 메뉴" });
  await expect(nav.locator("a[aria-current='location']")).toHaveCount(0);
  for (const [id, name] of [["how-it-works", "작동 방식"], ["prayer-choice", "기도와 선택"], ["faq", "FAQ"]]) {
    await centerSection(page, `#${id}`);
    const active = nav.getByRole("link", { name, exact: true });
    await expect(active).toHaveAttribute("aria-current", "location");
    await expect(nav.locator("a[aria-current='location']")).toHaveCount(1);
    await expect(active).toHaveCSS("opacity", "1");
    for (const inactive of await nav.locator("a:not([aria-current])").all()) await expect(inactive).toHaveCSS("opacity", "0.65");
  }
  for (const selector of ["#the-gap", "#beta-signup", "#hero"]) {
    await centerSection(page, selector);
    await expect(nav.locator("a[aria-current='location']")).toHaveCount(0);
  }
});

test("active navigation retains native anchor names, URLs and keyboard heading focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "주요 메뉴" });
  for (const [name, destination, heading] of [
    ["작동 방식", "how-it-works", "how-heading"],
    ["기도와 선택", "prayer-choice", "prayer-heading"],
    ["FAQ", "faq", "faq-heading"],
  ]) {
    const link = nav.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("href", `#${destination}`);
    await link.focus();
    await page.keyboard.press("Enter");
    expect(new URL(page.url()).hash).toBe(`#${destination}`);
    await expect(page.locator(`#${heading}`)).toBeFocused();
    await expect(link).toHaveAttribute("aria-current", "location");
  }
});

test("WHY NOW shares 1400ms cubic number/fill progress, runs once per load and replays after both reloads", async ({ page }) => {
  await page.addInitScript(() => {
    // Obsolete session flags must not suppress the new per-page animation.
    for (const rate of [34.3, 25.3]) sessionStorage.setItem(`praytime:why-now-countup:v3:${rate}`, "done");
    history.scrollRestoration = "manual";
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const grid = page.locator("#why-stats");
  const numbers = grid.locator("[data-stat-number]");
  await expect(grid).toHaveAttribute("data-count-state", "pending");
  await expect(numbers).toHaveText(["0.0%", "0.0%"]);
  await expect(grid.locator(".stat-value .sr-only")).toHaveText(["34.3%", "25.3%"]);
  await page.evaluate(() => {
    const grid = document.getElementById("why-stats")!;
    const numbers = [...grid.querySelectorAll<HTMLElement>("[data-stat-number]")];
    const fills = [...grid.querySelectorAll<HTMLElement>(".stat-fill")];
    const result: Window["microStats"] = window.microStats = { started: 0, completed: 0, cls: 0, samples: [] };
    const observer = new MutationObserver(() => {
      const state = grid.dataset.countState;
      const now = performance.now();
      if (state === "running" && !result.started) result.started = now;
      if (state === "running" || state === "complete") result.samples.push({
        at: now,
        values: numbers.map(el => Number.parseFloat(el.textContent!)),
        scales: fills.map(el => el.style.transform ? Number(el.style.transform.match(/scaleX\(([^)]+)\)/)?.[1]) : 1),
        widths: fills.map(el => getComputedStyle(el).width),
      });
      if (state === "complete") {
        result.completed = now;
        observer.disconnect();
      }
    });
    observer.observe(grid, { subtree: true, childList: true, characterData: true, attributes: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) result.cls += shift.value;
      }
    }).observe({ type: "layout-shift" });
  });
  await centerSection(page, "#why-stats");
  await expect(grid).toHaveAttribute("data-count-state", "complete");
  await expect(numbers).toHaveText(["34.3%", "25.3%"]);
  await expect(grid).toHaveAttribute("data-count-runs", "1");
  const observation = await page.evaluate(() => window.microStats);
  expect(observation.completed - observation.started).toBeGreaterThanOrEqual(1350);
  expect(observation.completed - observation.started).toBeLessThanOrEqual(1550);
  expect(observation.samples.length).toBeGreaterThan(2);
  expect(observation.samples.some(sample => sample.values[0] > 0 && sample.values[0] < 34.3)).toBe(true);
  expect(observation.samples.some(sample => sample.scales[0] > 0.25 && sample.scales[0] < 0.8)).toBe(true);
  for (const [index, final] of [34.3, 25.3].entries()) {
    const track = (await grid.locator(".stat-track").nth(index).boundingBox())!;
    let previous = 0;
    for (const sample of observation.samples) {
      expect(sample.values[index]).toBeGreaterThanOrEqual(previous);
      expect(sample.values[index]).toBeLessThanOrEqual(final);
      expect(Number.parseFloat(sample.widths[index])).toBeCloseTo(track.width * accentRatios[index], 1);
      // Number and decorative fill use the same eased scalar; the number rounds to one decimal.
      expect(Math.abs(sample.values[index] - final * sample.scales[index])).toBeLessThanOrEqual(0.051);
      const progress = Math.min(1, Math.max(0, (sample.at - observation.started) / 1400));
      expect(Math.abs(sample.scales[index] - (1 - (1 - progress) ** 3))).toBeLessThan(0.025);
      previous = sample.values[index];
    }
  }
  expect(observation.cls).toBeLessThanOrEqual(0.001);
  await expectDecorativeAccents(grid);

  for (let reload = 0; reload < 2; reload += 1) {
    await centerSection(page, "#hero");
    await centerSection(page, "#why-stats");
    await expect(grid).toHaveAttribute("data-count-state", "complete");
    await expect(grid).toHaveAttribute("data-count-runs", "1");
    await expect(numbers).toHaveText(["34.3%", "25.3%"]);
    await centerSection(page, "#hero");
    await page.reload();
    await expect(grid).toHaveAttribute("data-count-state", "pending");
    await expect(grid).toHaveAttribute("data-count-runs", "0");
    await expect(numbers).toHaveText(["0.0%", "0.0%"]);
    await centerSection(page, "#why-stats");
    await expect(grid).toHaveAttribute("data-count-state", "running");
    await expect(grid).toHaveAttribute("data-count-state", "complete");
    await expect(grid).toHaveAttribute("data-count-runs", "1");
    await expect(numbers).toHaveText(["34.3%", "25.3%"]);
  }
});

test("WHY NOW reduced motion immediately presents final accessible values and decorative accents", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const grid = page.locator("#why-stats");
  await expect(grid).toHaveAttribute("data-count-state", "complete");
  await expect(grid).toHaveAttribute("data-count-runs", "0");
  await grid.scrollIntoViewIfNeeded();
  await expect(grid.locator("[data-stat-number]")).toHaveText(["34.3%", "25.3%"]);
  await expect(grid.locator(".stat-value .sr-only")).toHaveText(["34.3%", "25.3%"]);
  for (const fill of await grid.locator(".stat-fill").all()) await expect(fill).toHaveCSS("transform", "none");
  await expectDecorativeAccents(grid);
});

test("without JavaScript, WHY NOW still renders exact statistics and decorative accents", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    const problems = await protectPage(page);
    await page.goto("/");
    const grid = page.locator("#why-stats");
    await grid.scrollIntoViewIfNeeded();
    await expect(grid.locator("[data-stat-number]")).toHaveText(["34.3%", "25.3%"]);
    await expect(grid.locator(".stat-value .sr-only")).toHaveText(["34.3%", "25.3%"]);
    await expectDecorativeAccents(grid);
    const intro = page.locator("[data-signature-transition]");
    await intro.scrollIntoViewIfNeeded();
    await expect(intro.locator(".card-intro__headline")).toBeVisible();
    await expect(intro.locator(".card-intro__brand")).toBeVisible();
    await expect(intro.locator(".card-intro__therefore")).toBeVisible();
    await expect(intro.locator(".card-intro__anchor")).toBeVisible();
    await expect(intro.locator(".card-intro__art")).toBeHidden();
    await expect(intro.locator(".card-intro__art")).toHaveCount(0);
    expect(await intro.evaluate(el => el.getAnimations({ subtree:true }).length)).toBe(0);
    await expect(intro.locator(".card-intro__scene")).toHaveAttribute("aria-hidden", "true");
    await expect(intro.locator(".sr-only")).toHaveText("그래서, PRAYTIME은 손이 먼저 움직인 순간, 다시 생각할 시간을 돌려드립니다. 잠깐 기도하고, 필요한 만큼만 선택합니다.");
    expect(problems).toEqual([]);
  } finally {
    await context.close();
  }
});

test("mobile statistics trigger individually at 40% of the unmodified viewport and pause offscreen", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 600 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const grid = page.locator("#why-stats");
  const first = grid.locator(".stat-card").nth(0);
  const second = grid.locator(".stat-card").nth(1);
  const reveal = (card: Locator, fraction: number) => card.evaluate((el, fraction) => {
    const box = el.getBoundingClientRect();
    scrollTo({ top: scrollY + box.top - (innerHeight - box.height * fraction), behavior: "instant" });
  }, fraction);
  await reveal(first, 0.39);
  await page.waitForTimeout(150);
  await expect(first).toHaveAttribute("data-count-state", "pending");
  await expect(first.locator("[data-stat-number]")).toHaveText("0.0%");
  await reveal(first, 0.41);
  await expect(first).toHaveAttribute("data-count-state", "running");
  await expect(second).toHaveAttribute("data-count-state", "pending");
  await expect(second.locator("[data-stat-number]")).toHaveText("0.0%");
  await expect.poll(() => first.locator("[data-stat-number]").evaluate(el => Number.parseFloat(el.textContent!))).toBeGreaterThan(0);
  await centerSection(page, "#hero");
  await expect(first).toHaveAttribute("data-count-state", "paused");
  const paused = await first.evaluate(el => ({ number: el.querySelector("[data-stat-number]")!.textContent, fill: el.querySelector<HTMLElement>(".stat-fill")!.style.transform }));
  await page.waitForTimeout(250);
  expect(await first.evaluate(el => ({ number: el.querySelector("[data-stat-number]")!.textContent, fill: el.querySelector<HTMLElement>(".stat-fill")!.style.transform }))).toEqual(paused);
  await reveal(first, 0.41);
  await expect(first).toHaveAttribute("data-count-state", "running");
  await expect(first).toHaveAttribute("data-count-state", "complete");
  await expect(second).toHaveAttribute("data-count-state", "pending");
  await expect(second).toHaveAttribute("data-count-runs", "0");
  await reveal(second, 0.41);
  await expect(second).toHaveAttribute("data-count-state", "running");
  await expect(second).toHaveAttribute("data-count-state", "complete");
  await expect(grid).toHaveAttribute("data-count-state", "complete");
  await expect(first).toHaveAttribute("data-count-runs", "1");
  await expect(second).toHaveAttribute("data-count-runs", "1");
  await expectDecorativeAccents(grid);
});

test("WHY NOW pauses in the background and reduced motion finishes a running animation", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const grid = page.locator("#why-stats");
  await centerSection(page, "#why-stats");
  await expect(grid).toHaveAttribute("data-count-state", "running");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(grid).toHaveAttribute("data-count-state", "paused");
  const paused = await grid.evaluate(el => [...el.querySelectorAll<HTMLElement>("[data-stat-number], .stat-fill")].map(node => [node.textContent, node.style.transform]));
  await page.waitForTimeout(250);
  expect(await grid.evaluate(el => [...el.querySelectorAll<HTMLElement>("[data-stat-number], .stat-fill")].map(node => [node.textContent, node.style.transform]))).toEqual(paused);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(grid).toHaveAttribute("data-count-state", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(grid).toHaveAttribute("data-count-state", "complete");
  await expect(grid.locator("[data-stat-number]")).toHaveText(["34.3%", "25.3%"]);
  await expect(grid.locator(".stat-value .sr-only")).toHaveText(["34.3%", "25.3%"]);
  for (const fill of await grid.locator(".stat-fill").all()) await expect(fill).toHaveCSS("transform", "none");
  await expectDecorativeAccents(grid);
});

test("mobile touch preserves choice, wheel, FAQ and beta CTA flows without saving data", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 393, height: 852 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    const problems = await protectPage(page);
    let submissionRequests = 0;
    page.on("request", request => {
      if (new URL(request.url()).pathname === "/api/beta-signup") submissionRequests += 1;
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => navigator.maxTouchPoints > 0 && matchMedia("(pointer: coarse)").matches)).toBe(true);
    await expect(page.locator("#hero")).toHaveAttribute("data-pointer-motion", "disabled");

    await page.getByRole("link", { name: "5 · 10 · 15분 선택", exact: true }).tap();
    await expect(page).toHaveURL(/#how-it-works$/);
    const wheel = page.getByRole("radiogroup", { name: "사용 시간 미리보기" });
    await wheel.getByRole("radio", { name: "15분", exact: true }).tap();
    await expect(wheel).toHaveAttribute("data-selected", "15");
    await expect(wheel.getByRole("radio", { name: "15분", exact: true })).toHaveAttribute("aria-checked", "true");
    await wheel.getByRole("radio", { name: "10분", exact: true }).tap();
    await expect(wheel).toHaveAttribute("data-selected", "10");
    await expect(wheel.getByRole("radio", { name: "10분", exact: true })).toHaveAttribute("aria-checked", "true");

    const questions = page.locator(".faq-item button");
    await expect(questions).toHaveCount(7);
    await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "false");
    await questions.nth(1).tap();
    await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#faq-answer-1")).toBeVisible();
    await questions.nth(1).tap();
    await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#faq-answer-1")).toBeHidden();

    await page.locator(".hero-actions").getByRole("link", { name: "무료로 신청하기", exact: true }).tap();
    await expect(page).toHaveURL(/#beta-signup$/);
    await expect(page.getByRole("button", { name: "무료로 신청하기", exact: true })).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(submissionRequests).toBe(0);
    expect(problems).toEqual([]);
  } finally {
    await context.close();
  }
});
