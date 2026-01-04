// src/lib/adminAuth.ts
import "server-only";

export function parseAdminEmails(raw?: string) {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const allow = parseAdminEmails(process.env.ADMIN_EMAILS);
  return allow.includes(email.toLowerCase());
}
