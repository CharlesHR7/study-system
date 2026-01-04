'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Coins,
  Check,
  Package,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm text-muted-foreground">
      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

function Row({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="flex justify-between border-b py-2 text-sm">
      <span className="text-muted-foreground">{left}</span>
      <span className="font-medium">{right}</span>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background">
              <ShieldCheck className="h-4 w-4" />
              Public page • No credits consumed
            </div>
            <h1 className="text-3xl font-bold mt-3">Pricing</h1>
            <p className="text-muted-foreground mt-1">
              <strong>Pay once. Study forever. Only what you need.</strong>
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        {/* Credit Packs */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Credit Packs
            </CardTitle>
            <CardDescription>Credits never expire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row left="Starter — 30 credits" right="$10" />
            <Row left="Student — 60 credits" right="$20" />
            <Row left="Professional — 120 credits" right="$40" />
            <Row left="Complete — 200 credits" right="$66" />
          </CardContent>
        </Card>

        {/* Individual Modules */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Individual Modules (À la carte)</CardTitle>
            <CardDescription>$10 each — Ideal for retakes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row left="Regulations (CARs)" right="30 credits — $10" />
            <Row left="Standard Practices" right="30 credits — $10" />
            <Row left="Airframe" right="30 credits — $10" />
            <Row left="Powerplant" right="30 credits — $10" />
            <Row left="Avionics – Systems" right="30 credits — $10" />
            <Row left="Structures – Study" right="30 credits — $10" />
            <Row left="Balloons – Study" right="30 credits — $10" />

            <div className="pt-3 space-y-1">
              <Feature>Targeted preparation</Feature>
              <Feature>No subscription</Feature>
            </div>
          </CardContent>
        </Card>

        {/* License Based */}
        <Card className="rounded-2xl border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle>License-Based Access (Most Popular)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">✈️ M1 or M2 License</h3>
              <Feature>Regs, STDP, Airframe, Powerplant</Feature>
              <Feature>Study / Practice / Test</Feature>
              <p className="font-medium mt-1">120 credits — $40</p>
            </div>

            <div>
              <h3 className="font-semibold">📡 E – Avionics</h3>
              <Feature>Standard Practices + Systems</Feature>
              <Feature>Study / Practice / Test</Feature>
              <p className="font-medium mt-1">60 credits — $20</p>
            </div>

            <div>
              <h3 className="font-semibold">🧱 S – Structures</h3>
              <Feature>Study / Practice / Test</Feature>
              <p className="font-medium mt-1">30 credits — $10</p>
            </div>

            <div>
              <h3 className="font-semibold">🎈 Balloons</h3>
              <Feature>Study / Practice / Test</Feature>
              <p className="font-medium mt-1">30 credits — $10</p>
            </div>
          </CardContent>
        </Card>

        {/* Logbook */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Logbook — Optional Add-on
            </CardTitle>
            <CardDescription>Not required for study</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Feature>TC-style logbook</Feature>
            <Feature>Multi-license (M1/M2/E/S/B)</Feature>
            <Feature>Unlimited export & print</Feature>
            <p className="font-medium pt-2">30 credits — $10 (one-time)</p>
          </CardContent>
        </Card>

        {/* Bundles */}
        <Card className="rounded-2xl border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Bundles (Best Value)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row left="Basic Bundle (any 2 modules)" right="50 credits — $16.50" />
            <Row left="M1/M2 (study only)" right="120 credits — $40" />
            <Row left="M1/M2 + E" right="160 credits — $53" />
            <Row left="M1/M2 + S" right="140 credits — $46" />
            <Row
              left="Complete (All + Logbook)"
              right="200 credits — $66"
            />
          </CardContent>
        </Card>

        {/* Free */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>What’s Free (Always)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Feature>Instructions / FAQ</Feature>
            <Feature>How to Become an AME (Canada)</Feature>
            <Feature>Support & Feedback</Feature>
            <Feature>Question by ID</Feature>
            <Feature>Logbook preview</Feature>
          </CardContent>
        </Card>

        {/* Comparison */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Reality Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row left="Subscription app (12 months)" right="~$360" />
            <Row left="AME ONE (Complete)" right="$66 one-time" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
