import "server-only";
import { cookies, headers } from "next/headers";

/**
 * Resolve current user email on SERVER.
 * Priority:
 * 1) Real auth (NextAuth/Clerk) — when enabled later
 * 2) Cookie or header (dev/proxy)
 * 3) DEV fallback via ADMIN_DEV_EMAIL (only in development)
 */
export async function getUserEmailServer(): Promise<string | null> {
  // 1) REAL AUTH (enable later)
  // NextAuth: const session = await auth(); return session?.user?.email ?? null;
  // Clerk: currentUser() etc.

  // 2) Cookie
  const fromCookie = cookies().get("ameone_email")?.value;
  if (fromCookie) return fromCookie;

  // 2) Header
  const fromHeader = headers().get("x-ameone-email");
  if (fromHeader) return fromHeader;

  // 3) DEV fallback (safe)
  if (process.env.NODE_ENV === "development") {
    const devEmail = process.env.ADMIN_DEV_EMAIL;
    if (devEmail) return devEmail;
  }

  return null;
}
