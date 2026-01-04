// src/components/ModuleStatusBadge.tsx
import React from "react";
import type { ModuleStatus } from "@/lib/moduleFlags";
import { getModuleLabel } from "@/lib/moduleFlags";

export default function ModuleStatusBadge({ status }: { status: ModuleStatus }) {
  const label = getModuleLabel(status);

  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  const cls =
    status === "coming_soon"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : status === "maintenance"
      ? "border-red-500/30 bg-red-500/10 text-red-200"
      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";

  return <span className={`${base} ${cls}`}>{label}</span>;
}
