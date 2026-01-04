'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coins, Lock, Unlock, User, CheckCircle2, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type LicenceKey = 'm1m2' | 'avionics' | 'structures' | 'balloons';

type EntitlementsByLicence = Record<string, boolean>;
type Entitlements = Record<LicenceKey, EntitlementsByLicence>;

const STORAGE_KEY = 'ameone_student_v1';

function loadState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { credits: number; entitlements: Entitlements };
  } catch {
    return null;
  }
}

function saveState(state: { credits: number; entitlements: Entitlements }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function StudentPage() {
  const [credits, setCredits] = useState<number>(0);
  const [entitlements, setEntitlements] = useState<Entitlements>({
    m1m2: { stdp: false, airframe: false, powerplant: false, regs: false, logbook: false },
    avionics: { sp: false, systems: false, logbook: false },
    structures: { study: false, logbook: false },
    balloons: { study: false, logbook: false },
  });

  const licences = useMemo(() => {
    return [
      {
        key: 'm1m2' as const,
        name: 'M1/M2',
        desc: 'Unlock only what you need: STDP, Airframe, Powerplant, REGS and Logbook.',
        modules: [
          { key: 'stdp', name: 'Standard Practices (STDP)', cost: 3, href: '/m1m2/standard-practices', hint: 'Tools, hardware, corrosion, inspection, math/physics.' },
          { key: 'airframe', name: 'Airframe (AF)', cost: 4, href: '/m1m2/airframe', hint: 'Structures, systems, controls, rigging.' },
          { key: 'powerplant', name: 'Powerplant (PP)', cost: 4, href: '/m1m2/powerplant', hint: 'Engines, fuel, ignition, lubrication, performance.' },
          { key: 'regs', name: 'Regulatory Requirements (REGS)', cost: 3, href: '/m1m2/regs', hint: 'CARs/Standards + exam-style questions.' },
          { key: 'logbook', name: 'Logbook (M1/M2)', cost: 2, href: '/m1m2/logbook', hint: 'TC-style experience logbook + signatories.' },
        ],
        bundleCost: 12, // soma 16 -> bundle 12
      },
      {
        key: 'avionics' as const,
        name: 'Avionics (E)',
        desc: 'Unlock Standard Practices, Systems, and the E logbook separately.',
        modules: [
          { key: 'sp', name: 'Avionics Standard Practices (SPE)', cost: 3, href: '/avionics/standardPractices', hint: 'Wiring, tools, basic theory, corrosion/NDT.' },
          { key: 'systems', name: 'Avionics Systems & Theory', cost: 4, href: '/avionics/systems', hint: 'Com/Nav, instruments, autopilot, troubleshooting.' },
          { key: 'logbook', name: 'Logbook (E)', cost: 2, href: '/avionics/logbook', hint: 'TC-style E rating tasks + signatories.' },
        ],
        bundleCost: 7, // soma 9 -> bundle 7
      },
      {
        key: 'structures' as const,
        name: 'Structures (S)',
        desc: 'Unlock the Structures study module and the S logbook.',
        modules: [
          { key: 'study', name: 'Structures Study', cost: 4, href: '/structures/study', hint: 'Sheet metal, composites, wood/fabric, corrosion, NDT.' },
          { key: 'logbook', name: 'Logbook (S)', cost: 2, href: '/structures/logbook', hint: 'TC-style S rating tasks + signatories.' },
        ],
        bundleCost: 5, // soma 6 -> bundle 5
      },
      {
        key: 'balloons' as const,
        name: 'Balloons (B)',
        desc: 'Unlock BREGS study and the Balloon logbook.',
        modules: [
          { key: 'study', name: 'Balloons Study (BREGS)', cost: 3, href: '/balloons/study', hint: 'Regulations and balloon operations/maintenance.' },
          { key: 'logbook', name: 'Logbook (B)', cost: 2, href: '/balloons/logbook', hint: 'TC-style B rating tasks + signatories.' },
        ],
        bundleCost: 4, // soma 5 -> bundle 4
      },
    ] as const;
  }, []);

  useEffect(() => {
    const s = loadState();
    if (!s) {
      const initial = {
        credits: 10,
        entitlements: {
          m1m2: { stdp: false, airframe: false, powerplant: false, regs: false, logbook: false },
          avionics: { sp: false, systems: false, logbook: false },
          structures: { study: false, logbook: false },
          balloons: { study: false, logbook: false },
        },
      };
      saveState(initial);
      setCredits(initial.credits);
      setEntitlements(initial.entitlements);
      return;
    }

    // compat: se vier do modelo antigo (boolean por licença), reseta pro novo
    const looksOld =
      typeof (s as any)?.entitlements?.m1m2 === 'boolean' ||
      typeof (s as any)?.entitlements?.avionics === 'boolean';

    if (looksOld) {
      const migrated = {
        credits: s.credits ?? 10,
        entitlements: {
          m1m2: { stdp: false, airframe: false, powerplant: false, regs: false, logbook: false },
          avionics: { sp: false, systems: false, logbook: false },
          structures: { study: false, logbook: false },
          balloons: { study: false, logbook: false },
        },
      };
      saveState(migrated);
      setCredits(migrated.credits);
      setEntitlements(migrated.entitlements);
      return;
    }

    setCredits(s.credits);
    setEntitlements(s.entitlements);
  }, []);

  const addCredits = (amount: number) => {
    const next = credits + amount;
    setCredits(next);
    saveState({ credits: next, entitlements });
  };

  const isUnlocked = (licence: LicenceKey, moduleKey: string) => {
    return !!entitlements?.[licence]?.[moduleKey];
  };

  const unlockModule = (licence: LicenceKey, moduleKey: string, cost: number) => {
    if (isUnlocked(licence, moduleKey)) return;

    if (credits < cost) {
      alert('Not enough credits. Add credits first (demo).');
      return;
    }

    const nextCredits = credits - cost;
    const nextEntitlements: Entitlements = {
      ...entitlements,
      [licence]: { ...entitlements[licence], [moduleKey]: true },
    };

    setCredits(nextCredits);
    setEntitlements(nextEntitlements);
    saveState({ credits: nextCredits, entitlements: nextEntitlements });
  };

  const unlockBundle = (licence: LicenceKey, bundleCost: number) => {
    const licenceDef = licences.find((l) => l.key === licence);
    if (!licenceDef) return;

    const lockedModules = licenceDef.modules.filter((m) => !isUnlocked(licence, m.key));
    if (lockedModules.length === 0) return;

    const sumLocked = lockedModules.reduce((acc, m) => acc + m.cost, 0);
    const costToCharge = Math.min(bundleCost, sumLocked);

    if (credits < costToCharge) {
      alert('Not enough credits. Add credits first (demo).');
      return;
    }

    const nextCredits = credits - costToCharge;
    const nextLicenceEnt = { ...entitlements[licence] };
    lockedModules.forEach((m) => (nextLicenceEnt[m.key] = true));

    const nextEntitlements: Entitlements = {
      ...entitlements,
      [licence]: nextLicenceEnt,
    };

    setCredits(nextCredits);
    setEntitlements(nextEntitlements);
    saveState({ credits: nextCredits, entitlements: nextEntitlements });
  };

  const resetDemo = () => {
    const initial = {
      credits: 10,
      entitlements: {
        m1m2: { stdp: false, airframe: false, powerplant: false, regs: false, logbook: false },
        avionics: { sp: false, systems: false, logbook: false },
        structures: { study: false, logbook: false },
        balloons: { study: false, logbook: false },
      },
    };
    saveState(initial);
    setCredits(initial.credits);
    setEntitlements(initial.entitlements);
  };

  const totals = useMemo(() => {
    const total = licences.reduce((acc, l) => acc + l.modules.length, 0);
    const unlocked = licences.reduce((acc, l) => {
      return acc + l.modules.filter((m) => isUnlocked(l.key, m.key)).length;
    }, 0);
    return { total, unlocked };
  }, [licences, entitlements]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <User className="h-3 w-3" />
              <span>Student Area</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Study Dashboard</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Credits unlock modules individually. Licence pages stay visible so you can preview what exists.
              (Demo: localStorage — later we’ll connect login + database.)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={resetDemo}>
              Reset demo
            </Button>
          </div>
        </div>

        {/* Credits + overall status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Credits
              </CardTitle>
              <CardDescription className="text-xs">
                Credits are used to unlock modules (demo values).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <div className="text-3xl font-bold tabular-nums">{credits}</div>
                <div className="text-xs text-muted-foreground">available credits</div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => addCredits(5)}>+5</Button>
                <Button variant="outline" size="sm" onClick={() => addCredits(10)}>+10</Button>
                <Button variant="outline" size="sm" onClick={() => addCredits(25)}>+25</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
              <CardDescription className="text-xs">Unlocked modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall</span>
                <Badge className="gap-1" variant="secondary">
                  <CheckCircle2 className="h-3 w-3" />
                  {totals.unlocked}/{totals.total}
                </Badge>
              </div>

              {licences.map((l) => {
                const unlocked = l.modules.filter((m) => isUnlocked(l.key, m.key)).length;
                return (
                  <div key={l.key} className="flex items-center justify-between">
                    <span className="text-sm">{l.name}</span>
                    <Badge variant="outline">{unlocked}/{l.modules.length}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Licences -> modules */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">Unlock modules</h2>
          <p className="text-xs text-muted-foreground">
            You can unlock modules one by one, or unlock the whole licence bundle with a discount.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {licences.map((l) => {
              const licenceUnlockedCount = l.modules.filter((m) => isUnlocked(l.key, m.key)).length;
              const allUnlocked = licenceUnlockedCount === l.modules.length;

              return (
                <Card key={l.key} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span>{l.name}</span>

                      {allUnlocked ? (
                        <Badge className="gap-1" variant="secondary">
                          <Unlock className="h-3 w-3" />
                          All unlocked
                        </Badge>
                      ) : (
                        <Badge className="gap-1" variant="outline">
                          <Lock className="h-3 w-3" />
                          {licenceUnlockedCount}/{l.modules.length}
                        </Badge>
                      )}
                    </CardTitle>

                    <CardDescription className="text-xs">{l.desc}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Bundle */}
                    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Unlock bundle
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Discounted unlock for remaining modules.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{l.bundleCost} credits</Badge>
                        <Button
                          size="sm"
                          disabled={allUnlocked}
                          onClick={() => unlockBundle(l.key, l.bundleCost)}
                        >
                          Unlock
                        </Button>
                      </div>
                    </div>

                    {/* Modules list */}
                    <div className="space-y-2">
                      {l.modules.map((m) => {
                        const unlocked = isUnlocked(l.key, m.key);

                        return (
                          <div
                            key={m.key}
                            className="flex items-center justify-between gap-3 rounded-lg border p-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{m.name}</span>
                                {unlocked ? (
                                  <Badge className="gap-1" variant="secondary">
                                    <Unlock className="h-3 w-3" />
                                    Unlocked
                                  </Badge>
                                ) : (
                                  <Badge className="gap-1" variant="outline">
                                    <Lock className="h-3 w-3" />
                                    Locked
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{m.hint}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{m.cost}</Badge>

                              <Button asChild size="sm" variant="outline">
                                <Link href={m.href}>Open</Link>
                              </Button>

                              <Button
                                size="sm"
                                variant={unlocked ? 'outline' : 'default'}
                                disabled={unlocked}
                                onClick={() => unlockModule(l.key, m.key, m.cost)}
                              >
                                Unlock
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/${l.key}`}>Open licence page</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href="/study">Study hub</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
