'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  User,
  ClipboardList,
  Info,
  Search,
  MessageSquare,
  ChevronRight,
  X,
  LifeBuoy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TipsTicker from '@/components/TipsTicker';

type PillProps = {
  title: string;
  href?: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

function PillButton({ title, href, icon, onClick }: PillProps) {
  const base =
    'w-full rounded-full px-5 py-4 border transition-all flex items-center justify-between gap-3 ' +
    'bg-slate-900/75 border-white/15 text-white hover:bg-slate-900/85 ' +
    'hover:translate-x-[1px] hover:shadow-md active:translate-x-0';

  const content = (
    <div className={base}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-white/70" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();

  const [qId, setQId] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  async function handleSearchById() {
    if (loading) return;

    const clean = qId.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(
        `/api/question-by-id?id=${encodeURIComponent(clean)}`
      );
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setErr('ID não encontrado. Exemplo: AF-0012');
        return;
      }

      router.push(`/question/${encodeURIComponent(clean)}`);
    } catch {
      setErr('Erro ao buscar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#0b1220] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div
          className="
            relative rounded-[48px] border border-white/10 shadow-xl overflow-hidden
            h-[calc(100dvh-2rem)] md:h-[calc(100dvh-4rem)]
          "
        >
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="/home/bg.png"
              alt="Aviation background"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061427]/85 via-[#061427]/50 to-[#1b1307]/65" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
              <div className="p-5 md:p-8">
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  {/* Logo */}
                  <div className="relative -left-6 -top-6 md:-left-8 md:-top-8 shrink-0">
                    <div className="h-[200px] w-[200px] md:h-[250px] md:w-[250px] rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 rounded-full border border-white/35 bg-white/10 backdrop-blur-md shadow-2xl" />
                      <div className="absolute inset-[12px] rounded-full border border-white/25" />
                      <div className="absolute inset-[22px] rounded-full border border-white/10" />
                      <div className="absolute inset-[18px] rounded-full bg-[#061427]/25" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="/home/logo.svg"
                          alt=""
                          className="absolute w-[92%] h-[92%] opacity-60 mix-blend-screen blur-[1.2px] pointer-events-none select-none"
                          draggable={false}
                        />
                        <img
                          src="/home/logo.svg"
                          alt="AME ONE"
                          className="w-[92%] h-[92%] opacity-95 mix-blend-screen drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)] pointer-events-none select-none"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Student Area */}
                  <div className="w-[260px] max-w-[75vw]">
                    <PillButton
                      title="Student Area"
                      href="/student"
                      icon={<User className="h-5 w-5 text-white" />}
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="mt-2 grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
                  <div className="h-[150px] md:h-[180px]" />

                  {/* RIGHT COLUMN */}
                  <div className="space-y-3">
                    {/* Core */}
                    <PillButton
                      title="Prepare for Written Test"
                      href="/study"
                      icon={<BookOpen className="h-5 w-5 text-white" />}
                    />

                    <PillButton
                      title="Logbook"
                      href="/m1m2/logbook"
                      icon={<ClipboardList className="h-5 w-5 text-white" />}
                    />

                    <PillButton
                      title={showSearch ? 'Close search' : 'Find a question'}
                      icon={
                        showSearch ? (
                          <X className="h-5 w-5 text-white" />
                        ) : (
                          <Search className="h-5 w-5 text-white" />
                        )
                      }
                      onClick={() => {
                        setShowSearch((v) => !v);
                        setErr(null);
                      }}
                    />

                    {showSearch && (
                      <div className="rounded-[24px] border border-white/12 bg-white/10 backdrop-blur p-3 space-y-2">
                        <div className="text-xs text-white/70">
                          Digite o ID (ex.:{' '}
                          <span className="font-mono">AF-0012</span>)
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={qId}
                            onChange={(e) => setQId(e.target.value)}
                            placeholder="AF-0012"
                            autoCapitalize="characters"
                            spellCheck={false}
                            disabled={loading}
                            onKeyDown={(e) =>
                              e.key === 'Enter' ? handleSearchById() : null
                            }
                            className="bg-white/10 border-white/15 text-white placeholder:text-white/45"
                          />
                          <Button
                            onClick={handleSearchById}
                            disabled={loading}
                          >
                            {loading ? '...' : 'Open'}
                          </Button>
                        </div>
                        {err && (
                          <p className="text-xs text-red-200">{err}</p>
                        )}
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="pt-2" />

                    {/* Feedback + Help */}
                    <PillButton
                      title="How was the exam?"
                      href="/feedback"
                      icon={<MessageSquare className="h-5 w-5 text-white" />}
                    />

                    <PillButton
                      title="App Instructions / FAQ"
                      href="/instructions"
                      icon={<Info className="h-5 w-5 text-white" />}
                    />

                    <PillButton
                      title="Support / Help"
                      href="/support"
                      icon={<LifeBuoy className="h-5 w-5 text-white" />}
                    />

                    <PillButton
                      title="About"
                      href="/about"
                      icon={<Info className="h-5 w-5 text-white" />}
                    />
                  </div>
                </div>

                <div className="h-4 md:h-6" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="shrink-0 p-3 md:p-4 border-t border-white/10 bg-white/10 backdrop-blur-md space-y-2">
              <div className="flex flex-wrap gap-1.5 text-white/80">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="/about">About</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="/instructions">Instructions</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="/support">Support</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href="/terms">Legal</Link>
                </Button>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/10 backdrop-blur p-2">
                <TipsTicker />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
