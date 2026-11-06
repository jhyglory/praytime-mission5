import { expect, test, type Page } from "@playwright/test";

const regions = [
  ".landing-header", ".hero", ".one-question", ".why-now",
  ".card-intro__clean", ".card-intro__cards", "#the-gap",
  ".time-section", ".prayer-section", "#faq", ".beta-section", ".site-footer",
] as const;

// Whole-page rhythm verified against final1209:514 /1209:1051. At360px,
// lower content may grow as it wraps; intro fills900px and FAQ follows the85% user override.
const referenceHeights: Record<number, readonly number[]> = {
  1440: [88, 684, 484, 963, 900, 760, 1180, 923.40625, 757, 834.71875, 1739, 123],
  393: [72, 932, 380, 1098, 900, 680, 1024, 1187.734375, 999, 1065.71875, 2513, 168],
  360: [72, 932, 380, 1098, 900, 680, 1024, 1170.390625, 1051, 1091.21875, 2539, 168],
};

const observations = new WeakMap<Page, { errors: string[]; posts: string[] }>();

test.beforeEach(async ({ page, baseURL }) => {
  const observation = { errors: [] as string[], posts: [] as string[] };
  observations.set(page, observation);
  const origin = new URL(baseURL!).origin;
  page.on("pageerror", error => observation.errors.push(error.message));
  page.on("console", message => {
    if (["error", "warning"].includes(message.type())) observation.errors.push(message.text());
  });
  page.on("request", request => {
    if (request.method() === "POST") observation.posts.push(request.url());
  });
  // Integration navigation never submits an application or reaches production.
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
  test(`whole-page approved rhythm, readable copy and no overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main > section")).toHaveCount(8);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-form-group]")).toHaveCount(8);
    await expect(page.locator(".faq-item button")).toHaveCount(7);
    await expect(page.locator("#faq-question-0")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("04 / THE GAP", { exact: true })).toHaveCount(0);
    await expect(page.getByText("열기 전, 무엇 때문에 열었는지 떠올려 보세요.", { exact: true })).toHaveCount(0);

    const geometry = await page.evaluate(selectors => selectors.map(selector => {
      const element = document.querySelector(selector)!;
      const box = element.getBoundingClientRect();
      return { selector, x: box.x, y: box.y + scrollY, width: box.width, height: box.height };
    }), regions);
    for (const [index, box] of geometry.entries()) {
      expect(Math.abs(box.height - referenceHeights[width][index]), `${box.selector} approved height`).toBeLessThanOrEqual(1);
      const inset = index === 0 ? (width === 1440 ? 80 : 24) : 0;
      expect(box.x, `${box.selector} left edge`).toBeCloseTo(inset, 1);
      expect(box.width, `${box.selector} full available width`).toBeCloseTo(width - inset * 2, 1);
      if (index > 1) {
        const previous = geometry[index - 1];
        expect(box.y, `${previous.selector} meets ${box.selector}`).toBeCloseTo(previous.y + previous.height, 1);
      }
    }
    expect(geometry[1].y).toBe(0);
    const footer = geometry.at(-1)!;
    expect(Math.abs(await page.evaluate(() => document.documentElement.scrollHeight) - footer.y - footer.height)).toBeLessThanOrEqual(1);

    for (const selector of [".hero", ".one-question", ".prayer-section"]) {
      await expect(page.locator(selector)).toHaveCSS("background-color", "rgb(23, 28, 38)");
    }
    for (const selector of [".why-now", ".time-section", "#faq", ".beta-section", ".site-footer"]) {
      await expect(page.locator(selector)).toHaveCSS("background-color", "rgb(245, 242, 247)");
    }
    for (const selector of ["[data-signature-transition]", "#the-gap"]) {
      await expect(page.locator(selector)).toHaveCSS("background-color", "rgb(11, 16, 32)");
    }
    await expect(page.locator(".landing-header")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    const why = await page.locator(".why-now").evaluate(element => {
      const lines = (target: Element) => {
        const tops = new Set<number>();
        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          if (!walker.currentNode.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(walker.currentNode);
          for (const rect of range.getClientRects()) {
            if (rect.width > 0 && rect.height > 0) tops.add(Math.round(rect.top * 2) / 2);
          }
        }
        return tops.size;
      };
      const heading = element.querySelector("h2")!;
      const support = element.querySelector(".why-support")!;
      return {
        headingLines: lines(heading), supportLines: lines(support),
        headingSize: Number.parseFloat(getComputedStyle(heading).fontSize),
        supportSize: Number.parseFloat(getComputedStyle(support).fontSize),
      };
    });
    expect(why.headingLines).toBe(3);
    expect(why.supportLines).toBe(width === 1440 ? 2 : 3);
    if (width === 393) expect([why.headingSize, why.supportSize]).toEqual([32, 26]);
    if (width === 360) {
      expect(why.headingSize).toBeGreaterThanOrEqual(26);
      expect(why.headingSize).toBeLessThanOrEqual(32);
      expect(why.supportSize).toBeGreaterThanOrEqual(20.5);
      expect(why.supportSize).toBeLessThanOrEqual(26);
    }

    const clean = page.locator(".card-intro__clean");
    await expect(clean.locator(".ambient-card, .card-intro__art, .card-intro__particle")).toHaveCount(0);
    await expect(clean.locator(".card-intro__therefore")).toHaveText("그래서");
    await expect(clean.locator(".card-intro__suffix")).toHaveText("은");
    expect(await clean.locator("[data-brand-asset]").evaluate(image => (image as HTMLImageElement).currentSrc)).toContain(`/assets/card-intro/praytime-wordmark-${width === 1440 ? "desktop" : "mobile"}.png`);
    await clean.evaluate(element => element.scrollIntoView({ block: "start", behavior: "instant" }));
    const intro = await clean.evaluate(element => {
      const box = element.getBoundingClientRect();
      const copy = element.querySelector(".card-intro__intro-copy")!.getBoundingClientRect();
      const cards = document.querySelector(".card-intro__cards")!.getBoundingClientRect();
      return { height: box.height, viewport: innerHeight, nextSceneTop: cards.top, centerDifference: copy.top + copy.height / 2 - box.top - box.height / 2 };
    });
    expect(intro.height).toBeGreaterThanOrEqual(intro.viewport);
    expect(intro.nextSceneTop).toBeGreaterThanOrEqual(intro.viewport - 1);
    expect(Math.abs(intro.centerDifference)).toBeLessThanOrEqual(1);

    // Inspect the entire document at every story boundary, including the form.
    for (const selector of regions.slice(1)) {
      await page.locator(selector).evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `horizontal overflow at ${selector}`).toBe(0);
    }
  });
}

test("normal-motion navigation and two reloads keep the complete page healthy without signup POSTs", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (let visit = 0; visit < 3; visit += 1) {
    if (visit === 0) await page.goto("/");
    else await page.reload();
    await page.evaluate(() => document.fonts.ready);
    const wheel = page.getByRole("radiogroup", { name: "사용 시간 미리보기" });
    await expect(wheel).toHaveAttribute("data-selected", "10");
    await page.locator(".hero-actions").getByRole("link", { name: "작동 방식 보기", exact: true }).click();
    await expect(page).toHaveURL(/#the-gap$/);
    await page.getByRole("link", { name: "5 · 10 · 15분 선택", exact: true }).click();
    await expect(page).toHaveURL(/#how-it-works$/);
    await wheel.getByRole("radio", { name: "15분", exact: true }).click();
    await expect(wheel).toHaveAttribute("data-selected", "15");
    await page.locator("#faq").evaluate(element => element.scrollIntoView({ block: "start", behavior: "instant" }));
    await expect(page.locator("#faq-question-0")).toHaveAttribute("aria-expanded", "true");
    await page.locator("#faq-question-2").click();
    await expect(page.locator("#faq-answer-2")).toBeVisible();
    await expect(page.locator(".landing-header").getByRole("link", { name: "무료로 신청하기", exact: true })).toHaveCount(0);
    await page.locator(".hero-actions").getByRole("link", { name: "무료로 신청하기", exact: true }).click();
    await expect(page).toHaveURL(/#beta-signup$/);
    await expect(page.getByRole("button", { name: "무료로 신청하기", exact: true })).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.evaluate(() => {
      history.replaceState(null, "", "/");
      scrollTo({ top: 0, behavior: "instant" });
    });
  }
});
