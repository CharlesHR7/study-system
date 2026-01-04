import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type Normalized = {
  qid: string;
  examCode?: string;
  topicCode?: string;
  topicTitle?: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  reference?: string;
  explanation?: string;
  source?: string;
  category?: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');

function normalizeKey(s: string) {
  return s.trim().toUpperCase();
}

async function listJsonFilesRecursive(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await listJsonFilesRecursive(full)));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) files.push(full);
  }
  return files;
}

// Suporta:
// - options como array + correctAnswer number (0-3 ou 1-4)
// - options como {A,B,C,D} + correctAnswer 'A'/'B'...
function normalizeQuestion(raw: any): Normalized | null {
  const qidRaw = raw.qid ?? raw.id;
  if (!qidRaw || !raw.question) return null;

  // options as object
  if (raw.options && typeof raw.options === 'object' && !Array.isArray(raw.options)) {
    const opts = raw.options;
    const ca = (raw.correctAnswer ?? raw.correct_answer) as any;
    const letter = (ca ?? 'A') as 'A' | 'B' | 'C' | 'D';

    if (!opts.A || !opts.B || !opts.C || !opts.D) return null;

    return {
      qid: String(qidRaw),
      examCode: raw.examCode,
      topicCode: raw.topicCode,
      topicTitle: raw.topicTitle,
      question: raw.question,
      options: { A: opts.A, B: opts.B, C: opts.C, D: opts.D },
      correctAnswer: letter,
      reference: raw.reference,
      explanation: raw.explanation,
      source: raw.source,
      category: raw.category,
    };
  }

  // options as array
  if (Array.isArray(raw.options)) {
    const arr = raw.options as string[];
    if (arr.length < 4) return null;

    // correctAnswer pode ser 0-3 ou 1-4
    const idxRaw = raw.correctAnswer;
    let idx = Number(idxRaw);
    if (!Number.isFinite(idx)) idx = 0;
    if (idx >= 1 && idx <= 4) idx = idx - 1; // converte 1-4 para 0-3
    idx = Math.max(0, Math.min(3, idx));

    const letters = ['A', 'B', 'C', 'D'] as const;

    return {
      qid: String(qidRaw),
      examCode: raw.examCode,
      topicCode: raw.topicCode,
      topicTitle: raw.topicTitle,
      question: raw.question,
      options: { A: arr[0], B: arr[1], C: arr[2], D: arr[3] },
      correctAnswer: letters[idx],
      reference: raw.reference,
      explanation: raw.explanation,
      source: raw.source,
      category: raw.category,
    };
  }

  return null;
}

let cache: Map<string, Normalized> | null = null;
let builtAt = 0;

async function buildIndex() {
  const map = new Map<string, Normalized>();
  const files = await listJsonFilesRecursive(DATA_DIR);

  for (const file of files) {
    try {
      const rawText = await fs.readFile(file, 'utf-8');
      const parsed = JSON.parse(rawText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const it of items) {
        const norm = normalizeQuestion(it);
        if (!norm) continue;

        const key = normalizeKey(norm.qid);
        if (!map.has(key)) map.set(key, norm);
      }
    } catch {
      // ignore
    }
  }
  return map;
}

async function getIndex() {
  const TEN_MIN = 10 * 60 * 1000;
  const now = Date.now();
  if (!cache || now - builtAt > TEN_MIN) {
    cache = await buildIndex();
    builtAt = now;
  }
  return cache;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  }

  const key = normalizeKey(id);
  const index = await getIndex();
  const found = index.get(key);

  if (!found) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, question: found });
}
