// src/lib/entitlementsClient.ts
export const STORAGE_KEY = 'ameone_student_v1';

export type LicenceKey = 'm1m2' | 'avionics' | 'structures' | 'balloons';
export type Entitlements = Record<string, boolean>;
export type StudentState = { credits: number; entitlements: Record<LicenceKey, Entitlements> };

export function loadStudentState(): StudentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentState;
  } catch {
    return null;
  }
}

export function hasModule(moduleKey: string): boolean {
  try {
    const s = loadStudentState();
    if (!s) return false;
    const [licence, mod] = moduleKey.split('.');
    if (!licence || !mod) return false;
    return !!(s.entitlements as any)?.[licence]?.[mod];
  } catch {
    return false;
  }
}
