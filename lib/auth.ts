import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { db } from "./db";

const scrypt = promisify(scryptCb);

export const SESSION_COOKIE = "lab_admin_session";
const SESSION_DAYS = 7;

/** scrypt password hash: `saltHex:derivedHex` */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) return false;
    const derived = (await scrypt(password, Buffer.from(saltHex, "hex"), 64)) as Buffer;
    const expected = Buffer.from(hashHex, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export async function createSession(userId: string, req?: Request) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await db.adminSession.create({ data: { token, userId, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: isSecureRequest(req),
  });
  return token;
}

/**
 * Secure flag only when actually serving HTTPS. A blanket
 * `NODE_ENV === "production"` breaks http deployments (local `next start`,
 * LAN/VPS without TLS) because browsers refuse to send Secure cookies
 * over http. Env COOKIE_SECURE=1 forces it on.
 */
function isSecureRequest(req?: Request): boolean {
  if (process.env.COOKIE_SECURE === "1") return true;
  if (process.env.COOKIE_SECURE === "0") return false;
  if (!req) return process.env.NODE_ENV === "production";
  const forwarded = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwarded) return forwarded === "https";
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await db.adminSession.delete({ where: { token } });
    } catch {}
  }
  jar.delete(SESSION_COOKIE);
}

/** Returns the logged-in admin user, or null. Cleans up expired sessions. */
export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      try {
        await db.adminSession.delete({ where: { token } });
      } catch {}
    }
    return null;
  }
  return db.adminUser.findUnique({ where: { id: session.userId } });
}
