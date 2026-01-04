import "server-only";
import ModuleGate from "@/lib/ModuleGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleGate licenseId="balloons" title="Balloons" backHref="/">
      {children}
    </ModuleGate>
  );
}
