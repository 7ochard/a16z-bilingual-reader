import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { ZodError } from "zod";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { Store } from "./store.js";
import {
  AppError,
  articlePatchSchema,
  dateOnly,
  reviewSchema,
  saveWordSchema,
  wordPatchSchema,
} from "./schema.js";
const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
export function createApp(store: Store, options: { staticDir?: string } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    );
    if (!localHost.test(req.headers.host || ""))
      return res
        .status(403)
        .json({
          error: "This single-user server only accepts localhost access",
        });
    const origin = req.headers.origin;
    if (origin) {
      try {
        const u = new URL(origin);
        if (
          !["http:", "https:"].includes(u.protocol) ||
          !localHost.test(u.host)
        )
          throw new Error();
      } catch {
        return res.status(403).json({ error: "Cross-origin access denied" });
      }
    }
    if (req.path.startsWith("/api")) res.setHeader("Cache-Control", "no-store");
    if (
      ["POST", "PATCH", "PUT", "DELETE"].includes(req.method) &&
      (!req.is("application/json") || req.get("X-Reader-Request") !== "1")
    )
      return res
        .status(403)
        .json({ error: "JSON and X-Reader-Request: 1 are required" });
    next();
  });
  app.use(express.json({ limit: "5mb", strict: true }));
  const route =
    (fn: (req: Request, res: Response) => unknown) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        fn(req, res);
      } catch (e) {
        next(e);
      }
    };
  const param = (req: Request) => String(req.params.id);
  const query = (req: Request, k: string) =>
    typeof req.query[k] === "string" ? (req.query[k] as string) : undefined;
  app.get("/api/health", (_req, res) =>
    res.json({
      ok: true,
      contract: "bilingual-reader.provisional",
      schema_version: "1.0",
    }),
  );
  app.get(
    "/api/stats",
    route((_req, res) => res.json(store.stats())),
  );
  app.get(
    "/api/articles",
    route((req, res) => {
      const from = query(req, "from"),
        to = query(req, "to");
      if (from) dateOnly.parse(from);
      if (to) dateOnly.parse(to);
      if (from && to && from > to)
        throw new AppError(400, "From date must not be later than to date");
      res.json({
        articles: store.articles({
          q: query(req, "q"),
          topic: query(req, "topic"),
          from,
          to,
        }),
      });
    }),
  );
  app.get(
    "/api/articles/:id",
    route((req, res) => res.json(store.article(param(req)))),
  );
  app.patch(
    "/api/articles/:id",
    route((req, res) =>
      res.json(
        store.patchArticle(param(req), articlePatchSchema.parse(req.body)),
      ),
    ),
  );
  app.post(
    "/api/import",
    route((req, res) => res.json(store.import(req.body))),
  );
  app.get(
    "/api/export",
    route((_req, res) => {
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reader-content.json"',
      );
      res.json(store.export());
    }),
  );
  app.get(
    "/api/vocabulary",
    route((req, res) =>
      res.json({
        vocabulary: store.words({
          q: query(req, "q"),
          favorites: query(req, "favorites") === "true",
          due: query(req, "due") === "true",
        }),
      }),
    ),
  );
  app.post(
    "/api/vocabulary",
    route((req, res) =>
      res.status(201).json(store.saveWord(saveWordSchema.parse(req.body))),
    ),
  );
  app.patch(
    "/api/vocabulary/:id",
    route((req, res) =>
      res.json(store.patchWord(param(req), wordPatchSchema.parse(req.body))),
    ),
  );
  app.get(
    "/api/review",
    route((_req, res) => res.json({ vocabulary: store.words({ due: true }) })),
  );
  app.post(
    "/api/vocabulary/:id/review",
    route((req, res) =>
      res.json(store.review(param(req), reviewSchema.parse(req.body))),
    ),
  );
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "API route not found" }),
  );
  const staticDir = options.staticDir ?? resolve("dist");
  if (existsSync(staticDir)) {
    app.use(express.static(staticDir));
    app.get("/{*path}", (_req, res) =>
      res.sendFile(resolve(staticDir, "index.html")),
    );
  }
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          error: error.issues
            .map((i) => `${i.path.join(".") || "input"}: ${i.message}`)
            .join("; "),
        });
    if (error instanceof AppError)
      return res.status(error.status).json({ error: error.message });
    if (error.type === "entity.too.large")
      return res.status(413).json({ error: "JSON exceeds 5 MB limit" });
    if (error instanceof SyntaxError && "body" in error)
      return res.status(400).json({ error: "Invalid JSON" });
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });
  return app;
}
