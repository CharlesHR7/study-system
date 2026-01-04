// src/lib/moduleFlags.ts
export type ModuleStatus = "active" | "coming_soon" | "maintenance";
export type Flag = { status: ModuleStatus; message?: string };

export const licenseFlags = {
  m1m2: { status: "coming_soon", message: "Coming soon — we’re building this license now." },
  avionics: { status: "coming_soon", message: "Coming soon — we’re building this license now." },
  structures: { status: "coming_soon", message: "Coming soon — we’re building this license now." },
  balloons: { status: "coming_soon", message: "Coming soon — we’re building this license now." },
} as const satisfies Record<string, Flag>;

export const moduleFlags = {
  m1m2: {
    "regs": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "powerplant": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "airframe": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "standard-practices": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "logbook": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
  },
  avionics: {
    "systems": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "standard-Practices": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "logbook": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
  },
  structures: {
    "study": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "logbook": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
  },
  balloons: {
    "study": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
    "logbook": { status: "coming_soon", message: "Coming soon — we’re building this module now." },
  },
} as const satisfies Record<string, Record<string, Flag>>;

export type LicenseId = keyof typeof licenseFlags;
export type ModuleId<L extends LicenseId> = keyof (typeof moduleFlags)[L];

export function getLabel(status: ModuleStatus) {
  if (status === "active") return "Active";
  if (status === "coming_soon") return "Coming soon";
  return "Under maintenance";
}
export const getModuleLabel = getLabel;

export function getLicenseFlag(license: LicenseId): Flag {
  return licenseFlags[license];
}

export function getModuleFlag<L extends LicenseId>(license: L, module: ModuleId<L>): Flag {
  return (moduleFlags[license] as any)[module] as Flag;
}

export function getEffectiveFlag<L extends LicenseId>(license: L, module?: ModuleId<L>): Flag {
  const lic = getLicenseFlag(license);
  if (lic.status !== "active") return lic;
  if (!module) return lic;
  return getModuleFlag(license, module);
}