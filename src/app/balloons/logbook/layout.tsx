import "server-only";
import ModuleGate from "@/lib/ModuleGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleGate
      licenseId="balloons"
      moduleId="logbook" // 🔁 AJUSTE CONFORME A PASTA
      title="Balloons"
      backHref="/balloons"
    >
      {children}
    </ModuleGate>
  );
}
