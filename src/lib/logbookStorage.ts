import { LogbookEntry } from '@/types/logbook';

const STORAGE_KEY = 'ame-one-logbook-v1';

export function loadLogbookEntries(): LogbookEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LogbookEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading logbook from localStorage', err);
    return [];
  }
}

export function saveLogbookEntries(entries: LogbookEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Error saving logbook to localStorage', err);
  }
}
