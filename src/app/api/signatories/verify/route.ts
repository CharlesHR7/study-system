import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isProbablySvg(svg: string) {
  const s = svg.trim();
  return s.startsWith('<svg') && s.includes('</svg>');
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const token = String(body.token || '').trim();
  const signatureSvg = String(body.signatureSvg || '').trim();

  if (!token || !signatureSvg) {
    return NextResponse.json({ error: 'Missing token or signatureSvg' }, { status: 400 });
  }

  if (!isProbablySvg(signatureSvg)) {
    return NextResponse.json({ error: 'signatureSvg must be SVG' }, { status: 400 });
  }

  const reqRow = await prisma.signatoryVerificationRequest.findUnique({
    where: { token },
    include: { signatory: true },
  });

  if (!reqRow) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  if (reqRow.status !== 'SENT') return NextResponse.json({ error: 'Token already used/expired' }, { status: 400 });
  if (reqRow.expiresAt.getTime() < Date.now()) {
    await prisma.signatoryVerificationRequest.update({
      where: { id: reqRow.id },
      data: { status: 'EXPIRED' },
    });
    return NextResponse.json({ error: 'Token expired' }, { status: 400 });
  }

  await prisma.signatory.update({
    where: { id: reqRow.signatoryId },
    data: { signatureSvg, status: 'VERIFIED' },
  });

  await prisma.signatoryVerificationRequest.update({
    where: { id: reqRow.id },
    data: { status: 'USED' },
  });

  await prisma.auditEvent.create({
    data: {
      logbookId: reqRow.signatory.logbookId,
      type: 'SIGNATORY_VERIFIED',
      message: `Signatory slot ${reqRow.signatory.slotNumber} verified`,
    },
  });

  return NextResponse.json({ ok: true });
}
