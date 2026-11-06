import { expect, test } from "@playwright/test";
import path from "node:path";

declare global { interface Window { qaConversions: number } }

const qa = path.resolve(process.cwd(), "test-results/screenshots");
const widths = [1440, 1280, 1024, 768, 430, 393, 375, 320];

test.beforeEach(async ({ page }) => {
  // Automated tests must never contact an external persistence endpoint.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:3000(?:\/|$)).*/, route => route.abort());
});

test("semantic structure, head metadata, assets and anchors have no runtime warnings", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", error => problems.push(error.message));
  page.on("console", message => { if (["warning", "error"].includes(message.type())) problems.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`); });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator("head meta[property='og:type']")).toHaveAttribute("content", "website");
  await expect(page.locator("head meta[property='og:locale']")).toHaveAttribute("content", "ko_KR");
  await expect(page.locator("head meta[property='og:image']")).toHaveAttribute("content", /\/og\/praytime-share-8b6783f5\.png$/);
  await expect(page.locator("head meta[property='og:image:width']")).toHaveAttribute("content", "1711");
  await expect(page.locator("head meta[property='og:image:height']")).toHaveAttribute("content", "919");
  await expect(page.locator("head meta[property='og:image:type']")).toHaveAttribute("content", "image/png");
  await expect(page.locator("head meta[name='twitter:image']")).toHaveAttribute("content", /\/og\/praytime-share-8b6783f5\.png$/);
  const shareImage = await page.request.get("/og/praytime-share-8b6783f5.png");
  expect(shareImage.status()).toBe(200);
  expect(shareImage.headers()["content-type"]).toContain("image/png");
  await expect(page.locator("head meta[name='twitter:card']")).toHaveAttribute("content", "summary_large_image");
  await expect(page).toHaveTitle(/PrayTime/);
  const issues = await page.evaluate(() => {
    const errors: string[] = [];
    let previous = 0;
    for (const heading of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const level = Number(heading.tagName.slice(1));
      if (level > previous + 1) errors.push(`heading skip: ${heading.textContent}`);
      previous = level;
    }
    const ids = [...document.querySelectorAll("[id]")].map(el => el.id);
    if (new Set(ids).size !== ids.length) errors.push("duplicate IDs");
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href^='#']")) {
      if (!document.getElementById(anchor.hash.slice(1))) errors.push(`broken anchor: ${anchor.hash}`);
    }
    for (const control of document.querySelectorAll<HTMLInputElement>("input:not([name=company]),select")) {
      if (!control.labels?.length) errors.push(`unlabelled control: ${control.name}`);
    }
    for (const element of document.querySelectorAll("[aria-labelledby],[aria-describedby],[aria-controls]")) {
      for (const attr of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
        for (const id of (element.getAttribute(attr) || "").split(/\s+/).filter(Boolean)) {
          if (!document.getElementById(id)) errors.push(`missing ${attr}: ${id}`);
        }
      }
    }
    for (const image of document.images) if (!image.hasAttribute("alt")) errors.push(`missing alt: ${image.src}`);
    return errors;
  });
  expect(issues).toEqual([]);
  expect(problems).toEqual([]);
});

test("skip link and reduced-motion navigation support the keyboard", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문으로 건너뛰기" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#how-heading")).toBeFocused();
  expect(await page.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior)).toBe("auto");
  await expect(page.locator(".form-result-region")).toHaveAttribute("aria-live", "polite");
  const transition = page.locator("[data-signature-transition]");
  await transition.scrollIntoViewIfNeeded();
  await expect(transition).toHaveAttribute("data-motion-state", "reduced");
  expect(await transition.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(transition.locator(".signature-transition__bridge-first")).toBeVisible();
  await expect(transition.locator(".signature-transition__bridge-first")).toHaveCSS("opacity", "1");
  await expect(transition.locator(".signature-transition__bridge-second")).toHaveCSS("opacity", "1");
  await expect(transition.locator(".sr-only")).toHaveText("그래서, 행동하기 전에 잠깐의 틈을 만듭니다.");
  await expect(transition.locator(".signature-transition__scene")).toHaveAttribute("aria-hidden", "true");
});

for (const width of widths) {
  test(`responsive layout and assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1600 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main > section")).toHaveCount(8);
    await expect(page.locator("[data-form-group]")).toHaveCount(8);
    for (const selector of [".one-question", ".why-now", ".time-section", "#faq", ".beta-section", ".site-footer"]) {
      await expect(page.locator(selector)).toHaveCSS("background-color", "rgb(245, 242, 247)");
    }
    await expect(page.locator("#the-gap")).toHaveCSS("background-color", "rgb(11, 16, 32)");
    await expect(page.locator(".prayer-section")).toHaveCSS("background-color", "rgb(23, 28, 38)");
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-variant", width < 768 ? "mobile" : "desktop");
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-duration", "6000");
    const slit = await page.locator(".gap-slit").boundingBox();
    expect(slit!.width).toBe(width < 768 ? 6 : 9);
    expect(slit!.height).toBe(width < 768 ? 230 : 340);
    await expect(page.locator("#the-gap")).toHaveCSS("background-image", "none");
    await expect(page.locator("#the-gap")).toHaveCSS("box-shadow", "none");
    await expect(page.locator(".gap-slit")).toHaveCSS("box-shadow", "none");
    await expect(page.locator("#the-gap img")).toHaveCount(2);
    await expect(page.locator("#the-gap img").nth(0)).toHaveAttribute("src", "/assets/choice-left-arrow.svg");
    await expect(page.locator("#the-gap img").nth(1)).toHaveAttribute("src", "/assets/choice-right-arrow.svg");
    const choices = await page.locator(".equal-outcomes > div").evaluateAll(elements => elements.map(el => {
      const box = el.getBoundingClientRect();
      const text = getComputedStyle(el.querySelector("h3")!);
      const surface = getComputedStyle(el);
      return { width: box.width, height: box.height, x: box.x, y: box.y, fontSize: text.fontSize, fontWeight: text.fontWeight, color: text.color, background: surface.background, padding: surface.padding };
    }));
    expect(choices).toHaveLength(2);
    expect(choices[0].width).toBeCloseTo(choices[1].width, 2);
    expect(choices[0].height).toBeCloseTo(choices[1].height, 2);
    for (const property of ["fontSize", "fontWeight", "color", "background", "padding"] as const) expect(choices[0][property]).toBe(choices[1][property]);
    if (width < 768) {
      expect(choices[0].x).toBeCloseTo(choices[1].x, 2);
      expect(choices[1].y).toBeGreaterThan(choices[0].y + choices[0].height);
    } else {
      expect(choices[0].y).toBeCloseTo(choices[1].y, 2);
      expect(choices[1].x).toBeGreaterThan(choices[0].x + choices[0].width);
    }
    const geometry = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      missingImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
      horizontalElements: [...document.querySelectorAll("main > section, .container, .beta-form, .product-steps")].filter(el => el.getBoundingClientRect().right > window.innerWidth + 1).map(el => el.className),
    }));
    expect(geometry.document).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.missingImages).toEqual([]);
    expect(geometry.horizontalElements).toEqual([]);
    if (width === 1440 || width === 393) {
      const preview = await page.locator(".time-mockup").boundingBox();
      expect(preview!.width).toBe(width === 1440 ? 330 : 320);
      expect(preview!.height / preview!.width).toBeCloseTo(715.42 / 330, 2);
      const artwork = await page.locator(".hero-artwork").boundingBox();
      expect(artwork!.width).toBe(width === 1440 ? 1440 : 640);
      expect(artwork!.height).toBeCloseTo(width === 1440 ? 684 : 280.316, 1);
    }
    if (process.env.CAPTURE_QA_SCREENSHOTS === "1" && (width === 1440 || width === 393)) {
      const hero = await page.locator("#hero").boundingBox();
      await page.screenshot({ path: path.join(qa, `hero-${width}.png`), clip: { x: 0, y: 0, width, height: hero!.height } });
      await page.screenshot({ path: path.join(qa, `full-${width}.png`), fullPage: true });
    }
  });
}

