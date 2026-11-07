import { expect, test } from "@playwright/test";

const problems = new WeakMap<object, string[]>();
test.beforeEach(async ({ page, baseURL }) => {
  const errors: string[] = [];
  problems.set(page, errors);
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const origin = new URL(baseURL!).origin;
  await page.route("**/*", route => {
    if (!["GET", "HEAD"].includes(route.request().method())) { errors.push("Unexpected write request"); return route.abort(); }
    return new URL(route.request().url()).origin === origin ? route.continue() : route.abort();
  });
});
test.afterEach(async ({ page }) => { expect(problems.get(page)).toEqual([]); });

test("FAQ opens and closes through intermediate heights with immediate accessible state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const answer = page.locator("#faq-answer-1");
  await page.locator("#faq-question-1").scrollIntoViewIfNeeded();
  await expect(answer).toHaveAttribute("hidden", "");
  const opening = await answer.evaluate(async element => {
    const samples: { height: number; opacity: number; hidden: boolean; aria: string | null; state: string | undefined }[] = [];
    const read = () => ({ height: element.getBoundingClientRect().height, opacity: Number(getComputedStyle(element).opacity), hidden: (element as HTMLElement).hidden, aria: element.getAttribute("aria-hidden"), state: (element as HTMLElement).dataset.faqMotion });
    const start = performance.now();
    document.getElementById("faq-question-1")!.click();
    await new Promise<void>(resolve => {
      const tick = () => { samples.push(read()); if (performance.now() - start > 450) resolve(); else requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    return samples;
  });
  const finalHeight = opening.at(-1)!.height;
  expect(finalHeight).toBeGreaterThan(100);
  expect(opening.some(sample => sample.height > 5 && sample.height < finalHeight - 5 && sample.opacity > .05 && sample.opacity < .95)).toBe(true);
  expect(opening.at(-1)).toMatchObject({ hidden: false, opacity: 1, state: "open" });
  await expect(page.locator("#faq-question-1")).toHaveAttribute("aria-expanded", "true");
  const closing = await answer.evaluate(async element => {
    const samples: { height: number; opacity: number; hidden: boolean; aria: string | null; inert: boolean }[] = [];
    const start = performance.now();
    document.getElementById("faq-question-1")!.click();
    await new Promise<void>(resolve => {
      const tick = () => { samples.push({ height: element.getBoundingClientRect().height, opacity: Number(getComputedStyle(element).opacity), hidden: (element as HTMLElement).hidden, aria: element.getAttribute("aria-hidden"), inert: (element as HTMLElement).inert }); if (performance.now() - start > 450) resolve(); else requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    return samples;
  });
  expect(closing.some(sample => sample.height > 5 && sample.height < finalHeight - 5 && !sample.hidden)).toBe(true);
  expect(closing.every(sample => sample.aria === "true" && sample.inert)).toBe(true);
  expect(closing.at(-1)).toMatchObject({ height: 0, hidden: true });
  await expect(page.locator("#faq-question-1")).toHaveAttribute("aria-expanded", "false");
  await expect(answer).toBeHidden();
  await expect(page.locator("#faq-answer-0")).toBeVisible();
});

test("FAQ reverses from its displayed frame and reduced motion finishes an active transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const answer = page.locator("#faq-answer-1");
  await page.locator("#faq-question-1").click();
  await expect(answer).toHaveAttribute("data-faq-motion", "opening");
  const reversal = await answer.evaluate(async element => {
    await new Promise(resolve => setTimeout(resolve, 95));
    const before = element.getBoundingClientRect().height;
    document.getElementById("faq-question-1")!.click();
    await new Promise(requestAnimationFrame);
    return { before, after: element.getBoundingClientRect().height, state: (element as HTMLElement).dataset.faqMotion };
  });
  expect(reversal.before).toBeGreaterThan(10);
  expect(reversal.state).toBe("closing");
  expect(Math.abs(reversal.after - reversal.before)).toBeLessThan(Math.max(24, reversal.before * .25));
  await page.locator("#faq-question-1").click();
  await expect(answer).toHaveAttribute("data-faq-motion", "opening");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(answer).toHaveAttribute("data-faq-motion", "open");
  await expect(answer).toBeVisible();
  expect(await answer.evaluate(element => element.getAnimations().length)).toBe(0);
  await page.locator("#faq-question-1").press("Space");
  await expect(answer).toHaveAttribute("data-faq-motion", "closed");
  await expect(answer).toHaveAttribute("hidden", "");
});

test("time wheel keeps stable numbers and animates positions including the return to10", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const wheel = page.getByRole("radiogroup", { name: "사용 시간 미리보기" });
  await wheel.scrollIntoViewIfNeeded();
  await expect(wheel.locator(".wheel-native")).toHaveCSS("opacity", "0");
  const trace = await wheel.evaluate(async element => {
    const number = element.querySelector<HTMLElement>('[data-wheel-value="15"]')!;
    const initialLeft = Number.parseFloat(getComputedStyle(number).left);
    const nodes = [...element.querySelectorAll(".wheel-number")];
    const samples: { left: number; opacity: number; active: string | undefined }[] = [];
    const start = performance.now();
    element.querySelector<HTMLButtonElement>('[aria-label="15분"]')!.click();
    await new Promise<void>(resolve => {
      const tick = () => { samples.push({ left: Number.parseFloat(getComputedStyle(number).left), opacity: Number(getComputedStyle(element.querySelector(".wheel-native")!).opacity), active: (element.querySelector(".wheel-native") as HTMLElement).dataset.wheelActive }); if (performance.now() - start > 500) resolve(); else requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    return { initialLeft, samples, stable: nodes.every((node, index) => node === element.querySelectorAll(".wheel-number")[index]) };
  });
  expect(trace.stable).toBe(true);
  const endLeft = trace.samples.at(-1)!.left;
  expect(trace.initialLeft - endLeft).toBeGreaterThan(30);
  expect(trace.samples.some(sample => sample.left < trace.initialLeft - 3 && sample.left > endLeft + 3)).toBe(true);
  expect(trace.samples.some(sample => sample.opacity > .05 && sample.opacity < .95)).toBe(true);
  await expect(wheel).toHaveAttribute("data-selected", "15");
  const returning = await wheel.evaluate(async element => {
    const number = element.querySelector<HTMLElement>('[data-wheel-value="5"]')!;
    const before = Number(getComputedStyle(number).opacity);
    const samples: number[] = [];
    const start = performance.now();
    element.querySelector<HTMLButtonElement>('[aria-label="10분"]')!.click();
    await new Promise<void>(resolve => {
      const tick = () => { samples.push(Number(getComputedStyle(number).opacity)); if (performance.now() - start > 500) resolve(); else requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    return { before, samples };
  });
  expect(returning.before).toBeCloseTo(.45, 2);
  expect(returning.samples.some(opacity => opacity < .05)).toBe(true);
  expect(returning.samples.some(opacity => opacity > .05 && opacity < .44)).toBe(true);
  expect(returning.samples.at(-1)).toBeCloseTo(.45, 2);
  await expect(wheel).toHaveAttribute("data-selected", "10");
  await expect(wheel.locator(".wheel-native")).toHaveAttribute("data-wheel-active", "true");
  await expect(wheel.locator(".wheel-native")).toHaveCSS("opacity", "1");
  await expect(wheel.locator('[data-wheel-value="10"]')).toHaveClass(/wheel-number--1/);
  await expect(wheel.getByRole("radio", { name: "10분", exact: true })).toHaveAttribute("aria-checked", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test("reduced motion keeps FAQ and time selection immediate, with keyboard focus visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const wheel = page.getByRole("radiogroup", { name: "사용 시간 미리보기" });
  await wheel.getByRole("radio", { name: "15분", exact: true }).click();
  await expect(wheel).toHaveAttribute("data-selected", "15");
  expect(await wheel.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.locator("#faq-question-1").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq-answer-1")).toHaveAttribute("data-faq-motion", "open");
  expect(await page.locator("#faq-answer-1").evaluate(element => element.getAnimations().length)).toBe(0);
  await expect(page.locator("#faq-question-1")).toBeFocused();
  await expect(page.locator("#faq-question-1")).toHaveCSS("outline-style", "solid");
});
