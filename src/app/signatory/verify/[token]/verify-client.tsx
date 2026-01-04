'use client';

import React, { useState } from 'react';
import SignaturePad from '@/components/SignaturePad';

export default function VerifyClient({
  rawToken,
  signatory,
}: {
  rawToken: string;
  signatory: {
    id: string;
    name: string;
    email: string;
    licenceOrAuthNo: string;
    initials: string;
    signatureSvg: string | null;
    status: string;
  };
}) {
  const [name] = useState(signatory.name);
  const [email] = useState(signatory.email);
  const [licenceOrAuthNo] = useState(signatory.licenceOrAuthNo);
  const [initials] = useState(signatory.initials);

  const [sigSvg, setSigSvg] = useState<string | null>(signatory.signatureSvg);
  const [msg, setMsg] = useState<string>('');

  const save = async (svg: string) => {
    setMsg('Saving...');
    const res = await fetch('/api/signatory/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: rawToken, signatureSvg: svg }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j?.error ?? 'Error saving');
      return;
    }

    setSigSvg(svg);
    setMsg('Saved. Signatory verified ✅');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="text-[22px] font-bold mb-2">Confirm Signatory Profile</div>
      <div className="text-gray-700 text-[13px] mb-4">
        Please review your details and draw your signature. This signature will be used for printing and verification.
      </div>

      <div className="border border-gray-200 rounded p-3 bg-white mb-4 text-[13px]">
        <div><span className="font-semibold">Name:</span> {name}</div>
        <div><span className="font-semibold">Email:</span> {email}</div>
        <div><span className="font-semibold">Licence/Authority #:</span> {licenceOrAuthNo || '—'}</div>
        <div><span className="font-semibold">Initials:</span> {initials || '—'}</div>
      </div>

      <SignaturePad initialSvg={sigSvg} onSaveSvg={save} />

      {msg ? <div className="mt-3 text-[12px] text-gray-700">{msg}</div> : null}
    </div>
  );
}
