import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ads_admin_session";
const SESSION_TTL = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_PASSWORD || "invalid-admin-secret";
}

export function createSession(username: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = `${username}.${expires}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const [username, expiresText, signature] = value.split(".");
  const expires = Number(expiresText);
  if (!username || !signature || !Number.isSafeInteger(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", secret()).update(`${username}.${expires}`).digest("hex");
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function hasAdminSession() {
  return isValidSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export function isAuthorized(request: Request) {
  const cookie = request.headers.get("cookie")?.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`))?.[1];
  return isValidSession(cookie) || request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}
