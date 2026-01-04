import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, email, licenceOrAuthNo, initials } = body;

  const existing = await prisma.signatory.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const signatory = await prisma.signatory.update({
    where: { id: params.id },
    data: {
      name: name ?? existing.name,
      email: email ?? existing.email,
      licenceOrAuthNo: licenceOrAuthNo ?? existing.licenceOrAuthNo,
      initials: initials ?? existing.initials,
      status: 'NEEDS_REVERIFY',
    },
  });

  await prisma.auditEvent.create({
    data: {
      logbookId: existing.logbookId,
      actorType: 'APPLICANT',
      action: 'SIGNATORY_UPDATED_NEEDS_REVERIFY',
      metaJson: JSON.stringify({ signatoryId: signatory.id }),
    },
  });

  return NextResponse.json({ signatory });
}
