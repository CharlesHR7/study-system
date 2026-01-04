'use client';

import React from 'react';
import Link from 'next/link';
import { Hammer, FileText, ArrowLeft, BookOpen, ClipboardList } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StructuresMenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Hammer className="h-3 w-3" />
              <span>Licence S – Structures</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Structures – Licence Home
            </h1>

            <p className="text-sm text-muted-foreground max-w-2xl">
              Study modules for sheet metal, composites, wood/fabric, corrosion control, NDT and repairs—plus a TC-style logbook for the S rating.
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
          {/* Study */}
          <Link href="/structures/study" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Structures Study
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Question sets for standard practices, repairs and structures topics aligned with the S rating.
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Build custom decks by section</li>
                  <li>Practice, flashcards and test mode</li>
                  <li>Track performance by topic (later: mastery 0–5)</li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Structures Study
                </Button>
              </CardFooter>
            </Card>
          </Link>

          {/* Logbook */}
          <Link href="/structures/logbook" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Structures Logbook (S)
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  TC-style experience logbook for the S rating (tasks, signatories, print-ready).
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sheet metal, composites, wood &amp; fabric repairs</li>
                  <li>Corrosion control, sealing and fastener work</li>
                  <li>Signatories &amp; endorsement tracking</li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Structures Logbook
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>

        {/* Study note */}
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
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Use AME ONE to practice and reinforce your knowledge, but always study the official Transport Canada
              references for deeper understanding.
            </p>
            <p>
              Exam strategy: read the whole question, read all options, eliminate the most incorrect answers, then choose
              the best remaining option.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
