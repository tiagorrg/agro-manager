export const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3001";

export const IS_DEMO_MODE = process.env.REACT_APP_DEMO === "true";

export function getRouterBasename(): string | undefined {
  const publicUrl = process.env.PUBLIC_URL;

  if (!publicUrl || publicUrl === ".") {
    return undefined;
  }

  try {
    const path = new URL(publicUrl).pathname.replace(/\/$/, "");
    return path || undefined;
  } catch {
    const normalized = publicUrl.replace(/\/$/, "");
    return normalized || undefined;
  }
}
