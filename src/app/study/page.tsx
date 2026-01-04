'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plane, Radio, Wrench, Wind, ArrowLeft, Lock, Unlock, User } from 'lucide-react';

import { hasModule } from '@/lib/entitlementsClient';
import TickerTips from '@/components/TickerTips';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card';

type Item = {
  name: string;
  desc: string;
  href: string;
  // “licence preview” não é bloqueado, mas queremos mostrar status de módulos principais
  statusKeys: string[]; // moduleKeys que “representam” aquela licença
};

export default function StudyChooserPage() {
  const [ready, setReady] = useState(false);

  // Dicas do letreiro (você troca quando quiser)
  const tips = [
    'Bring pencil, eraser and a basic calculator to the exam.',
    'Read the full question first, then read ALL options.',
    'Eliminate the most incorrect answers before choosing.',
    'Study official Transport Canada references for deep understanding.',
    'Use flashcards for memory + practice mode for speed.',
  ];

  const items: Item[] = [
    {
      name: 'M1 / M2 – Airplane & Helicopter',
      desc: 'Standard Practices, Airframe, Powerplant, REGS and Logbook.',
      href: '/m1m2',
      statusKeys: ['m1m2.stdp', 'm1m2.airframe', 'm1m2.powerplant', 'm1m2.regs', 'm1m2.logbook'],
    },
    {
      name: 'E – Avionics',
      desc: 'Standard Practices, Systems & Theory and Logbook.',
      href: '/avionics',
      statusKeys: ['avionics.sp', 'avionics.systems', 'avionics.logbook'],
    },
    {
      name: 'S – Structures',
      desc: 'Structures study module and Logbook.',
      href: '/structures',
      statusKeys: ['structures.study', 'structures.logbook'],
    },
    {
      name: 'B – Balloons',
      desc: 'BREGS study and Logbook.',
      href: '/balloons',
      statusKeys: ['balloons.study', 'balloons.logbook'],
    },
  ];

  useEffect(() => setReady(true), []);

  const calcStatus = (keys: string[]) => {
    if (!ready) return { unlocked: 0, total: keys.length };
    const unlocked = keys.filter((k) => hasModule(k)).length;
    return { unlocked, total: keys.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navbar */}
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Study Hub</h1>
            <p className="text-sm text-muted-foreground">
              Choose your licence. Modules show lock status based on your credits/unlocks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/student" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student
              </Link>
            </Button>
          </div>
        </div>

        {/* Ticker */}
        <TickerTips tips={tips} />

        {/* Licence cards */}
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((it) => {
            const { unlocked, total } = calcStatus(it.statusKeys);
            const allUnlocked = ready && unlocked === total;

            // ícone por licença (só visual)
            const Icon =
              it.name.startsWith('M1') ? Plane :
              it.name.startsWith('E') ? Radio :
              it.name.startsWith('S') ? Wrench :
              Wind;

            return (
              <Link key={it.href} href={it.href} className="block">
                <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {it.name}
                      </span>

                      {!ready ? (
                        <Badge variant="outline">…</Badge>
                      ) : allUnlocked ? (
                        <Badge variant="secondary" className="gap-1">
                          <Unlock className="h-3 w-3" />
                          Unlocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          {unlocked}/{total}
                        </Badge>
                      )}
                    </CardTitle>

                    <CardDescription className="text-xs">
                      {it.desc}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Open
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Disclaimer / exam strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Study Disclaimer & Exam Strategy</CardTitle>
            <CardDescription className="text-xs">
              This platform is a supplement — not a replacement — for official references.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Some questions are inspired by real exam style. For best results, always study the official
              Transport Canada materials for deeper understanding.
            </p>
            <p>
              Strategy: read the full question, read all options, eliminate the most incorrect answers, then choose
              the best remaining option.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
