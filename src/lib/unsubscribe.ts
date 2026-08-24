import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

function file() {
  return path.join(process.cwd(), "data", "unsubscribed.jsonl");
}

function secret() {
  return process.env.UNSUBSCRIBE_SECRET || "dev-only-insecure-unsubscribe-secret";
}

/** CASL requires a working unsubscribe on every commercial message; this token stops randoms from unsubscribing someone else's address via a guessed link. */
export function unsubscribeToken(email: string): string {
  return crypto.createHmac("sha256", secret()).update(email.toLowerCase().trim()).digest("hex").slice(0, 24);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

let cache: Set<string> | null = null;

async function loadCache(): Promise<Set<string>> {
  if (cache) return cache;
  try {
    const text = await readFile(file(), "utf8");
    cache = new Set(
      text
        .split("\n")
        .filter(Boolean)
        .map((line) => (JSON.parse(line) as { email: string }).email),
    );
  } catch {
    cache = new Set();
  }
  return cache;
}

export async function isUnsubscribed(email: string): Promise<boolean> {
  const set = await loadCache();
  return set.has(email.toLowerCase().trim());
}

export async function addUnsubscribe(email: string): Promise<void> {
  const normalized = email.toLowerCase().trim();
  const set = await loadCache();
  if (set.has(normalized)) return;
  set.add(normalized);
  await mkdir(path.dirname(file()), { recursive: true });
  await appendFile(file(), JSON.stringify({ email: normalized, at: new Date().toISOString() }) + "\n", "utf8");
}
