'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };

function toSvgPath(strokes: Point[][]) {
  // Converte strokes em SVG path (bezier simples)
  const parts: string[] = [];

  for (const stroke of strokes) {
    if (stroke.length < 2) continue;

    parts.push(`M ${stroke[0].x.toFixed(2)} ${stroke[0].y.toFixed(2)}`);

    for (let i = 1; i < stroke.length; i++) {
      const p = stroke[i];
      parts.push(`L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
    }
  }

  return parts.join(' ');
}

export default function SignaturePad({
  initialSvg,
  onSaveSvg,
  height = 180,
}: {
  initialSvg?: string | null;
  onSaveSvg: (svg: string) => void;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [size, setSize] = useState({ w: 700, h: height });

  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth ?? 700;
      setSize({ w, h: height });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [height]);

  const redraw = (allStrokes: Point[][], curr: Point[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // border
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

    // strokes
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const drawStroke = (s: Point[]) => {
      if (s.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
      ctx.stroke();
    };

    allStrokes.forEach(drawStroke);
    drawStroke(curr);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.w * devicePixelRatio;
    canvas.height = size.h * devicePixelRatio;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    redraw(strokes, current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h]);

  useEffect(() => {
    redraw(strokes, current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, current]);

  const getPoint = (e: PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrent([getPoint(e.nativeEvent)]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setCurrent((prev) => [...prev, getPoint(e.nativeEvent)]);
  };

  const onPointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokes((prev) => [...prev, current]);
    setCurrent([]);
  };

  const clear = () => {
    setStrokes([]);
    setCurrent([]);
  };

  const svg = useMemo(() => {
    const w = size.w;
    const h = size.h;
    const path = toSvgPath(strokes);

    // SVG simples e “printável”
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <path d="${path}" fill="none" stroke="#111827" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
  }, [strokes, size.w, size.h]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="text-[12px] text-gray-700 mb-2">
        Draw your signature below (use finger/stylus).
      </div>

      <canvas
        ref={canvasRef}
        className="w-full touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 text-[12px]"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={() => onSaveSvg(svg)}
          className="px-3 py-1 rounded border border-gray-800 bg-gray-900 text-white hover:bg-black text-[12px]"
        >
          Save signature
        </button>
      </div>

      {initialSvg ? (
        <div className="mt-3">
          <div className="text-[11px] text-gray-600 mb-1">Current saved signature (preview):</div>
          {/* preview do SVG salvo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="border border-gray-300 bg-white"
            src={`data:image/svg+xml;utf8,${encodeURIComponent(initialSvg)}`}
          />
        </div>
      ) : null}
    </div>
  );
}
