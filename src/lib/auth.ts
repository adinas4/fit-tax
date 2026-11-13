import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "cit_admin_session";
const SESSION_TTL_DAYS = 7;

// ---- Password hashing (scrypt) ----
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(test, "hex"));
}

// ---- Session management ----
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.adminSession.create({
    data: { token, userId, expiresAt },
  });
  return token;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.adminSession.findUnique({
    where: { token },
  });
  const adminUser = session
    ? await db.adminUser.findUnique({ where: { id: session.userId } })
    : null;

  if (!session || !adminUser) return null;
  if (session.expiresAt < new Date()) {
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return {
    user: { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: adminUser.role },
    sessionId: session.id,
  };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function destroySession(token: string) {
  await db.adminSession.delete({ where: { token } }).catch(() => {});
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
