import { expect, test } from "@playwright/test";
import sharp from "sharp";

// The normal test server has no Supabase URL/secret. These checks deliberately
// exercise configuration/validation boundaries and mocked transport, never a live store.
test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

for (const width of [1440, 393]) {
  test(`CMS distinguishes missing configuration from an empty collection at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/prayers(?:\?|$)/);
    await expect(page.getByText("인증 없는 과제용 관리 화면입니다.", { exact: false })).toBeVisible();
    await expect(page.getByRole("heading", { name: "기도문 DB 연결 설정을 확인해 주세요" })).toBeVisible();
    await expect(page.getByRole("link", { name: "새 기도문", exact: true }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
}

test("invalid prayer identifiers render the not-found state rather than querying a fallback dataset", async ({ page }) => {
  await page.goto("/admin/prayers/not-a-uuid");
  await expect(page.getByRole("heading", { name: "기도문을 찾을 수 없습니다" })).toBeVisible();
  await page.goto("/admin/prayers/not-a-uuid/edit");
  await expect(page.getByRole("heading", { name: "기도문을 찾을 수 없습니다" })).toBeVisible();
});

test("new prayer requires meaningful text and preserves values on server failure", async ({ page }) => {
  await page.goto("/admin/prayers/new");
  const title = page.locator('[name="title"]');
  const content = page.locator('[name="content"]');
  await title.fill("   ");
  await content.fill("   ");
  let writes = 0;
  await page.route("**/api/prayers", async route => {
    if (route.request().method() !== "POST") return route.continue();
    writes++;
    await route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "QA: 저장에 실패했습니다." }) });
  });
  await page.getByRole("button", { name: /등록|저장/ }).click();
  await expect(title).toBeFocused();
  expect(writes).toBe(0);
  await title.fill("QA 입력 유지 확인");
  await content.fill("QA 테스트 본문\n줄바꿈 보존 확인");
  await page.getByRole("button", { name: /등록|저장/ }).click();
  await expect(page.getByText("QA: 저장에 실패했습니다.", { exact: false })).toBeVisible();
  await expect(title).toHaveValue("QA 입력 유지 확인");
  await expect(content).toHaveValue("QA 테스트 본문\n줄바꿈 보존 확인");
  expect(writes).toBe(1);
});

test("pending prayer saves block duplicate submits and do not imply success before a server result", async ({ page }) => {
  await page.goto("/admin/prayers/new");
  await page.locator('[name="title"]').fill("QA 중복 제출 확인");
  await page.locator('[name="content"]').fill("QA 테스트 본문");
  let writes = 0;
  let release: (() => void) | undefined;
  const waiting = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/prayers", async route => {
    if (route.request().method() !== "POST") return route.continue();
    writes++;
    await waiting;
    await route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "QA: 다시 시도해 주세요." }) });
  });
  const submit = page.getByRole("button", { name: /등록|저장/ });
  await submit.evaluate(element => { const form = (element as HTMLButtonElement).form!; form.requestSubmit(); form.requestSubmit(); });
  await expect.poll(() => writes).toBe(1);
  await expect(submit).toBeDisabled();
  await expect(page).toHaveURL(/\/admin\/prayers\/new/);
  release!();
  await expect(page.getByText("QA: 다시 시도해 주세요.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: /등록|저장/ })).toBeEnabled();
  expect(writes).toBe(1);
});

test("CMS API rejects foreign-origin writes before any configured store could be used", async ({ request, baseURL }) => {
  const response = await request.post(`${baseURL}/api/prayers`, {
    headers: { Origin: "https://foreign.invalid" },
    multipart: { title: "QA 외부 출처", content: "QA 테스트 본문", language: "ko" },
  });
  expect(response.status()).toBe(403);
});

test("cover selection shows a local preview and rejects unsupported files without uploading", async ({ page }) => {
  await page.goto("/admin/prayers/new");
  await page.locator('[name="title"]').fill("QA 파일 검증");
  await page.locator('[name="content"]').fill("QA 테스트 본문");
  let writes = 0;
  await page.route("**/api/prayers", async route => {
    if (route.request().method() === "POST") writes++;
    await route.abort();
  });
  const png = await sharp({ create: { width: 24, height: 24, channels: 3, background: "#f5f2f7" } }).png().toBuffer();
  await page.locator('input[type="file"]').setInputFiles({ name: "qa-cover.png", mimeType: "image/png", buffer: png });
  await expect(page.getByAltText("선택한 대표 이미지 미리보기")).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles({ name: "qa-cover.svg", mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>') });
  await page.getByRole("button", { name: "기도문 등록", exact: true }).click();
  await expect(page.getByText("JPEG, PNG, WebP 이미지만 선택해 주세요.")).toBeVisible();
  expect(writes).toBe(0);
  await page.locator('input[type="file"]').setInputFiles({ name: "qa-too-large.png", mimeType: "image/png", buffer: Buffer.alloc(2_097_153) });
  await page.getByRole("button", { name: "기도문 등록", exact: true }).click();
  await expect(page.getByText("이미지는 0바이트보다 크고 2 MiB 이하여야 합니다.")).toBeVisible();
  expect(writes).toBe(0);
});
