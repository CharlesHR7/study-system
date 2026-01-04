'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const STORAGE_KEY = 'ameone_student_v1';

/**
 * moduleKey examples:
 *  - "m1m2.stdp"
 *  - "m1m2.airframe"
 *  - "m1m2.powerplant"
 *  - "m1m2.regs"
 *  - "m1m2.logbook"
 *  - "avionics.sp"
 *  - "avionics.systems"
 *  - "avionics.logbook"
 *  - "structures.study"
 *  - "structures.logbook"
 *  - "balloons.study"
 *  - "balloons.logbook"
 */
function getEntitlement(moduleKey: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);

    const [licence, mod] = moduleKey.split('.');
    if (!licence || !mod) return false;

    return !!parsed?.entitlements?.[licence]?.[mod];
  } catch {
    return false;
  }
}

export default function EntitlementGuard({
  moduleKey,
  title,
  children,
}: {
  moduleKey: string;
  title: string;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const ok = getEntitlement(moduleKey);
    setAllowed(ok);
    setReady(true);
  }, [moduleKey]);

  if (!ready) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Locked: {title}
              </CardTitle>
              <CardDescription className="text-xs">
                This module requires credits. Unlock it in the Student Area.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Go to Student Area to unlock this specific module.
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/study">Back to Study Hub</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href="/student" className="flex items-center justify-center gap-2">
                  Go to Student <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
