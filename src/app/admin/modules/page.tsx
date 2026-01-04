import "server-only";
import { notFound } from "next/navigation";

import { licenseFlags, moduleFlags } from "@/lib/moduleFlags";
import { getUserEmailServer } from "@/lib/getUserEmailServer";
import { isAdminEmail } from "@/lib/adminAuth";

import AdminModulesClient from "../ui/AdminModulesClient";

export default async function AdminModulesPage() {
  const email = await getUserEmailServer();
  if (!isAdminEmail(email)) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h1 className="text-2xl font-semibold">Admin — Module Control</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Two-layer gate: <b>License</b> → <b>Modules</b>. v1 saves by copying flags file.
          </p>
        </div>

        <AdminModulesClient
          initialLicenseFlags={licenseFlags as any}
          initialModuleFlags={moduleFlags as any}
        />
      </div>
    </div>
  );
}
