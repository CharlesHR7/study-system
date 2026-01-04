'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Unlock } from 'lucide-react';

import { hasModule } from '@/lib/entitlementsClient';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ModuleShortcutCard({
  title,
  description,
  href,
  moduleKey,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  moduleKey: string;
  icon?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const unlocked = ready && hasModule(moduleKey);

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>

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
        </CardTitle>

        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>

      <CardFooter className="pt-0">
        {unlocked ? (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={href}>Open</Link>
          </Button>
        ) : (
          <Button asChild size="sm" className="w-full">
            <Link href="/student">Unlock</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
