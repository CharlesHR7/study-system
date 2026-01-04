import "server-only";
import ModuleGate from "@/lib/ModuleGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleGate
      licenseId="m1m2"
      moduleId="regs" // trocar conforme a pasta
      title="M1/M2 — Regulations"
      backHref="/m1m2"
    >
      {children}
    </ModuleGate>
  );
}
