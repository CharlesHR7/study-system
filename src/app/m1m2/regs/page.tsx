'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';

import AdvancedEngine, {
  DeckSection,
  RawQuestion,
} from '@/components/study/AdvancedEngine';

// ✅ paths corrigidos (4 níveis)
import metadata from '../../../../data/regs/metadata.json';
import regsData from '../../../../data/regs/regs.json';

// Tipos para o metadata
type RegsSetMeta = {
  id: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  file: string;
  weight?: number;
};

type RegsMetadata = {
  module: string;
  moduleTitle?: string;
  moduleDescription?: string;
  submodules: {
    id: string;
    name: string;
    folder: string;
    sets: RegsSetMeta[];
  }[];
};

const regsMetadata = metadata as RegsMetadata;
const regsSubmodule = regsMetadata.submodules[0];

const fileMap: Record<string, RawQuestion[]> = {
  'regs.json': regsData as RawQuestion[],
};

const sections: DeckSection[] = regsSubmodule.sets.map((set) => ({
  id: set.id,
  title: set.name,
  shortTitle: set.shortTitle,
  subtitle: set.subtitle,
  weight: set.weight ?? 1,
  questions: fileMap[set.file] ?? [],
}));

export default function RegsPage() {
  const title =
    regsMetadata.moduleTitle ?? 'Regulatory Requirements – REGS / BREGS';

  return (
    <EntitlementGuard moduleKey="m1m2.regs" title={title}>
      <AdvancedEngine
        moduleId="regs"
        moduleTitle={title}
        moduleDescription={
          regsMetadata.moduleDescription ??
          'Regulatory requirements for M, E, S and B licences, including CARs and associated standards used in the REGS/BREGS exams.'
        }
        sections={sections}
        enableCredits={true}
        examCost={1}
        defaultTestQuestionCount={50}
      />
    </EntitlementGuard>
  );
}
