'use client';

import EntitlementGuard from '@/components/EntitlementGuard';
import LogbookClientWrapper from './LogbookClientWrapper';

export default function Page() {
  return (
    <EntitlementGuard moduleKey="m1m2.logbook" title="M1/M2 Logbook">
      <LogbookClientWrapper />
    </EntitlementGuard>
  );
}
