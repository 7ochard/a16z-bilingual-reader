import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const fixture = JSON.parse(
  readFileSync("fixtures/synthetic-library.json", "utf8"),
);
const upstream = JSON.parse(
  readFileSync("fixtures/synthetic-upstream-wrapper.json", "utf8"),
);
const headers = { "Content-Type": "application/json", "X-Reader-Request": "1" };
test("read modes, mobile word fallback, persistent favorites and FSRS review", async ({
  page,
  request,
}, info) => {
  const article = structuredClone(fixture.articles[0]);
  article.id = `e2e-${info.project.name}-reader`;
  article.title = `Reading test ${info.project.name}`;
  expect(
    (
      await request.post("/api/import", {
        headers,
        data: { ...fixture, articles: [article] },
      })
    ).ok(),
  ).toBeTruthy();
  await page.goto(`/#reader/${article.id}`);
  await expect(
    page.getByRole("heading", { name: article.title, exact: true }),
  ).toBeVisible();
  await expect(page.locator(".segment-en")).toHaveCount(4);
  await expect(page.locator(".segment-zh")).toHaveCount(4);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator(".segment-zh")).toHaveCount(0);
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await expect(page.locator(".segment-en")).toHaveCount(0);
  await page.getByRole("button", { name: "双语", exact: true }).click();
  await page
    .getByRole("button", { name: "收藏第 1 段的词语", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("词语 / 短语").fill("forecast");
  await page.getByLabel("中文释义", { exact: true }).fill("预测");
  await page.getByRole("button", { name: "保存到生词本", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "标记已读", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "已读", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/#vocabulary");
  const card = page
    .locator(".word-card")
    .filter({
      has: page.getByRole("link", { name: article.title, exact: true }),
    });
  await expect(card).toBeVisible();
  await card
    .getByRole("button", { name: "收藏生词：forecast", exact: true })
    .click();
  await page.reload();
  await expect(
    card.getByRole("button", { name: "取消收藏生词：forecast", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/#review");
  await page.getByRole("button", { name: "显示释义" }).click();
  await page.getByRole("button", { name: "Easy 简单", exact: true }).click();
  await expect(page.getByText("这一轮，学得不错。")).toBeVisible();
  const saved = (
    await (await request.get("/api/vocabulary")).json()
  ).vocabulary.find((w: any) => w.article_id === article.id);
  expect(saved.progress.reps).toBe(1);
  expect(saved.favorite).toBe(true);
  await page.goto("/#library");
  await page.getByLabel("搜索文章").fill(article.title);
  await expect(page.locator(".article-card")).toHaveCount(1);
  await page.screenshot({
    path: `test-results/${info.project.name}-library.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBeTruthy();
});
test("invalid import is recoverable; raw upstream requires rights and preserves article-level context", async ({
  page,
  request,
}, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "导入文章", exact: true }).click();
  await page
    .getByLabel("选择文章 JSON 文件")
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{broken"),
    });
  await expect(page.getByRole("alert")).toContainText("JSON 格式无效");
  const article = structuredClone(upstream.article);
  article.id = `e2e-${info.project.name}-upstream`;
  article.title = `Upstream test ${info.project.name}`;
  await page
    .getByLabel("选择文章 JSON 文件")
    .setInputFiles({
      name: "upstream.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(article)),
    });
  await expect(
    page.getByRole("button", { name: "确认权利并导入" }),
  ).toBeDisabled();
  await page.getByLabel("内容使用权利").selectOption("owned");
  await page.getByLabel("版权声明").fill("Original synthetic test content.");
  await page
    .getByLabel("授权说明")
    .fill("Original sample authored for this project; no real content.");
  await page.getByRole("button", { name: "确认权利并导入" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto(`/#reader/${article.id}`);
  await page.locator(".suggested-word").filter({ hasText: "momentum" }).click();
  await expect(page.getByRole("dialog")).toContainText("例句不代表原文段落");
  await page.getByRole("button", { name: "保存到生词本", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const saved = (
    await (await request.get("/api/vocabulary")).json()
  ).vocabulary.find((w: any) => w.article_id === article.id);
  expect(saved.segment_id).toBeNull();
  expect(saved.context_kind).toBe("supplied_example");
  await page.getByRole("tab", { name: "文章解析", exact: true }).click();
  await expect(page.getByText("局限与注意事项", { exact: true })).toBeVisible();
  await page.screenshot({
    path: `test-results/${info.project.name}-reader.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBeTruthy();
  // Finish the synthetic due card so the other viewport test has an isolated review queue.
  await request.post(`/api/vocabulary/${saved.id}/review`, {
    headers,
    data: { event_id: crypto.randomUUID(), rating: 4, expected_revision: 0 },
  });
});
test("selection and dialog cancel preserve navigation and do not save a word", async ({
  page,
  request,
}, info) => {
  await page.goto("/#reader/synthetic-small-bets");
  await expect(page.locator(".segment-en").first()).toBeVisible();
  const before = (await (await request.get("/api/vocabulary")).json())
    .vocabulary.length;
  await page
    .locator(".segment-en")
    .first()
    .evaluate((el) => {
      const text = el.firstChild!;
      const start = text.textContent!.indexOf("forecast");
      const range = document.createRange();
      range.setStart(text, start);
      range.setEnd(text, start + 8);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
      el.parentElement!.dispatchEvent(
        new MouseEvent("mouseup", { bubbles: true }),
      );
    });
  await page.getByRole("button", { name: "收藏词语", exact: true }).click();
  await expect(page.getByLabel("词语 / 短语")).toHaveValue("forecast");
  await page.getByRole("button", { name: "取消", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "收藏第 1 段的词语", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator(".back-link").click();
  await expect(page).toHaveURL(/#library/);
  await page.goBack();
  await expect(page).toHaveURL(/#reader\/synthetic-small-bets/);
  expect(
    (await (await request.get("/api/vocabulary")).json()).vocabulary.length,
  ).toBe(before);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await expect(page.locator(".segment-en")).toHaveCount(4);
  expect(errors).toEqual([]);
});
test("hostile imported text remains literal text, never executable HTML", async ({
  page,
  request,
}, info) => {
  const article = structuredClone(fixture.articles[0]);
  article.id = `e2e-${info.project.name}-hostile`;
  article.title = "<img src=x onerror=alert(1)> Test";
  article.segments[0].en =
    "<script>alert(1)</script> A harmless literal string.";
  article.vocabulary = [];
  expect(
    (
      await request.post("/api/import", {
        headers,
        data: { ...fixture, articles: [article] },
      })
    ).ok(),
  ).toBeTruthy();
  let dialogSeen = false;
  page.on("dialog", async (dialog) => {
    dialogSeen = true;
    await dialog.dismiss();
  });
  await page.goto(`/#reader/${article.id}`);
  await expect(
    page.getByRole("heading", { name: article.title, exact: true }),
  ).toBeVisible();
  await expect(page.locator(".segment-en").first()).toContainText(
    "<script>alert(1)</script>",
  );
  expect(
    await page
      .locator(".reader-page img,.reader-page script,.reader-page [onerror]")
      .count(),
  ).toBe(0);
  expect(dialogSeen).toBe(false);
});
