'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/* ======= TYPES ======= */
type TaskGroup = {
  ata: string;
  title: string;
  tasks: string[];
};

/* ======= TASK GROUPS – AVIONICS (E) ======= */
const TASK_GROUPS_E: TaskGroup[] = [
  {
    ata: '05',
    title: 'Time limits Mtce Checks',
    tasks: [
      'Review records for compliance with airworthiness directives',
      'Review records for compliance with component life limits',
    ],
  },
  {
    ata: '06',
    title: 'Dimensions/Areas',
    tasks: ['Locate components by station number'],
  },
  {
    ata: '08',
    title: 'Levelling/Weighing',
    tasks: [
      'Prepare weight and balance amendment',
      'Check aircraft against equipment list',
    ],
  },
  {
    ata: '09',
    title: 'Towing/Taxiing',
    tasks: ['Tow aircraft', 'Taxi aircraft'],
  },
  {
    ata: '11',
    title: 'Placards/Markings',
    tasks: ['Check aircraft for correct placards'],
  },
  {
    ata: '12',
    title: 'Servicing',
    tasks: ['Connect ground power'],
  },
  {
    ata: '21',
    title: 'Air Conditioning',
    tasks: [
      'Check operation of air conditioning/heating system',
      'Check operation of pressurization system',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '22',
    title: 'Auto Flight',
    tasks: [
      'Install servos',
      'Rig bridle cables',
      'Replace controller',
      'Replace amplifier',
      'Check operation of auto-pilot',
      'Check operation of auto-throttle',
      'Check operation of yaw damper',
      'Check and adjust servo clutch',
      'Perform autopilot gain adjustments',
      'Perform mach trim functional check',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '23',
    title: 'Communications',
    tasks: [
      'Replace VHF com unit',
      'Replace HF com unit',
      'Replace existing antenna',
      'Install new antenna',
      'Replace static discharge wicks',
      'Check operation of radios',
      'Perform antenna check',
      'Perform selcal operational check',
      'Perform operational check of passenger address system',
      'Functionally check audio integrating system',
      'Repair co-axial cable',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '24',
    title: 'Electrical Power',
    tasks: [
      'Charge lead/acid battery',
      'Charge ni-cad battery',
      'Check battery capacity',
      'Replace cells',
      'Deep-cycle ni-cad battery',
      'Replace generator',
      'Replace switches',
      'Replace circuit breakers',
      'Adjust voltage regulator',
      'Amend electrical load analysis report',
      'Repair/replace electrical feeder cable',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '25',
    title: 'Equipment Furnishings',
    tasks: ['Check ELT for compliance with regulations'],
  },
  {
    ata: '26',
    title: 'Fire Protection',
    tasks: [
      'Check operation of warning system',
      'Check lavatory smoke detector system',
      'Replace fire bottle squib',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '27',
    title: 'Flight Controls',
    tasks: ['Troubleshoot faulty system'],
  },
  {
    ata: '28',
    title: 'Fuel',
    tasks: ['Calibrate fuel quantity gauges', 'Troubleshoot faulty system'],
  },
  {
    ata: '29',
    title: 'Hydraulics',
    tasks: [
      'Check indicating systems',
      'Perform functional checks',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '30',
    title: 'Ice and Rain Protection',
    tasks: [
      'Replace timer',
      'Replace distributor',
      'Install wiper motor',
      'Check operation of systems',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '31',
    title: 'Indicating/Recording Systems',
    tasks: [
      'Replace flight data recorder',
      'Replace cockpit voice recorder',
      'Replace clock',
      'Replace panel vibrator',
      'Replace master caution unit',
      'Perform FDR calibration/correlation check',
      'Perform FDR data retrieval',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '32',
    title: 'Landing Gear',
    tasks: [
      'Test antiskid unit',
      'Adjust micro switches',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '33',
    title: 'Lights',
    tasks: [
      'Repair/replace rotating beacon',
      'Repair/replace landing lights',
      'Repair/replace navigation lights',
      'Repair/replace interior lights',
      'Repair/replace emergency lighting system',
      'Perform emergency lighting system checks',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '34',
    title: 'Navigation',
    tasks: [
      'Calibrate magnetic direction indicator',
      'Replace airspeed indicator',
      'Replace altimeter',
      'Replace air data computer',
      'Replace VOR unit',
      'Replace ADI',
      'Replace HSI',
      'Check pilot static system for leaks',
      'Check operation of directional gyro',
      'Functional check of weather radar',
      'Functional check doppler',
      'Functional check TCAS',
      'Functional check DME',
      'Functional check ATC Transponder',
      'Functional check flight director system',
      'Functional check inertial nav system',
      'Complete quadrantal error correction of ADF system',
      'Update flight management system database',
      'Check calibration of altimeter system',
      'Check calibration of pressure altitude reporting system',
      'Troubleshoot faulty system',
    ],
  },
  {
    ata: '35',
    title: 'Oxygen',
    tasks: ['Troubleshoot faulty system'],
  },
  {
    ata: '36',
    title: 'Pneumatic Systems',
    tasks: ['Troubleshoot faulty system'],
  },
  {
    ata: '37',
    title: 'Vacuum Systems',
    tasks: ['Troubleshoot faulty system'],
  },
  {
    ata: '38',
    title: 'Water/Waste',
    tasks: ['Troubleshoot faulty system'],
  },
  {
    ata: '45',
    title: 'Central Mtce System',
    tasks: [
      'Retrieve data from CMU',
      'Replace CMU',
      'Perform Bite check',
      'Troubleshoot faulty system',
    ],
  },
];

/* ======= HELPERS ======= */
const signatoryRows = Array.from({ length: 15 }, (_, i) => i + 1);

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};

const handleSave = () => {
  alert(
    'Save ainda é apenas visual. Em uma próxima fase vamos conectar com armazenamento (localStorage/DB/servidor) para guardar os dados.',
  );
};

/* ======= PAGE ======= */
export default function AvionicsLogbookPage() {
  return (
    <EntitlementGuard
      moduleKey="avionics.logbook"
      title="Avionics (E) – Maintenance Experience Logbook"
    >
      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-5xl bg-white text-[11px] leading-snug border border-black">
          {/* TOOLBAR */}
          <div className="screen-only flex items-center justify-between px-3 py-2 border-b border-black bg-slate-50">
            <div className="font-semibold text-sm">
              Avionics (E) – Maintenance Experience Logbook
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                Print / Export PDF
              </Button>
              <Link href="/avionics">
                <Button variant="outline" size="sm">
                  Back to Avionics
                </Button>
              </Link>
            </div>
          </div>

          {/* O restante do conteúdo permanece exatamente igual */}
          {/* … */}
        </div>
      </div>
    </EntitlementGuard>
  );
}
