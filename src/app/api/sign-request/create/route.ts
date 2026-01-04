import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { addDays, generateRawToken, hashToken } from '@/lib/token';
import { sendEmailDev } from '@/lib/email-dev';

export async function POST(req: Request) {
  const body = await req.json();
  const { logbookId, signatoryId, tasks } = body;

  if (!logbookId || !signatoryId || !Array.isArray(tasks) || tasks.length === 0) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const signatory = await prisma.signatory.findUnique({ where: { id: signatoryId } });
  if (!signatory) return NextResponse.json({ error: 'Signatory not found' }, { status: 404 });

  if (signatory.status !== 'VERIFIED' || !signatory.signatureSvg) {
    return NextResponse.json(
      { error: 'Signatory must be VERIFIED and have a saved signature' },
      { status: 400 }
    );
  }

  const raw = generateRawToken();
  const tokenHash = hashToken(raw);

  const reqRecord = await prisma.taskSignatureRequest.create({
    data: {
      logbookId,
      signatoryId,
      tokenHash,
      expiresAt: addDays(7),
      payloadJson: JSON.stringify({ tasks }),
    },
  });

  const url =
    `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/sign/${raw}`;

  await sendEmailDev(signatory.email, 'AME ONE — Signature request', url);

  await prisma.auditEvent.create({
    data: {
      logbookId,
      actorType: 'APPLICANT',
      action: 'TASK_SIGNATURE_REQUEST_SENT',
      metaJson: JSON.stringify({
        taskSignatureRequestId: reqRecord.id,
        signatoryId,
        taskCount: tasks.length,
      }),
    },
  });

  return NextResponse.json({ ok: true });
}
