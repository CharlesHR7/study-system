'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';

import AdvancedEngine, {
  DeckSection,
  RawQuestion,
} from '@/components/study/AdvancedEngine';

// metadata do módulo Standard Practices
import metadata from '../../../../data/standard_practices/metadata.json';

// imports estáticos dos JSONs (necessário pro bundler do Next)
import st01Data from '../../../../data/standard_practices/01_math_physics.json';
import st02Data from '../../../../data/standard_practices/02_electricity_electronics.json';
import st03Data from '../../../../data/standard_practices/03_hardware.json';
import st04Data from '../../../../data/standard_practices/04_drawings.json';
import st05Data from '../../../../data/standard_practices/05_weight_balance.json';
import st06Data from '../../../../data/standard_practices/06_metal_corrosion.json';
import st07Data from '../../../../data/standard_practices/07_ndt.json';
import st08Data from '../../../../data/standard_practices/08_servicing_standard_practices.json';
import st09Data from '../../../../data/standard_practices/09_tools_measuring.json';
import st10Data from '../../../../data/standard_practices/10_basic_structures.json';

// Tipos para o metadata
type StdpSetMeta = {
  id: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  file: string;
  weight?: number;
};

type StdpMetadata = {
  module: string;
  moduleTitle?: string;
  moduleDescription?: string;
  submodules: {
    id: string;
    name: string;
    folder: string;
    sets: StdpSetMeta[];
  }[];
};

const stdpMetadata = metadata as StdpMetadata;
const stdpSubmodule = stdpMetadata.submodules[0];

// Mapa de arquivos -> dados carregados
const fileMap: Record<string, RawQuestion[]> = {
  '01_math_physics.json': st01Data as RawQuestion[],
  '02_electricity_electronics.json': st02Data as RawQuestion[],
  '03_hardware.json': st03Data as RawQuestion[],
  '04_drawings.json': st04Data as RawQuestion[],
  '05_weight_balance.json': st05Data as RawQuestion[],
  '06_metal_corrosion.json': st06Data as RawQuestion[],
  '07_ndt.json': st07Data as RawQuestion[],
  '08_servicing_standard_practices.json': st08Data as RawQuestion[],
  '09_tools_measuring.json': st09Data as RawQuestion[],
  '10_basic_structures.json': st10Data as RawQuestion[],
};

// Gera as sections dinamicamente
const sections: DeckSection[] = stdpSubmodule.sets.map((set) => ({
  id: set.id,
  title: set.name,
  shortTitle: set.shortTitle,
  subtitle: set.subtitle,
  weight: set.weight ?? 1,
  questions: fileMap[set.file] ?? [],
}));

export default function StandardPracticesPage() {
  return (
    <EntitlementGuard moduleKey="m1m2.stdp" title="Standard Practices – M1/M2">
      <AdvancedEngine
        moduleId="standard-practices"
        moduleTitle={stdpMetadata.moduleTitle ?? 'Standard Practices – M1/M2'}
        moduleDescription={
          stdpMetadata.moduleDescription ??
          'General subjects and standard practices for AME M1/M2.'
        }
        sections={sections}
        enableCredits={false}
        examCost={0}
        defaultTestQuestionCount={50}
      />
    </EntitlementGuard>
  );
}
