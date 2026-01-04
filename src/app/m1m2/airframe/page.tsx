'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';

import AdvancedEngine, {
  DeckSection,
  RawQuestion,
} from '@/components/study/AdvancedEngine';

// metadata do módulo Airframe
import metadata from '../../../../data/airframe/metadata.json';

// imports estáticos dos arquivos JSON (necessário pro bundler)
import af00 from '../../../../data/airframe/00_aerodynamics.json';
import af01 from '../../../../data/airframe/01_structures.json';
import af02 from '../../../../data/airframe/02_rigging.json';
import af03 from '../../../../data/airframe/03_fabric.json';
import af04 from '../../../../data/airframe/04_metal_repair.json';
import af05 from '../../../../data/airframe/05_welding.json';
import af06 from '../../../../data/airframe/06_wood_repair.json';
import af07 from '../../../../data/airframe/07_composites.json';
import af08 from '../../../../data/airframe/08_painting.json';
import af09 from '../../../../data/airframe/09_electrical.json';
import af10 from '../../../../data/airframe/10_instruments_autopilot.json';
import af11 from '../../../../data/airframe/11_comm_nav.json';
import af12 from '../../../../data/airframe/12_hydraulics.json';
import af13 from '../../../../data/airframe/13_landing_gear.json';
import af14 from '../../../../data/airframe/14_fuel.json';
import af15 from '../../../../data/airframe/15_ice_rain.json';
import af16 from '../../../../data/airframe/16_environmental.json';
import af17 from '../../../../data/airframe/17_fire.json';

// Tipos para o metadata
type AirframeSetMeta = {
  id: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  file: string;
  weight?: number;
};

type AirframeMetadata = {
  module: string;
  moduleTitle?: string;
  moduleDescription?: string;
  submodules: {
    id: string;
    name: string;
    folder: string;
    sets: AirframeSetMeta[];
  }[];
};

const airframeMetadata = metadata as AirframeMetadata;
const airframeSubmodule = airframeMetadata.submodules[0];

// Mapa de arquivos -> dados carregados
const fileMap: Record<string, RawQuestion[]> = {
  '00_aerodynamics.json': af00 as RawQuestion[],
  '01_structures.json': af01 as RawQuestion[],
  '02_rigging.json': af02 as RawQuestion[],
  '03_fabric.json': af03 as RawQuestion[],
  '04_metal_repair.json': af04 as RawQuestion[],
  '05_welding.json': af05 as RawQuestion[],
  '06_wood_repair.json': af06 as RawQuestion[],
  '07_composites.json': af07 as RawQuestion[],
  '08_painting.json': af08 as RawQuestion[],
  '09_electrical.json': af09 as RawQuestion[],
  '10_instruments_autopilot.json': af10 as RawQuestion[],
  '11_comm_nav.json': af11 as RawQuestion[],
  '12_hydraulics.json': af12 as RawQuestion[],
  '13_landing_gear.json': af13 as RawQuestion[],
  '14_fuel.json': af14 as RawQuestion[],
  '15_ice_rain.json': af15 as RawQuestion[],
  '16_environmental.json': af16 as RawQuestion[],
  '17_fire.json': af17 as RawQuestion[],
};

// Gera as sections dinamicamente
const sections: DeckSection[] = airframeSubmodule.sets.map((set) => ({
  id: set.id,
  title: set.name,
  shortTitle: set.shortTitle,
  subtitle: set.subtitle,
  weight: set.weight ?? 1,
  questions: fileMap[set.file] ?? [],
}));

export default function AirframePage() {
  return (
    <EntitlementGuard moduleKey="m1m2.airframe" title={airframeMetadata.moduleTitle ?? 'Airframe – M1/M2'}>
      <AdvancedEngine
        moduleId="airframe"
        moduleTitle={airframeMetadata.moduleTitle ?? 'Airframe – M1/M2'}
        moduleDescription={
          airframeMetadata.moduleDescription ??
          'Structures, aerodynamics, systems and repairs for AME M1/M2.'
        }
        sections={sections}
        enableCredits={false}
        examCost={0}
        defaultTestQuestionCount={50}
      />
    </EntitlementGuard>
  );
}
