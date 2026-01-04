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

// --- IMPORTS ALINHADOS COM OS ARQUIVOS DA PASTA --- //
import scienceMathData from '../../../../data/avionics/standardPractices/01_science_math.json';
import wiringPracticesData from '../../../../data/avionics/standardPractices/02_wiring_practices.json';
import hardwareData from '../../../../data/avionics/standardPractices/03_hardware.json';
import toolsData from '../../../../data/avionics/standardPractices/04_tools.json';
import basicSystemsData from '../../../../data/avionics/standardPractices/05_basic_systems.json';
import basicElectricityData from '../../../../data/avionics/standardPractices/06_basic_electricity.json';
import basicElectronicsData from '../../../../data/avionics/standardPractices/07_basic_electronics.json';
import corrosionData from '../../../../data/avionics/standardPractices/08_corrosion.json';
import ndtData from '../../../../data/avionics/standardPractices/09_ndt.json';

// --- SECTIONS PARA O ADVANCEDENGINE --- //
const sections: DeckSection[] = [
  {
    id: 'sp01',
    title: '01 – Science & Math',
    shortTitle: 'Science/Math',
    subtitle: 'Basic physics and math for avionics standard practices.',
    weight: 1,
    questions: scienceMathData as RawQuestion[],
  },
  {
    id: 'sp02',
    title: '02 – Wiring Practices',
    shortTitle: 'Wiring',
    subtitle: 'Wiring installation, routing, protection and terminations.',
    weight: 1,
    questions: wiringPracticesData as RawQuestion[],
  },
  {
    id: 'sp03',
    title: '03 – Hardware',
    shortTitle: 'Hardware',
    subtitle: 'Fasteners, connectors and other avionics hardware.',
    weight: 1,
    questions: hardwareData as RawQuestion[],
  },
  {
    id: 'sp04',
    title: '04 – Tools & Measuring Devices',
    shortTitle: 'Tools',
    subtitle: 'Hand tools, measuring devices and proper use.',
    weight: 1,
    questions: toolsData as RawQuestion[],
  },
  {
    id: 'sp05',
    title: '05 – Basic Aircraft Systems',
    shortTitle: 'Systems',
    subtitle: 'Overview of aircraft systems relevant to avionics.',
    weight: 1,
    questions: basicSystemsData as RawQuestion[],
  },
  {
    id: 'sp06',
    title: '06 – Basic Electricity',
    shortTitle: 'Electricity',
    subtitle: 'Basic electrical concepts, laws and circuit theory.',
    weight: 1,
    questions: basicElectricityData as RawQuestion[],
  },
  {
    id: 'sp07',
    title: '07 – Basic Electronics',
    shortTitle: 'Electronics',
    subtitle: 'Semiconductors, logic and basic electronic circuits.',
    weight: 1,
    questions: basicElectronicsData as RawQuestion[],
  },
  {
    id: 'sp08',
    title: '08 – Corrosion & Prevention',
    shortTitle: 'Corrosion',
    subtitle: 'Corrosion theory, detection and protection methods.',
    weight: 1,
    questions: corrosionData as RawQuestion[],
  },
  {
    id: 'sp09',
    title: '09 – NDT – Non-Destructive Testing',
    shortTitle: 'NDT',
    subtitle: 'Non-destructive inspection methods applicable to avionics.',
    weight: 1,
    questions: ndtData as RawQuestion[],
  },
];

export default function AvionicsStandardPracticesPage() {
  return (
    <EntitlementGuard
      moduleKey="avionics.stdp"
      title="Avionics – Standard Practices"
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
                Avionics – Standard Practices
              </h1>

              <p className="text-sm text-muted-foreground">
                Physics, math, wiring, hardware, tools, electronics and systems
                for the SPE – Standard Practices Avionics exam.
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
            moduleId="avionics_sp"
            moduleTitle="Avionics – Standard Practices"
            moduleDescription="Build a deck by selecting Standard Practices subjects and study in Flashcard or Practice mode."
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