test("FAQ defaults readable, toggles independently, and supports keyboard", async ({ page }) => {
  await page.goto("/");
  const questions = page.locator(".faq-item button");
  await expect(questions).toHaveCount(7);
  await expect(questions).toHaveText([
    "PrayTime은 그냥 기도 앱인가요?",
    "PrayTime은 어떻게 작동하나요?",
    "SNS를 아예 못 쓰게 하는 앱인가요?",
    "기도를 오래 해야 하나요?",
    "기도를 끝내면 바로 SNS가 열리나요?",
    "제 기도 내용을 저장하나요?",
    "사전 신청은 무료인가요?",
  ]);
  await expect(page.locator("#faq")).toHaveCSS("background-color", "rgb(245, 242, 247)");
  await expect(page.locator("#faq-heading")).toHaveCSS("color", "rgb(24, 24, 27)");
  await expect(questions.first().locator("img")).toHaveAttribute("src", "/assets/faq-chevron.svg");
  await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
  for (const button of (await questions.all()).slice(1)) await expect(button).toHaveAttribute("aria-expanded", "false");
  await questions.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-1")).toBeVisible();
  await expect(page.locator("#faq-answer-1")).toContainText("5분 · 10분 · 15분");
  await expect(page.locator("#faq-answer-0")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.locator("#faq-answer-1")).toBeHidden();
  await questions.nth(4).click();
  await expect(page.locator("#faq-answer-4")).toContainText("SNS가 자동으로 열리지는 않습니다");
  await questions.nth(5).click();
  await expect(page.locator("#faq-answer-5")).toContainText("기도 원문을 기본적으로 수집하지 않는 방향");
  await questions.nth(6).click();
  await expect(page.locator("#faq-answer-6")).toContainText("사전 신청에는 결제가 발생하지 않습니다");
  await expect(page.locator(".beta-context")).toContainText("베타 참여 확정을 의미하지 않습니다");
  await questions.nth(6).press("Home");
  await expect(questions.first()).toBeFocused();
  await questions.first().press("End");
  await expect(questions.nth(6)).toBeFocused();
  await questions.nth(6).press("ArrowUp");
  await expect(questions.nth(5)).toBeFocused();
  await questions.nth(5).press("Space");
  await expect(page.locator("#faq-answer-5")).toBeHidden();
  await expect(page.locator("#faq-answer-0")).toBeVisible();
  await questions.nth(5).press("ArrowDown");
  await expect(questions.nth(6)).toBeFocused();
  await expect(questions.nth(6)).toHaveCSS("outline-style", "solid");
  await expect(questions.nth(6)).toHaveCSS("outline-width", "3px");
});

