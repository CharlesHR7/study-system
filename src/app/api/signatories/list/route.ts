import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const logbookId = searchParams.get('logbookId')?.trim();

  if (!logbookId) {
    return NextResponse.json({ error: 'Missing logbookId' }, { status: 400 });
  }

  const rows = await prisma.signatory.findMany({
    where: { logbookId },
    orderBy: { slotNumber: 'asc' },
  });

  return NextResponse.json({ signatories: rows });
}
