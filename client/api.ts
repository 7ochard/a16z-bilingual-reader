export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: options.method || "GET",
    signal: options.signal,
    headers: options.method
      ? { "Content-Type": "application/json", "X-Reader-Request": "1" }
      : undefined,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("服务暂时无法响应，请稍后重试。", response.status);
  }
  if (!response.ok)
    throw new ApiError(
      typeof payload === "object" && payload && "error" in payload
        ? String(payload.error)
        : `请求失败 (${response.status})`,
      response.status,
    );
  return payload as T;
}
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "发生了意外错误，请重试。";
}
export function formatDate(value: string, includeTime = false): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...(includeTime
          ? { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }
          : { timeZone: "UTC" }),
      }).format(date);
}
