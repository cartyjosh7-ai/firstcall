import crypto from "node:crypto";

const TTL_MS = 60 * 60 * 1000; // 1 hour

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set.");
  return s;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(`pwreset:${payload}`).digest("hex");
}

/**
 * Token embeds the user id, an expiry, and a prefix of their current
 * password hash — so it's self-verifying (no DB row to store/clean up) and
 * automatically invalidated the moment the password actually changes.
 */
export function createResetToken(userId: string, currentPasswordHash: string): string {
  const payload = `${userId}.${Date.now() + TTL_MS}.${currentPasswordHash.slice(-12)}`;
  const token = Buffer.from(`${payload}.${sign(payload)}`).toString("base64url");
  return token;
}

function parts(token: string): [string, string, string, string] | null {
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const p = decoded.split(".");
  return p.length === 4 ? (p as [string, string, string, string]) : null;
}

/** Reads the user id out of a token without verifying it — use only to know which user's passwordHash to fetch before calling verifyResetToken. */
export function peekResetTokenUserId(token: string): string | null {
  return parts(token)?.[0] ?? null;
}

export function verifyResetToken(token: string, currentPasswordHash: string): string | null {
  const p = parts(token);
  if (!p) return null;
  const [userId, expiryStr, hashSuffix, signature] = p;
  const payload = `${userId}.${expiryStr}.${hashSuffix}`;

  const expected = sign(payload);
  if (expected.length !== signature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;

  if (Date.now() > Number(expiryStr)) return null;
  if (hashSuffix !== currentPasswordHash.slice(-12)) return null;

  return userId;
}
