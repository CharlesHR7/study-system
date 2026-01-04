'use client';

import React, { useState } from 'react';

export default function SignClient({
  rawToken,
  signatory,
  tasks,
}: {
  rawToken: string;
  signatory: { id: string; name: string; initials: string; signatureSvg: string | null };
  tasks: Array<{ rowIndex: number; ata?: string; title?: string; taskText: string }>;
}) {
  const [msg, setMsg] = useState('');

  const confirm = async () => {
    setMsg('Confirming...');
    const res = await fetch('/api/sign/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: rawToken }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j?.error ?? 'Error');
      return;
    }

    setMsg('Signed ✅ You can close this page.');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-[22px] font-bold mb-2">Signature Request</div>
      <div className="text-gray-700 text-[13px] mb-4">
        Please review the tasks below and confirm your signature.
      </div>

      <div className="border border-gray-200 rounded p-3 bg-white mb-4 text-[13px]">
        <div><span className="font-semibold">Signatory:</span> {signatory.name}</div>
        <div><span className="font-semibold">Initials:</span> {signatory.initials || '—'}</div>

        {signatory.signatureSvg ? (
          <div className="mt-3">
            <div className="text-[11px] text-gray-600 mb-1">Signature on file:</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="border border-gray-300 bg-white"
              src={`data:image/svg+xml;utf8,${encodeURIComponent(signatory.signatureSvg)}`}
            />
          </div>
        ) : null}
      </div>

      <div className="border border-gray-200 rounded p-3 bg-white">
        <div className="font-semibold mb-2">Tasks to sign</div>
        <ul className="list-disc pl-5 space-y-1 text-[13px]">
          {tasks.map((t, i) => (
            <li key={i}>
              <span className="font-semibold">
                {t.ata ? `ATA ${t.ata} — ` : ''}
              </span>
              {t.taskText}
              <span className="text-gray-500 text-[12px]"> (row {t.rowIndex})</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={confirm}
        className="mt-4 px-4 py-2 rounded border border-gray-800 bg-gray-900 text-white hover:bg-black"
      >
        Confirm & Sign
      </button>

      {msg ? <div className="mt-3 text-[12px] text-gray-700">{msg}</div> : null}
    </div>
  );
}
