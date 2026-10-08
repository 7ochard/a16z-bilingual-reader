import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { AddressInfo } from "node:net";
import { get } from "node:http";
import { createApp } from "../server/app.js";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const sample = JSON.parse(
  readFileSync(
    new URL("../fixtures/synthetic-library.json", import.meta.url),
    "utf8",
  ),
);
const headers = { "Content-Type": "application/json", "X-Reader-Request": "1" };
test("HTTP import, content, save, review, malformed inputs, security headers and local origin guard", async () => {
  const db = openDatabase(":memory:"),
    app = createApp(new Store(db)),
    server = app.listen(0, "127.0.0.1");
  await new Promise<void>((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    let r = await fetch(base + "/api/import", {
      method: "POST",
      headers,
      body: JSON.stringify(sample),
    });
    assert.equal(r.status, 200);
    r = await fetch(base + "/api/articles");
    assert.equal((await r.json()).articles.length, 2);
    assert.equal(r.headers.get("cache-control"), "no-store");
    assert.ok(
      r.headers
        .get("content-security-policy")
        ?.includes("frame-ancestors 'none'"),
    );
    for (const [path, body] of [
      ["/api/import", { ...sample, schema_version: "9" }],
      [
        "/api/import",
        {
          ...sample,
          articles: [
            {
              ...sample.articles[0],
              source: { ...sample.articles[0].source, url: "not a url" },
            },
          ],
        },
      ],
      [
        "/api/vocabulary",
        {
          article_id: "synthetic-small-bets",
          segment_id: "opening",
          term: "forecast",
        },
      ],
      ["/api/articles/synthetic-small-bets", { read: "true" }],
    ] as const) {
      r = await fetch(base + path, {
        method: path.includes("/articles/") ? "PATCH" : "POST",
        headers,
        body: JSON.stringify(body),
      });
      assert.equal(r.status, 400);
    }
    r = await fetch(base + "/api/import", {
      method: "POST",
      headers,
      body: "{",
    });
    assert.equal(r.status, 400);
    r = await fetch(base + "/api/import", {
      method: "POST",
      headers: { ...headers, Origin: "https://evil.example" },
      body: JSON.stringify(sample),
    });
    assert.equal(r.status, 403);
    r = await fetch(base + "/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sample),
    });
    assert.equal(r.status, 403);
    const hostStatus = await new Promise<number | undefined>(
      (resolve, reject) =>
        get(base + "/api/stats", { headers: { Host: "evil.example" } }, (r) => {
          r.resume();
          resolve(r.statusCode);
        }).on("error", reject),
    );
    assert.equal(hostStatus, 403);
    r = await fetch(base + "/api/articles?from=2026-02-30");
    assert.equal(r.status, 400);
    r = await fetch(base + "/api/articles?from=2026-10-01&to=2026-09-01");
    assert.equal(r.status, 400);
    r = await fetch(base + "/api/articles/missing");
    assert.equal(r.status, 404);
    r = await fetch(base + "/api/vocabulary", {
      method: "POST",
      headers,
      body: JSON.stringify({
        article_id: "synthetic-small-bets",
        segment_id: "opening",
        term: "forecast",
        meaning_zh: "预测",
      }),
    });
    assert.equal(r.status, 201);
    const word = await r.json();
    r = await fetch(base + `/api/vocabulary/${word.id}/review`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        event_id: crypto.randomUUID(),
        rating: 4,
        expected_revision: 0,
      }),
    });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).progress.reps, 1);
    r = await fetch(base + "/api/review");
    assert.equal((await r.json()).vocabulary.length, 0);
  } finally {
    await new Promise<void>((r) => server.close(() => r()));
    db.close();
  }
});
