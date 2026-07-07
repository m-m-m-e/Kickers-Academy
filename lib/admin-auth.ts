import crypto from "node:crypto";

export const ADMIN_COOKIE_NAME = "bru_admin_session";
const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production.");
  }

  return "change-this-secret-before-production";
}

export function createAdminSession(username: string) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + DEFAULT_SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ username, issuedAt, expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(token: string | undefined | null) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      issuedAt?: number;
      expiresAt?: number;
    };

    if (!parsed.username || !parsed.expiresAt || Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (process.env.NODE_ENV === "production" && (!username || !password)) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in production.");
  }

  return {
    username: username || "admin",
    password: password || "Admin@12345!"
  };
}
