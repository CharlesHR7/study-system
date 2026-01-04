'use client';

import React from 'react';

export default function TickerTips({
  tips,
}: {
  tips: string[];
}) {
  // duplica para looping “infinito”
  const items = [...tips, ...tips];

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background">
      <div className="relative flex">
        <div className="animate-[ticker_28s_linear_infinite] whitespace-nowrap py-2">
          {items.map((t, idx) => (
            <span key={idx} className="mx-6 text-xs text-muted-foreground">
              • {t}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
