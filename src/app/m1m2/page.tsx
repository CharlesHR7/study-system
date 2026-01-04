'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  FileText,
  ArrowLeft,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Plane,
  Cog,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import ModuleShortcutCard from '@/components/ModuleShortcutCard';

export default function M1M2MenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Wrench className="h-3 w-3" />
              <span>Licence M1/M2 – Airplane &amp; Helicopter</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              M1/M2 – Licence Home
            </h1>

            <p className="text-sm text-muted-foreground max-w-2xl">
              Jump straight into your study modules (STDP, Airframe, Powerplant, Regs) or open the TC-style logbook.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/study" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Primary actions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Study hub (free navigation) */}
          <Link href="/m1m2/study" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Study Hub (M1/M2)
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Central place to practice, run quizzes, and navigate topics.
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>See what modules exist (locked/unlocked)</li>
                  <li>Use the Unlock button when needed</li>
                  <li>Open modules instantly when unlocked</li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Study Hub
                </Button>
              </CardFooter>
            </Card>
          </Link>

          {/* Logbook (paid module) */}
          <ModuleShortcutCard
            title="Logbook (M1/M2)"
            description="Maintenance experience logbook aligned with TC sample tasks."
            href="/m1m2/logbook"
            moduleKey="m1m2.logbook"
            icon={<ClipboardList className="h-4 w-4" />}
          />
        </div>

        {/* Direct module shortcuts */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">Direct module shortcuts</h2>
          <p className="text-xs text-muted-foreground">
            If you already know what you want, jump straight in.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <ModuleShortcutCard
              title="Standard Practices (STDP)"
              description="Hardware, tools, processes, measurements and best practices."
              href="/m1m2/standard-practices"
              moduleKey="m1m2.stdp"
              icon={<Cog className="h-4 w-4" />}
            />

            <ModuleShortcutCard
              title="Airframe (AF)"
              description="Structures, flight controls, systems, and airframe maintenance topics."
              href="/m1m2/airframe"
              moduleKey="m1m2.airframe"
              icon={<Plane className="h-4 w-4" />}
            />

            <ModuleShortcutCard
              title="Powerplant (PP)"
              description="Engines, fuel & lubrication systems, ignition, starting and performance."
              href="/m1m2/powerplant"
              moduleKey="m1m2.powerplant"
              icon={<Wrench className="h-4 w-4" />}
            />

            <ModuleShortcutCard
              title="Regulatory Requirements (CARs / REGS)"
              description="Regulations & standards relevant to AME licensing and maintenance."
              href="/m1m2/regs"
              moduleKey="m1m2.regs"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* Small note */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Study note
              </CardTitle>
              <CardDescription className="text-xs">
                This platform is a supplement—not a replacement—for official references.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Many questions are inspired by real exam style, but you should always study the official Transport Canada
                materials for deeper understanding.
              </p>
              <p>
                Exam strategy: read the whole question, read all options, eliminate the most incorrect answers, then choose
                the best remaining option.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
