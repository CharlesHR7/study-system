// src/components/ModuleBlocked.tsx
import Link from "next/link";
import type { ModuleStatus } from "@/lib/moduleFlags";
import ModuleStatusBadge from "@/components/ModuleStatusBadge";

export default function ModuleBlocked({
  title,
  status,
  message,
  backHref = "/",
}: {
  title: string;
  status: ModuleStatus;
  message?: string;
  backHref?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">{title}</h1>
            <ModuleStatusBadge status={status} />
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {message ??
              "This module is not available right now. Please check back later."}
          </p>

          <div className="mt-6">
            <Link
              href={backHref}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 active:scale-[0.99]"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
