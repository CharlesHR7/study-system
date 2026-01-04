import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const logbookId = String(body.logbookId || '').trim();
  const slotNumber = Number(body.slotNumber);

  if (!logbookId || !Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 15) {
    return NextResponse.json({ error: 'Missing/invalid logbookId or slotNumber' }, { status: 400 });
  }

  const data = {
    name: String(body.name || ''),
    email: String(body.email || ''),
    licenceNumber: String(body.licenceNumber || ''),
    initials: String(body.initials || ''),
    dateSigned: String(body.dateSigned || ''),
  };

  const signatory = await prisma.signatory.upsert({
    where: { logbookId_slotNumber: { logbookId, slotNumber } },
    update: data,
    create: {
      logbookId,
      slotNumber,
      ...data,
      status: 'DRAFT',
      signatureSvg: '',
    },
  });

  return NextResponse.json({ signatory });
}
