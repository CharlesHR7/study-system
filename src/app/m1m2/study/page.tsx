'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Plane, Lock, Unlock } from 'lucide-react';

import { hasModule } from '@/lib/entitlementsClient';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ModuleItem = {
  id: string;
  name: string;
  desc: string;
  href: string;
  moduleKey: string;
};

export default function M1M2StudyPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const modules: ModuleItem[] = [
    {
      id: 'stdp',
      name: 'Standard Practices (STDP)',
      desc: 'Safety, tools, corrosion, hardware, inspections, math and physics.',
      href: '/m1m2/standard-practices',
      moduleKey: 'm1m2.stdp',
    },
    {
      id: 'af',
      name: 'Airframe (AF)',
      desc: 'Structures, systems, controls, composites and rigging.',
      href: '/m1m2/airframe',
      moduleKey: 'm1m2.airframe',
    },
    {
      id: 'pp',
      name: 'Powerplant (PP)',
      desc: 'Engines, fuel, ignition, lubrication and operation.',
      href: '/m1m2/powerplant',
      moduleKey: 'm1m2.powerplant',
    },
    {
      id: 'regs',
      name: 'REGS – Regulatory Requirements',
      desc: 'CARs & Standards for AME licensing.',
      href: '/m1m2/regs',
      moduleKey: 'm1m2.regs',
    },
    {
      id: 'logbook',
      name: 'Logbook – Maintenance Experience',
      desc: 'Record tasks by ATA, aircraft and signatories.',
      href: '/m1m2/logbook',
      moduleKey: 'm1m2.logbook',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Plane className="h-3 w-3" />
              <span>M1 / M2 – Airplane & Helicopter</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              M1 / M2 – Study Modules
            </h1>
            <p className="text-sm text-muted-foreground">
              Unlock modules individually as you need them.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/m1m2" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Modules */}
        <Card>
          <CardContent className="space-y-2 pt-4">
            {modules.map((m) => {
              const unlocked = ready && hasModule(m.moduleKey);

              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!ready ? null : unlocked ? (
                      <Badge variant="secondary" className="gap-1">
                        <Unlock className="h-3 w-3" />
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    )}

                    {unlocked ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={m.href}>
                          Open <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm">
                        <Link href="/student">
                          Unlock <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
