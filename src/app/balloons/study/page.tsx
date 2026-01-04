'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';

import Link from 'next/link';
import { ArrowLeft, Wind } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import AdvancedEngine, {
  DeckSection,
  RawQuestion,
} from '@/components/study/AdvancedEngine';

// JSON de questões de Balloons
import balloonRegs from '../../../../data/balloons/01_balloon_regs.json';

// Uma única seção por enquanto (Regulations)
const sections: DeckSection[] = [
  {
    id: 'b01',
    title: '01 – Balloon Regulations & Procedures',
    shortTitle: 'Regs',
    subtitle:
      'Regulatory requirements (BREGS), operations and maintenance for balloons.',
    weight: 1,
    questions: balloonRegs as RawQuestion[],
  },
];

export default function BalloonsStudyPage() {
  return (
    <EntitlementGuard
      moduleKey="balloons.study"
      title="Balloons – Study Module"
    >
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Wind className="h-3 w-3" />
                <span>Licence B – Balloons</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Balloons – Study Module
              </h1>
              <p className="text-sm text-muted-foreground">
                Balloon operations, maintenance and licence-B specific regulations.
              </p>
            </div>

            {/* Volta para o menu de Balloons */}
            <Link href="/balloons">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          {/* Motor de estudo */}
          <Card>
            <CardHeader>
              <CardTitle>Balloon Regulations – Question Deck</CardTitle>
              <CardDescription>
                Build a deck with balloon regulations and study in Flashcard,
                Practice or Test mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedEngine
                moduleId="balloons"
                moduleTitle="Balloons – Licence B"
                moduleDescription="Question bank focused on balloon regulatory requirements (BREGS) and associated maintenance/operational requirements."
                sections={sections}
                enableCredits={false}
                examCost={0}
                defaultTestQuestionCount={25}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </EntitlementGuard>
  );
}
