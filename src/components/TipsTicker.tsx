'use client';

import React, { useEffect, useMemo, useState } from 'react';

type TipsTickerProps = {
  tips?: string[];
  intervalMs?: number;
};

export default function TipsTicker({
  tips,
  intervalMs = 4500,
}: TipsTickerProps) {
  const items = useMemo(
    () =>
      tips?.length
        ? tips
        : [
            'Exam day: bring pencils, eraser, and an approved calculator.',
            'Read the entire question first—then read every option.',
            'Eliminate the most obviously wrong answers before choosing.',
            'If unsure, look for keywords like ALWAYS / ONLY / EXCEPT.',
            'Study the official Transport Canada references—this app is a supplement.',
            'Practice regularly in short sessions. Consistency beats cramming.',
          ],
    [tips]
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [items.length, intervalMs]);

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background/70 backdrop-blur">
      <div className="px-4 py-2 flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Tip
        </span>

        <div className="relative flex-1 overflow-hidden">
          <div
            key={idx}
            className="text-xs text-foreground/90 animate-in fade-in slide-in-from-bottom-2"
          >
            {items[idx]}
          </div>
        </div>

        <div className="text-[10px] tabular-nums text-muted-foreground">
          {idx + 1}/{items.length}
        </div>
      </div>
    </div>
  );
}
