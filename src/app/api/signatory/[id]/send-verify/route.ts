import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { addDays, generateRawToken, hashToken } from '@/lib/token';
import { sendEmailDev } from '@/lib/email-dev';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const signatory = await prisma.signatory.findUnique({ where: { id: params.id } });
  if (!signatory) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const raw = generateRawToken();
  const tokenHash = hashToken(raw);

  const verify = await prisma.signatoryVerificationRequest.create({
    data: {
      signatoryId: signatory.id,
      tokenHash,
      expiresAt: addDays(7),
    },
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/signatory/verify/${raw}`;

  await sendEmailDev(
    signatory.email,
    'AME ONE — Confirm Signatory Profile',
    url
  );

  await prisma.auditEvent.create({
    data: {
      logbookId: signatory.logbookId,
      actorType: 'APPLICANT',
      action: 'SIGNATORY_VERIFY_SENT',
      metaJson: JSON.stringify({ signatoryId: signatory.id, verifyRequestId: verify.id }),
    },
  });

  return NextResponse.json({ ok: true });
}
