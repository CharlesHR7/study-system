import "server-only";
import React from "react";
import type { LicenseId } from "@/lib/moduleFlags";
import { getEffectiveFlag } from "@/lib/moduleFlags";
import ModuleBlocked from "@/components/ModuleBlocked";

export default function ModuleGate({
  licenseId,
  moduleId,
  title,
  backHref,
  children,
}: {
  licenseId: LicenseId;
  moduleId?: string;
  title: string;
  backHref?: string;
  children: React.ReactNode;
}) {
  const flag = getEffectiveFlag(licenseId as any, moduleId as any);

  if (flag.status !== "active") {
    return (
      <ModuleBlocked
        title={title}
        status={flag.status}
        message={flag.message}
        backHref={backHref ?? "/"}
      />
    );
  }

  return <>{children}</>;
}
