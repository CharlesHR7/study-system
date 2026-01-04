import "server-only";
import ModuleGate from "@/lib/ModuleGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleGate licenseId="m1m2" title="M1/M2" backHref="/">
      {children}
    </ModuleGate>
  );
}
