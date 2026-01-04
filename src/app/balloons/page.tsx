'use client';

import React from 'react';
import Link from 'next/link';
import { Wind, FileText, ArrowLeft, BookOpen, ClipboardList } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BalloonsMenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Wind className="h-3 w-3" />
              <span>Licence B – Balloons</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Balloons – Licence Home
            </h1>

            <p className="text-sm text-muted-foreground max-w-2xl">
              Study for BREGS and balloon operations/maintenance, plus a TC-style experience logbook for the B rating.
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
          <Link href="/balloons/study" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Balloons Study
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Question sets for BREGS, operations and maintenance of balloons.
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Build custom decks by section</li>
                  <li>Study in flashcard, practice or test mode</li>
                  <li>Review regulatory and operational requirements</li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Balloons Study
                </Button>
              </CardFooter>
            </Card>
          </Link>

          {/* Logbook */}
          <Link href="/balloons/logbook" className="block">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Balloons Logbook (B)
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  TC-style experience logbook for the B rating, aligned with sample tasks.
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-muted-foreground">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Envelope inspections and load tape checks</li>
                  <li>Parachute, vent, burner and fuel system tasks</li>
                  <li>Basket, instruments and technical records inspections</li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Open Balloons Logbook
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
