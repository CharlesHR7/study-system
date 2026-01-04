export function makeLogbookKey(licenceKey: string) {
  return `ameone_logbook_${licenceKey}_id`;
}

export async function ensureLogbookId(licenceKey: string): Promise<string> {
  const LS_KEY = makeLogbookKey(licenceKey);

  const saved = localStorage.getItem(LS_KEY);
  if (saved) return saved;

  const res = await fetch('/api/logbook/create', { method: 'POST' });

  const text = await res.text();
  let j: any;
  try {
    j = JSON.parse(text);
  } catch {
    throw new Error(
      `API did not return JSON. Status ${res.status}. Body: ${text.slice(0, 60)}`
    );
  }

  if (!res.ok || !j?.logbookId) {
    throw new Error(j?.error ?? `Failed to create logbook`);
  }

  localStorage.setItem(LS_KEY, j.logbookId);
  return j.logbookId;
}
