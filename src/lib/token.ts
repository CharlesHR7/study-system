import crypto from 'crypto';

export function generateRawToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function hashToken(rawToken: string) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
