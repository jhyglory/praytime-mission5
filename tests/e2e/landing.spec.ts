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
  await expect(page.locator("head link[rel='icon'][type='image/svg+xml']")).toHaveAttribute("href", "/assets/praytime-favicon.svg?v=red-pause");
  await expect(page.locator("head link[rel='icon'][type='image/x-icon']")).toHaveAttribute("href", "/favicon.ico?v=red-pause");
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
  await expect(transition.locator(".card-intro__therefore")).toBeVisible();
  await expect(transition.locator(".card-intro__brand")).toBeVisible();
  await expect(transition.locator(".card-intro__headline")).toBeVisible();
  await expect(transition.locator(".card-intro__anchor")).toBeVisible();
  await expect(transition.locator(".card-intro__art")).toBeVisible();
  await expect(transition.locator(".card-intro__column")).toHaveCount(6);
  await expect(transition.locator(".card-intro__clean")).toHaveAttribute("data-intro-state", "reduced");
  await expect(transition.locator(".sr-only")).toHaveText("그래서, PRAYTIME은 손이 먼저 움직인 순간, 다시 생각할 시간을 돌려드립니다. 잠깐 기도하고, 필요한 만큼만 선택합니다.");
  await expect(transition.locator(".card-intro__scene")).toHaveAttribute("aria-hidden", "true");
});

