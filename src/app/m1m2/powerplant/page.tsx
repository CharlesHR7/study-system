'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';

import AdvancedEngine, {
  DeckSection,
  RawQuestion,
} from '@/components/study/AdvancedEngine';

// metadata do módulo Powerplant
import metadata from '../../../../data/powerplant/metadata.json';

// imports estáticos dos arquivos JSON (necessário pro bundler)
import pp01 from '../../../../data/powerplant/01_reciprocating_engines.json';
import pp02 from '../../../../data/powerplant/02_fuel.json';
import pp03 from '../../../../data/powerplant/03_induction_exhaust.json';
import pp04 from '../../../../data/powerplant/04_ignition.json';
import pp05 from '../../../../data/powerplant/05_starting.json';
import pp06 from '../../../../data/powerplant/06_lubrication_cooling.json';
import pp07 from '../../../../data/powerplant/07_propellers.json';
import pp08 from '../../../../data/powerplant/08_removal_replacement.json';
import pp09 from '../../../../data/powerplant/09_fire.json';
import pp10 from '../../../../data/powerplant/10_maintenance_operation.json';
import pp11 from '../../../../data/powerplant/11_lsa_engines.json';
import pp12 from '../../../../data/powerplant/12_turbine_engines.json';
import pp13 from '../../../../data/powerplant/13_water_injection.json';

// Tipos para o metadata
type PowerplantSetMeta = {
  id: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  file: string;
  weight?: number;
};

type PowerplantMetadata = {
  module: string;
  moduleTitle?: string;
  moduleDescription?: string;
  submodules: {
    id: string;
    name: string;
    folder: string;
    sets: PowerplantSetMeta[];
  }[];
};

const powerplantMetadata = metadata as PowerplantMetadata;
const powerplantSubmodule = powerplantMetadata.submodules[0];

// Mapa de arquivos -> dados carregados
const fileMap: Record<string, RawQuestion[]> = {
  '01_reciprocating_engines.json': pp01 as RawQuestion[],
  '02_fuel.json': pp02 as RawQuestion[],
  '03_induction_exhaust.json': pp03 as RawQuestion[],
  '04_ignition.json': pp04 as RawQuestion[],
  '05_starting.json': pp05 as RawQuestion[],
  '06_lubrication_cooling.json': pp06 as RawQuestion[],
  '07_propellers.json': pp07 as RawQuestion[],
  '08_removal_replacement.json': pp08 as RawQuestion[],
  '09_fire.json': pp09 as RawQuestion[],
  '10_maintenance_operation.json': pp10 as RawQuestion[],
  '11_lsa_engines.json': pp11 as RawQuestion[],
  '12_turbine_engines.json': pp12 as RawQuestion[],
  '13_water_injection.json': pp13 as RawQuestion[],
};

// Gera as sections dinamicamente
const sections: DeckSection[] = powerplantSubmodule.sets.map((set) => ({
  id: set.id,
  title: set.name,
  shortTitle: set.shortTitle,
  subtitle: set.subtitle,
  weight: set.weight ?? 1,
  questions: fileMap[set.file] ?? [],
}));

export default function PowerplantPage() {
  return (
    <EntitlementGuard
      moduleKey="m1m2.powerplant"
      title={powerplantMetadata.moduleTitle ?? 'Powerplant – M1/M2'}
    >
      <AdvancedEngine
        moduleId="powerplant"
        moduleTitle={powerplantMetadata.moduleTitle ?? 'Powerplant – M1/M2'}
        moduleDescription={
          powerplantMetadata.moduleDescription ??
          'Reciprocating and turbine engines, fuel, ignition, lubrication, propellers, operation and fire protection.'
        }
        sections={sections}
        enableCredits={false}
        examCost={0}
        defaultTestQuestionCount={50}
      />
    </EntitlementGuard>
  );
}
