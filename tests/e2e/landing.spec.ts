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
});

for (const width of widths) {
  test(`responsive layout and assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1600 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main > section")).toHaveCount(8);
    await expect(page.locator("[data-form-group]")).toHaveCount(8);
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
    if (width === 1440 || width === 393) {
      const hero = await page.locator("#hero").boundingBox();
      await page.screenshot({ path: path.join(qa, `hero-${width}.png`), clip: { x: 0, y: 0, width, height: hero!.height } });
      await page.screenshot({ path: path.join(qa, `full-${width}.png`), fullPage: true });
    }
  });
}

test("FAQ defaults readable, toggles independently, and supports keyboard", async ({ page }) => {
  await page.goto("/");
  const questions = page.locator(".faq-item button");
  await expect(questions).toHaveCount(5);
  await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
  for (const button of (await questions.all()).slice(1)) await expect(button).toHaveAttribute("aria-expanded", "false");
  await questions.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-1")).toBeVisible();
  await expect(page.locator("#faq-answer-0")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.locator("#faq-answer-1")).toBeHidden();
});

test("final Hero overlay, percentage gauges and anchors match the approved behavior", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator(".landing-header").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  for (const [index, percent] of [34.3, 25.3].entries()) {
    const track = await page.locator(".stat-track").nth(index).boundingBox();
    const fill = await page.locator(".stat-fill").nth(index).boundingBox();
    expect(fill!.width / track!.width * 100).toBeCloseTo(percent, 1);
    expect(await page.locator(".stat-value").nth(index).evaluate(el => getComputedStyle(el).color)).toBe("rgb(24, 24, 27)");
  }
  await page.getByRole("link", { name: "작동 방식 보기", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.locator("#how-heading")).toBeFocused();
  await page.getByRole("link", { name: "기도와 선택", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#prayer-heading")).toBeFocused();
  await page.getByRole("link", { name: "베타 사전신청", exact: true }).first().click();
  await expect(page).toHaveURL(/#beta-signup$/);
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
    await page.route("**/api/beta-signup", async route => {
      requests += 1;
      await new Promise(resolve => setTimeout(resolve, 400));
      await route.fulfill({ status: outcome === "duplicate" ? 409 : outcome === "server-failure" ? 502 : 201, contentType: "application/json", body: JSON.stringify(outcome === "duplicate" ? { status: "duplicate" } : outcome === "server-failure" ? { status: "error" } : { status: "success", ...(outcome === "success" ? { receipt: true } : {}) }) });
    });
    await page.goto("/");
    await page.locator("#nickname").fill("UI 테스트");
    await page.locator("#email").fill("ui@example.com");
    await page.getByLabel("iPhone", { exact: true }).check();
    await page.getByLabel("SNS·숏폼 사용을 줄이고 싶어서", { exact: true }).check();
    await page.locator("#consent").check();
    await page.getByRole("button", { name: "베타 사전신청", exact: true }).click();
    await expect(page.getByRole("button", { name: "접수 중…" })).toBeDisabled();
    await expect(page.locator(".form-result")).toContainText(outcome === "success" ? "사전신청이 접수되었습니다." : outcome === "duplicate" ? "이미 신청된 이메일입니다." : "신청을 접수하지 못했습니다.");
    expect(requests).toBe(1);
    expect(await page.evaluate(() => window.qaConversions)).toBe(outcome === "success" ? 1 : 0);
  });
}
