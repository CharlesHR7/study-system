'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';

import AdvancedEngine, {
  DeckSection,
  RawQuestion,
} from '@/components/study/AdvancedEngine';
import { Radio, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// --- IMPORTS ALINHADOS COM A PASTA data/avionics/systems --- //
import communicationData from '../../../../data/avionics/systems/01_communication.json';
import navigationData from '../../../../data/avionics/systems/02_navigation.json';
import surveillanceData from '../../../../data/avionics/systems/03_surveillance.json';
import autopilotData from '../../../../data/avionics/systems/04_autopilot.json';
import instrumentsData from '../../../../data/avionics/systems/05_instruments.json';
import powerDistributionData from '../../../../data/avionics/systems/06_powerDistribution.json';
import troubleshootingData from '../../../../data/avionics/systems/07_troubleshooting.json';

// --- SECTIONS PARA O ADVANCEDENGINE --- //
const sections: DeckSection[] = [
  {
    id: 'sys01',
    title: '01 – Communication Systems',
    shortTitle: 'Communication',
    subtitle: 'VHF, HF, interphone, audio systems and related components.',
    weight: 1,
    questions: communicationData as RawQuestion[],
  },
  {
    id: 'sys02',
    title: '02 – Navigation Systems',
    shortTitle: 'Navigation',
    subtitle: 'VOR, ILS, GPS, FMS and other navigation systems.',
    weight: 1,
    questions: navigationData as RawQuestion[],
  },
  {
    id: 'sys03',
    title: '03 – Surveillance Systems',
    shortTitle: 'Surveillance',
    subtitle: 'Transponder, TCAS, radar and surveillance equipment.',
    weight: 1,
    questions: surveillanceData as RawQuestion[],
  },
  {
    id: 'sys04',
    title: '04 – Autopilot & Flight Director',
    shortTitle: 'Autopilot',
    subtitle: 'Autopilot modes, flight director and basic integration.',
    weight: 1,
    questions: autopilotData as RawQuestion[],
  },
  {
    id: 'sys05',
    title: '05 – Instruments & Displays',
    shortTitle: 'Instruments',
    subtitle: 'Traditional and EFIS instruments, indications and warnings.',
    weight: 1,
    questions: instrumentsData as RawQuestion[],
  },
  {
    id: 'sys06',
    title: '06 – Power Generation & Distribution',
    shortTitle: 'Power',
    subtitle: 'AC/DC generation, distribution and protection for avionics.',
    weight: 1,
    questions: powerDistributionData as RawQuestion[],
  },
  {
    id: 'sys07',
    title: '07 – Troubleshooting & BITE',
    shortTitle: 'Troubleshooting',
    subtitle: 'Fault isolation, BITE and systematic troubleshooting.',
    weight: 1,
    questions: troubleshootingData as RawQuestion[],
  },
];

export default function AvionicsSystemsPage() {
  return (
    <EntitlementGuard
      moduleKey="avionics.systems"
      title="Avionics – Systems & Theory"
    >
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cabeçalho do módulo */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Radio className="h-3 w-3" />
                <span>Licence E – Avionics</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Avionics – Systems & Theory
              </h1>
              <p className="text-sm text-muted-foreground">
                Communication, navigation, surveillance, instruments, power
                distribution and troubleshooting for the E rating exam.
              </p>
            </div>

            <Link href="/avionics">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          {/* Motor de estudo unificado */}
          <AdvancedEngine
            moduleId="avionics_sys"
            moduleTitle="Avionics – Systems & Theory"
            moduleDescription="Select one or more avionics systems and study them in Flashcard or Practice mode."
            sections={sections}
            enableCredits={false}
            examCost={0}
            defaultTestQuestionCount={50}
          />
        </div>
      </div>
    </EntitlementGuard>
  );
}