test("final Hero overlay, statistic count accents and anchors match the approved behavior", async ({ page }) => {
  const runtimeProblems: string[] = [];
  page.on("pageerror", error => runtimeProblems.push(error.message));
  page.on("console", message => { if (["warning", "error"].includes(message.type())) runtimeProblems.push(message.text()); });
  await page.goto("/");
  expect(await page.locator(".landing-header").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  await page.locator("#why-stats").scrollIntoViewIfNeeded();
  await expect(page.locator("#why-stats")).toHaveAttribute("data-count-state", "complete");
  for (const index of [0, 1]) {
    const track = await page.locator(".stat-track").nth(index).boundingBox();
    const fill = await page.locator(".stat-fill").nth(index).boundingBox();
    expect(fill!.width).toBeCloseTo(track!.width, 1);
    await expect(page.locator(".stat-track").nth(index)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    expect(await page.locator(".stat-value").nth(index).evaluate(el => getComputedStyle(el).color)).toBe("rgb(24, 24, 27)");
  }
  await page.getByRole("link", { name: "작동 방식 보기", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#the-gap$/);
  await expect(page.locator("#gap-heading")).toBeFocused();
  await page.getByRole("link", { name: "기도와 선택", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#prayer-heading")).toBeFocused();
  await page.getByRole("link", { name: "베타 사전신청", exact: true }).first().click();
  await expect(page).toHaveURL(/#beta-signup$/);
  const betaLinks = page.getByRole("link", { name: "베타 사전신청", exact: true });
  await expect(betaLinks).toHaveCount(2);
  for (const link of await betaLinks.all()) {
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#beta-signup$/);
    await expect(page.locator("#signup-heading")).toBeFocused();
  }
  // Exercise the actual viewport-specific timeline, including normal scrolling
  // away from it. Opacity polling observes rendering rather than a fixed sleep.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 393]) {
    await page.setViewportSize({ width, height: 900 });
    const transition = page.locator("[data-signature-transition]");
    await transition.scrollIntoViewIfNeeded();
    await expect(transition).toHaveAttribute("data-motion-state", "running");
    await expect(transition).toHaveAttribute("data-motion-duration", "6000");
    expect(await transition.evaluate(el => el.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length)).toBe(12);
    // A full-opacity reading window prevents the text becoming a brief flash.
    const readingHolds = await transition.evaluate(el => ["word", "bridgeFirst", "bridgeSecond"].map(track => {
      const effect = el.querySelector(`[data-motion-track="${track}"]`)!.getAnimations()[0].effect as KeyframeEffect;
      const frames = effect.getKeyframes().filter(frame => Number(frame.opacity) === 1);
      return (frames[1].computedOffset - frames[0].computedOffset) * Number(effect.getTiming().duration);
    }));
    expect(readingHolds[0]).toBeGreaterThanOrEqual(1000);
    expect(readingHolds[1]).toBeGreaterThanOrEqual(1500);
    expect(readingHolds[2]).toBeGreaterThanOrEqual(1500);
    const slit = transition.locator('[data-motion-track="slit"]');
    await expect.poll(async () => Number(await slit.evaluate(el => getComputedStyle(el).opacity)), { timeout: 8_000, intervals: [50] }).toBeGreaterThan(0.5);
    await expect.poll(async () => Number(await slit.evaluate(el => getComputedStyle(el).opacity)), { timeout: 8_000, intervals: [50] }).toBeLessThan(0.1);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 1400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 500);
    await page.locator("#faq").scrollIntoViewIfNeeded();
    await expect(transition).toHaveAttribute("data-motion-state", "paused");
    expect(await transition.evaluate(el => el.getAnimations({ subtree: true }).every(animation => animation.playState === "paused"))).toBe(true);
  }
  expect(runtimeProblems).toEqual([]);
});

test("validation focuses first error; real unconfigured route returns 503 and retains input", async ({ page }) => {
  await page.goto("/?utm_source=qa&utm_campaign=mission5");
  const submit = page.getByRole("button", { name: "베타 사전신청", exact: true });
  await expect(submit).toBeDisabled();
  await page.locator("#consent").check();
  await submit.click();
  await expect(page.locator("#nickname")).toBeFocused();
  await expect(page.locator("#nickname-error")).toBeVisible();
  await page.locator("#nickname").fill("테스트");
  await page.locator("#email").fill("TEST@example.com");
  await page.getByLabel("iPhone", { exact: true }).check();
  await page.getByLabel("SNS·숏폼 사용을 줄이고 싶어서", { exact: true }).check();
  const responsePromise = page.waitForResponse(response => response.url().endsWith("/api/beta-signup"));
  await submit.click();
  const response = await responsePromise;
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({ code: "BACKEND_UNCONFIRMED", status: "error" });
  await expect(page.getByText("신청을 접수하지 못했습니다.", { exact: true })).toBeVisible();
  await expect(page.locator("#email")).toHaveValue("TEST@example.com");
  await expect(submit).toBeEnabled();
});

// These UI outcome tests intercept HTTP; they are NOT live persistence evidence.
for (const outcome of ["success", "duplicate", "no-receipt", "server-failure"] as const) {
  test(`mocked transport: ${outcome} has the correct receipt and conversion behavior`, async ({ page }) => {
    await page.addInitScript(() => {
      Object.assign(window, { qaConversions: 0 });
      window.addEventListener("praytime:beta-signup-success", () => { window.qaConversions += 1; });
    });
    let requests = 0;
    let releaseResponse!: () => void;
    const responseGate = new Promise<void>(resolve => { releaseResponse = resolve; });
    await page.route("**/api/beta-signup", async route => {
      requests += 1;
      await responseGate;
      await route.fulfill({ status: outcome === "duplicate" ? 409 : outcome === "server-failure" ? 502 : 201, contentType: "application/json", body: JSON.stringify(outcome === "duplicate" ? { status: "duplicate" } : outcome === "server-failure" ? { status: "error" } : { status: "success", ...(outcome === "success" ? { receipt: true } : {}) }) });
    });
    await page.goto("/");
    await page.locator("#nickname").fill("UI 테스트");
    await page.locator("#email").fill("ui@example.com");
    await page.getByLabel("iPhone", { exact: true }).check();
    await page.getByLabel("SNS·숏폼 사용을 줄이고 싶어서", { exact: true }).check();
    await page.locator("#consent").check();
    await page.getByRole("button", { name: "베타 사전신청", exact: true }).click();
    try {
      const submitting = page.getByRole("button", { name: "접수 중…" });
      await expect(submitting).toBeDisabled();
      await expect(submitting).toHaveAttribute("data-state", "submitting");
      await expect(submitting).toHaveAttribute("aria-busy", "true");
    } finally {
      releaseResponse();
    }
    await expect(page.locator(".form-result")).toContainText(outcome === "success" ? "사전신청이 접수되었습니다." : outcome === "duplicate" ? "이미 신청된 이메일입니다." : "신청을 접수하지 못했습니다.");
    expect(requests).toBe(1);
    expect(await page.evaluate(() => window.qaConversions)).toBe(outcome === "success" ? 1 : 0);
  });
}


test("Time Select supports tap, keyboard and horizontal swipe with 10 minutes initially selected", async ({ page }) => {
  await page.goto("/");
  const wheel = page.getByRole("radiogroup", { name: "사용 시간 미리보기" });
  await expect(wheel.getByRole("radio", { name: "10분", exact: true })).toHaveAttribute("aria-checked", "true");
  await wheel.getByRole("radio", { name: "15분", exact: true }).click();
  await expect(wheel).toHaveAttribute("data-selected", "15");
  await page.keyboard.press("Home");
  await expect(wheel.getByRole("radio", { name: "5분", exact: true })).toBeFocused();
  await expect(wheel).toHaveAttribute("data-selected", "5");
  const box = (await wheel.boundingBox())!;
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .2, box.y + box.height * .5, { steps: 8 });
  await page.mouse.up();
  await expect(wheel).toHaveAttribute("data-selected", "10");
  await expect(wheel.getByRole("radio", { name: "10분", exact: true })).toHaveAttribute("aria-checked", "true");
});