for (const width of widths) {
  test(`responsive layout and assets at ${width}px`, async ({ page }) => {
    // Allow a cold local Next image optimizer to process all original photos.
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 1600 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main > section")).toHaveCount(8);
    await expect(page.locator("[data-form-group]")).toHaveCount(8);
    await expect(page.getByText("04 / THE GAP", { exact: true })).toHaveCount(0);
    await expect(page.locator(".landing-header > .pt-button")).toHaveCount(0);
    await expect(page.locator(".landing-header").getByRole("link", { name: "무료로 신청하기", exact: true })).toHaveCount(0);
    await expect(page.locator(".hero-actions").getByRole("link", { name: "무료로 신청하기", exact: true })).toHaveCount(1);
    for (const selector of [".why-now", ".time-section", "#faq", ".beta-section", ".site-footer"]) {
      await expect(page.locator(selector)).toHaveCSS("background-color", "rgb(245, 242, 247)");
    }
    await expect(page.locator(".one-question")).toHaveCSS("background-color", "rgb(23, 28, 38)");
    await expect(page.locator("#question-heading")).toHaveCSS("color", "rgb(241, 241, 238)");
    await expect(page.locator("#the-gap")).toHaveCSS("background-color", "rgb(8, 14, 38)");
    await expect(page.locator(".prayer-section")).toHaveCSS("background-color", "rgb(23, 28, 38)");
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-variant", width < 768 ? "mobile" : "desktop");
    await expect(page.locator("[data-signature-transition]")).toHaveAttribute("data-motion-duration", String(15000 / .7));
    const introGeometry = await page.locator("[data-signature-transition]").evaluate(el => {
      const clean = el.querySelector(".card-intro__clean")!.getBoundingClientRect();
      const cards = el.querySelector(".card-intro__cards")!.getBoundingClientRect();
      return { cleanHeight:clean.height, cardsHeight:cards.height, cleanBottom:clean.bottom, cardsTop:cards.top, cleanCards:el.querySelectorAll(".card-intro__clean .ambient-card").length };
    });
    expect(introGeometry.cleanHeight).toBe(1600);
    expect(introGeometry.cardsHeight).toBe(width < 768 ? 680 : 760);
    expect(introGeometry.cardsTop).toBeCloseTo(introGeometry.cleanBottom, 1);
    expect(introGeometry.cleanCards).toBe(0);
    const gapArtwork = page.locator(".gap-architecture");
    await gapArtwork.scrollIntoViewIfNeeded();
    await expect(gapArtwork).toHaveAttribute("aria-hidden", "true");
    await expect(gapArtwork.locator("img")).toHaveCount(0);
    const gapMotion = gapArtwork.locator("svg[data-gap-light-motion]");
    await expect(gapMotion).toHaveCount(1);
    await expect(gapMotion).toHaveAttribute("data-motion-variant", "preview");
    await expect(gapMotion).toHaveAttribute("data-duration", "7000");
    await expect(gapMotion).toHaveAttribute("data-start-delay", "1200");
    const lightPlacement = await gapMotion.evaluate(el => {
      const svg = el as SVGSVGElement;
      const canvas = svg.getBoundingClientRect();
      const section = el.closest("section")!.getBoundingClientRect();
      const face = svg.querySelector<SVGRectElement>('[data-gap-part="face-rect"]')!;
      const scale = canvas.width / svg.viewBox.baseVal.width;
      return {
        center: canvas.left + canvas.width / 2,
        top: canvas.top - section.top + face.y.baseVal.value * scale,
        bottom: canvas.top - section.top + (face.y.baseVal.value + face.height.baseVal.value) * scale,
        ratio: canvas.width / canvas.height,
        viewWidth: svg.viewBox.baseVal.width,
        viewHeight: svg.viewBox.baseVal.height,
        faceFill: face.getAttribute("fill"),
        faceStroke: face.getAttribute("stroke"),
        faceFilter: face.getAttribute("filter"),
        faceRadius: face.getAttribute("rx"),
      };
    });
    expect(lightPlacement.center).toBeCloseTo(width / 2, 1);
    expect(lightPlacement.top).toBeCloseTo(width < 768 ? 461 : 528, 1);
    expect(lightPlacement.bottom).toBeCloseTo(width < 768 ? 691 : 868, 1);
    expect(lightPlacement.viewWidth).toBe(1200);
    expect(lightPlacement.viewHeight).toBeCloseTo(1381 * 1200 / 1139, 3);
    expect(lightPlacement.ratio).toBeCloseTo(1139 / 1381, 3);
    expect(lightPlacement.faceFill).toMatch(/^url\(#[^)]+-faceColor\)$/);
    expect(lightPlacement.faceFilter).toMatch(/^url\(#[^)]+-faceSoftness\)$/);
    expect(lightPlacement.faceStroke).toBeNull();
    expect(lightPlacement.faceRadius).toBeNull();
    await expect(page.locator(".gap-choice--return .gap-choice__action > img")).toHaveAttribute("src", "/assets/choice-left-arrow.svg");
    await expect(page.locator(".gap-choice--time .gap-choice__action > img")).toHaveAttribute("src", "/assets/choice-right-arrow.svg");
    await expect(page.locator(".equal-outcomes .prayer-light-divider")).toHaveCount(2);
    const choices = await page.locator(".equal-outcomes > div").evaluateAll(elements => elements.map(el => {
      const box = el.getBoundingClientRect();
      const text = getComputedStyle(el.querySelector("h3")!);
      const surface = getComputedStyle(el);
      return { width: box.width, height: box.height, x: box.x, y: box.y, fontSize: text.fontSize, fontWeight: text.fontWeight, color: text.color, background: surface.background, padding: surface.padding };
    }));
    expect(choices).toHaveLength(2);
    const alignment = await page.locator(".equal-outcomes > div").evaluateAll(panels => panels.map(panel => {
      const center = (element:Element) => { const r=element.getBoundingClientRect(); return r.left+r.width/2; };
      const row=panel.querySelector(".gap-choice__action")!;
      const text=row.querySelector("h3")!.getBoundingClientRect();
      const arrow=row.querySelector("img")!.getBoundingClientRect();
      return { panel:center(panel), light:center(panel.querySelector(".prayer-light-divider__highlight")!), label:center(panel.querySelector(".gap-choice > p")!), row:center(row), arrowPosition:getComputedStyle(row.querySelector("img")!).position, vertical:text.top+text.height/2-arrow.top-arrow.height/2 };
    }));
    for (const item of alignment) {
      for (const center of [item.light,item.label,item.row]) expect(center).toBeCloseTo(item.panel,1);
      expect(item.arrowPosition).toBe("static");
      expect(Math.abs(item.vertical)).toBeLessThan(1);
    }

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
    // Production keeps the below-fold photo cards lazy. This asset QA alone
    // forces every rendered image to load, including offscreen cards, so a
    // broken original/optimizer response cannot hide behind lazy loading.
    await page.evaluate(() => {
      for (const image of document.images) image.loading = "eager";
    });
    await expect.poll(() => page.evaluate(() => [...document.images]
      .filter(img => !img.complete || !img.naturalWidth)
      .map(img => img.getAttribute("src"))), { timeout:30_000 }).toEqual([]);
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
      expect(artwork!.width).toBeCloseTo(width === 1440 ? 1561.663 : 640, 1);
      expect(artwork!.height).toBeCloseTo(width === 1440 ? 2435.82 : 998.247, 1);
      const hero = await page.locator("#hero").boundingBox();
      expect(hero!.height).toBe(width === 1440 ? 684 : 932);
      const questionArtwork = await page.locator(".question-artwork").boundingBox();
      // Both sections crop the same plane; its page coordinates meet exactly.
      for (const property of ["x", "y", "width", "height"] as const) {
        expect(questionArtwork![property]).toBeCloseTo(artwork![property], 1);
      }
      await expect(page.locator(".hero-artwork img")).toHaveAttribute("src", "/assets/high-resolution/hero-hq-fcbad7e4f361.png");
      await expect(page.locator(".question-artwork img")).toHaveAttribute("src", "/assets/high-resolution/hero-hq-fcbad7e4f361.png");
      await expect(page.locator("#question-heading")).toHaveCSS("font-size", width === 1440 ? "56px" : "32px");
      await expect(page.locator("#question-heading")).toHaveCSS("line-height", width === 1440 ? "80px" : "48px");
      const gap = await page.locator("#the-gap").boundingBox();
      expect(gap!.height).toBe(width === 1440 ? 1180 : 1024);
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
  await expect(questions.first()).toHaveCSS("font-size", "17px");
  await expect(questions.first()).toHaveCSS("line-height", "25.5px");
  await expect(page.locator("#faq-answer-0 .body-copy").first()).toHaveCSS("font-size", "15.3px");
  await expect(page.locator("#faq-answer-0 .body-copy").first()).toHaveCSS("line-height", "25.5px");
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
    expect(fill!.width).toBeCloseTo(track!.width * [0.8,0.7][index], 1);
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
  await page.getByRole("link", { name: "무료로 신청하기", exact: true }).first().click();
  await expect(page).toHaveURL(/#beta-signup$/);
  const betaLinks = page.getByRole("link", { name: "무료로 신청하기", exact: true });
  await expect(betaLinks).toHaveCount(1);
  for (const link of await betaLinks.all()) {
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#beta-signup$/);
    await expect(page.locator("#signup-heading")).toBeFocused();
  }
  // The separate card-free intro is followed by the user-slowed21.43s
  // decorative loop. Its readable copy never waits for an animation phase.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 393]) {
    await page.setViewportSize({ width, height: 600 });
    const transition = page.locator("[data-signature-transition]");
    const clean = transition.locator(".card-intro__clean");
    const cards = transition.locator(".card-intro__cards");
    await expect(transition).toHaveAttribute("data-motion-variant", width < 768 ? "mobile" : "desktop");
    await clean.evaluate(el => el.scrollIntoView({ block:"start", behavior:"instant" }));
    await expect(transition).toHaveAttribute("data-motion-state", "paused");
    expect(await cards.evaluate(el => el.getBoundingClientRect().top >= innerHeight)).toBe(true);
    await expect(clean.locator(".ambient-card")).toHaveCount(0);
    await cards.evaluate(el => el.scrollIntoView({ block:"center", behavior:"instant" }));
    await expect(transition).toHaveAttribute("data-motion-state", "running");
    await expect(transition).toHaveAttribute("data-motion-duration", String(15000 / .7));
    expect(await cards.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(width < 768 ? 43 : 46);
    const renderedMotionNodes = await cards.evaluate(el => new Set(el.getAnimations({ subtree: true }).map(a => ((a.effect as KeyframeEffect).target as HTMLElement).dataset.nodeId)).size);
    expect(renderedMotionNodes).toBe(width < 768 ? 23 : 26);
    await expect(transition.locator(".card-intro__column")).toHaveCount(width < 768 ? 3 : 6);
    for (const column of await transition.locator(".card-intro__column").all()) await expect(column).toHaveCSS("opacity", width < 768 ? "0.52" : "0.64");
    await expect(transition.locator(".ambient-card")).toHaveCount(width < 768 ? 216 : 288);
    await expect(transition.locator(".card-intro__particle")).toHaveCount(20);
    const samples = await transition.evaluate(el => {
      const animations = el.querySelector(".card-intro__cards")!.getAnimations({ subtree: true });
      const art = el.querySelector(".card-intro__art")!;
      const copySelectors = [".card-intro__headline", ".card-intro__anchor"];
      const textAnimationCounts = copySelectors.map(selector => el.querySelector(selector)!.getAnimations({ subtree:true }).length);
      const onlyArtAnimated = animations.every(animation => art.contains((animation.effect as KeyframeEffect).target));
      const duration = Number(el.getAttribute("data-motion-duration"));
      const snapshots = [0, 1000, duration / 2, duration - 1, duration].map(time => {
        for (const animation of animations) { animation.pause(); animation.currentTime = time; }
        return {
          containers:[".card-intro__clean", ".card-intro__cards"].map(selector => Number(getComputedStyle(el.querySelector(selector)!).opacity)),
          copy:copySelectors.map(selector => {
            const target = el.querySelector(selector)!;
            const css = getComputedStyle(target);
            const box = target.getBoundingClientRect();
            return { opacity:Number(css.opacity), visibility:css.visibility, transform:css.transform, top:box.top, height:box.height };
          }),
          columns:[...el.querySelectorAll(".card-intro__column")].map(column => getComputedStyle(column).transform),
        };
      });
      const now = document.timeline.currentTime;
      for (const animation of animations) { animation.currentTime = 0; animation.play(); if (typeof now === "number") animation.startTime = now; }
      return { snapshots, textAnimationCounts, onlyArtAnimated };
    });
    expect(samples.onlyArtAnimated).toBe(true);
    expect(samples.textAnimationCounts).toEqual([0,0]);
    for (const sample of samples.snapshots) {
      expect(sample.containers).toEqual([1,1]);
      expect(sample.copy).toEqual(samples.snapshots[0].copy);
      for (const text of sample.copy) {
        expect(text).toMatchObject({ opacity:1, visibility:"visible", transform:"none" });
        expect(text.height).toBeGreaterThan(0);
      }
    }
    for (const index of samples.snapshots[0].columns.keys()) {
      expect(samples.snapshots[1].columns[index]).not.toBe(samples.snapshots[0].columns[index]);
      expect(samples.snapshots[2].columns[index]).not.toBe(samples.snapshots[0].columns[index]);
    }
    expect(samples.snapshots[4].columns).toEqual(samples.snapshots[0].columns);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 1400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 500);
    await page.locator("#faq").scrollIntoViewIfNeeded();
    await expect(transition).toHaveAttribute("data-motion-state", "paused");
    expect(await transition.evaluate(el => el.getAnimations({ subtree: true }).every(animation => animation.playState === "paused"))).toBe(true);
    const pausedClock = await transition.evaluate(async el => {
      const animations = el.getAnimations({ subtree:true });
      const before = animations.map(animation => animation.currentTime);
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      return { before, after:animations.map(animation => animation.currentTime) };
    });
    expect(pausedClock.after).toEqual(pausedClock.before);
  }
  expect(runtimeProblems).toEqual([]);
});

test("validation focuses first error; real unconfigured route returns 503 and retains input", async ({ page }) => {
  await page.goto("/?utm_source=qa&utm_campaign=mission5");
  const submit = page.getByRole("button", { name: "무료로 신청하기", exact: true });
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
    const dialogs: { type: string; message: string }[] = [];
    page.on("dialog", async dialog => {
      dialogs.push({ type: dialog.type(), message: dialog.message() });
      await dialog.accept();
    });
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
    await page.getByRole("button", { name: "무료로 신청하기", exact: true }).click();
    try {
      const submitting = page.getByRole("button", { name: "접수 중…" });
      await expect(submitting).toBeDisabled();
      await expect(submitting).toHaveAttribute("data-state", "submitting");
      await expect(submitting).toHaveAttribute("aria-busy", "true");
      expect(dialogs).toEqual([]);
    } finally {
      releaseResponse();
    }
    await expect(page.locator(".form-result")).toContainText(outcome === "success" ? "사전신청이 접수되었습니다." : outcome === "duplicate" ? "이미 신청된 이메일입니다." : "신청을 접수하지 못했습니다.");
    expect(requests).toBe(1);
    expect(dialogs).toEqual(outcome === "success" ? [{ type: "alert", message: "사전신청이 접수되었습니다.\n관심을 보내주셔서 감사합니다." }] : []);
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
