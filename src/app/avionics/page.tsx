'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, BookOpen, ClipboardList, FileText } from 'lucide-react';

import avionicsMetadata from '../../../data/avionics/metadata.json';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const submodules = avionicsMetadata.submodules;

export default function AvionicsPage() {
  const getDescription = (id: string) => {
    switch (id) {
      case 'avionics_sp':
        return 'Science & math, standard practices, wiring, tools, basic systems, electricity/electronics, corrosion & NDT for the SPE – Standard Practices Avionics exam.';
      case 'avionics_sys':
        return 'Communication, navigation, surveillance, autopilot, instruments, power distribution and troubleshooting for the E – Avionics rating exam.';
      default:
        return 'Question sets for this avionics submodule.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Radio className="h-3 w-3" />
              <span>Licence E – Avionics</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Avionics – Licence Home
            </h1>

            <p className="text-sm text-muted-foreground max-w-2xl">
              Standard Practices and Avionics Systems question banks, plus a TC-style experience logbook for the E rating.
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
          {/* Study Hub shortcut (optional, if you create /avionics/study later) */}
          <Link href="/avionics/systems" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Start studying (quick entry)
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Jump directly into your avionics question sets.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Practice, flashcards and test mode</li>
                  <li>Fast navigation by submodule</li>
                  <li>Later: credit-based access control</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open study content
                </Button>
              </CardFooter>
            </Card>
          </Link>

          {/* Logbook */}
          <Link href="/avionics/logbook" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Avionics Logbook (E)
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  TC-style experience logbook for the E rating (tasks, signatories, print-ready).
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>All sample tasks from TC</li>
                  <li>Signatory information table</li>
                  <li>Print/export ready for submission</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Logbook
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>

        {/* Direct submodules */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">Study submodules</h2>
          <p className="text-xs text-muted-foreground">
            Choose one of the avionics submodules below.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {submodules.map((sub: any) => (
              <Link key={sub.id} href={`/avionics/${sub.folder}`} className="block">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">{sub.name}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      {getDescription(sub.id)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-xs text-muted-foreground">
                    <p>Includes multiple JSON question sets:</p>
                    <ul className="mt-1 list-disc pl-4 space-y-1">
                      {sub.sets.slice(0, 3).map((set: any) => (
                        <li key={set.id}>{set.name}</li>
                      ))}
                      {sub.sets.length > 3 && <li>…and more</li>}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Open {sub.name}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              How this module works
            </CardTitle>
            <CardDescription className="text-xs">
              JSON question files → AdvancedEngine (practice, flashcards, test mode) + dedicated TC-style logbook for E rating experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Each study submodule reads its own JSON files inside{' '}
              <code>/data/avionics/standard-practices</code> and{' '}
              <code>/data/avionics/systems</code>.
            </p>
            <p>
              The Avionics Logbook uses a Transport Canada–style layout to record your
              E rating experience in a format that is easy to review and export.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
