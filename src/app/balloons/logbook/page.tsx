'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TaskGroup = {
  title: string;
  tasks: string[];
};

const TASK_GROUPS_BALLOON: TaskGroup[] = [
  {
    title: 'Envelope',
    tasks: [
      'Inspect the envelope identification plate, confirm its security and the accuracy of the information.',
      'Inspect the fabric gore by gore for defects, e.g. holes, stitching, tears or abrasions, mold, melt or mildew damage.',
      'Inspect and check the fabric porosity.',
      'Perform fabric strength check with a 1 inch grab test, inspect for signs of overheating.',
    ],
  },
  {
    title: 'Load Tapes',
    tasks: [
      'Inspect the horizontal and vertical load tapes and check for damage.',
      'Perform check of the load tape base rigging points (chafing or heat damage).',
    ],
  },
  {
    title: 'Parachute',
    tasks: [
      'Inspect the Crown Ring for abrasion or burrs.',
      'Inspect the parachute, panel by panel, and all connecting lines.',
      'Inspect the Free Load Tapes/Spider Web for abrasion, stitching condition, and integrity.',
      'Inspect the rip line (red line) for wear, correct length, burn damage and knots.',
      'Inspect the velcro tabs and spring top locks (if applicable) for strength and integrity.',
      'Inspect the valve lines for length, burn damage, pulley attachment and correct operation.',
      'Inspect the parachute and check attachment to side of balloon, line anchorage and lower pulley(s) (if applicable) for operation.',
      'Check all fabric strength with appropriate grab test.',
      'Inspect the shroud lines for correct length and abrasion.',
      'Inspect all connecting lines, such as centralizing, shroud, and valve lines for wear, correct length, burn damage, and knots.',
      'Inspect all connecting pulleys, slide rings, and their side wall attachments (if applicable) for operation and integrity.',
    ],
  },
  {
    title: 'Rip Panel (if applicable)',
    tasks: [
      'Inspect the fabric and check for condition.',
      'Inspect the appearance and performance of the velcro.',
      'Inspect and check relative lengths of free load tapes and panel.',
      'Inspect the rip-line, check line for wear and burn damage.',
      'Inspect the line pulleys for proper operation and attachment.',
      'Inspect and check the rip lock system (hooks, loops, “D” ring attachments).',
    ],
  },
  {
    title: 'Vent (if applicable) – rip top only envelope',
    tasks: [
      'Inspect the vent line, check for wear, damage and correct length.',
      'Inspect the termination point for security and attachment.',
      'Inspect the lower pulley for damage, operation and attachment.',
    ],
  },
  {
    title: 'Crown Line',
    tasks: [
      'Inspect for correct length, abrasion, knots, attachment method, and general condition.',
    ],
  },
  {
    title: 'Turning Vent',
    tasks: [
      'Inspect all vent lines, check for abrasion, melt damage and general condition.',
      'Inspect the pulley(s) if applicable for operation and general condition.',
      'Inspect the vent flap finger lines Kevlar/Polyester for damage and general condition.',
      'Inspect the vent for freedom of operation.',
      'Inspect the panel, tapes and elastic, check for damage and correct installation.',
    ],
  },
  {
    title: 'Tempil Labels (Tell Tales)',
    tasks: [
      'Inspect all installed tempil labels on the envelope or parachute.',
      'Inspect latest installed label and register the envelope reading in the technical records.',
      'Inspect latest installed label and register the parachute reading in the technical records.',
    ],
  },
  {
    title: 'Rigging Wires and Mouth Cables',
    tasks: [
      'Inspect the cable attachments including the cable covers for integrity.',
      'Inspect the rigging wires, check for heat and abrasion, kinking, and broken strands.',
      'Inspect the stainless steel cables (if applicable) for broken wire strands.',
      'Inspect the Kevlar cables (if applicable) for abrasion to core, or damage to splice stitching.',
      'Inspect the cable swaging, heat shrink covers, and thimbles for condition and integrity.',
      'Inspect all attaching parts for condition, security, and integrity.',
    ],
  },
  {
    title: 'Scoop or Skirt (if applicable)',
    tasks: [
      'Inspect the fabric, attachment points (knots and/or clips), and shock cords (if applicable), for condition and proper installation.',
    ],
  },
  {
    title: 'Temperature Sensing and Readout Equipment',
    tasks: [
      'Inspect the readout equipment for function and accuracy.',
      'Inspect the cable and check for positive continuity and damage.',
      'Inspect the thermistor and cable connectors (if applicable) for damage and security.',
    ],
  },
  {
    title: 'Burner and Fuel System',
    tasks: [
      'Inspect and confirm that all burners and fuel tanks are properly registered in the technical records.',
      'Inspect the burner unit(s) inner and outer frame for integrity.',
      'Inspect the burner unit(s) for proper function of ignitor (if applicable), the pilot light(s), the main blast valve(s), the secondary burner valve, and the cross flow valve (if applicable).',
      'Service the blast valve(s), and lubricate all fittings as required.',
      'Inspect all fuel hoses for abrasions, cuts, cracking, and general condition.',
      'Inspect all plumbing and cross flow systems (if applicable); lubricate as required.',
      'Inspect the fuel cylinders for validity of the pressure test, check for damage, dents and corrosion.',
      'Inspect the heat tape installation technique (if applicable) for integrity.',
      'Perform a dip tube test on the fuel cylinders.',
      'Perform a leak test of all plumbing and fittings, including any manifold systems installed.',
      'Perform a fuel system pressure check, verify the operation of the cylinder and burner valves, fuel quantity gauges, and pressure readout gauges.',
      'Inspect the carabiners and check for condition.',
      'Inspect the burner unit, pilot light/ignitor.',
    ],
  },
  {
    title: 'Basket',
    tasks: [
      'Inspect the identification plate, check for security, and confirm that the pertinent information in the technical records is accurate.',
      'Inspect the basket and all attaching parts, including the cables and their coverings for condition and integrity.',
      'Inspect all upright systems, burner attachment systems, flexi poles (if applicable), covers, and padding for condition and security.',
      'Inspect the instrument mounting system for condition, integrity and security.',
      'Inspect the fire extinguisher for condition and security, and verify the validity of the pressure test.',
      'Inspect the fuel tank securing system for condition and security.',
      'Inspect the document display case for condition and security.',
      'Inspect the drop line, check for kinks, abrasion, storage and security of attachment.',
      'Inspect the drop line storage case for condition and security.',
    ],
  },
  {
    title: 'Instruments and Radios',
    tasks: [
      'Inspect the radios (where applicable) and all instruments for operation, security and accuracy.',
    ],
  },
  {
    title: 'Technical Records and Documents',
    tasks: [
      'Inspect the technical records for compliance with the pertinent regulatory requirements.',
      'Ascertain the availability of the required documents, and verify their regulatory compliance; such documents as: the Flight Manual, the Annual Airworthiness Information Report, the Certificate of Airworthiness, the Certificate of Registration, the Radio License (if applicable), etc.',
      'Review all Airworthiness Directives and Service Bulletins to determine their applicability and compliance, where required.',
    ],
  },
];

const signatoryRows = Array.from({ length: 15 }, (_, i) => i + 1);

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};

const handleSave = () => {
  alert(
    'Save ainda é só visual. Na próxima fase vamos conectar com armazenamento (localStorage/DB/servidor) para guardar os dados.'
  );
};

export default function BalloonLogbookPage() {
  return (
    <EntitlementGuard
      moduleKey="balloons.logbook"
      title="Balloon (B) – Maintenance Experience Logbook"
    >
      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-5xl bg-white text-[11px] leading-snug border border-black">
          {/* Toolbar (só na tela) */}
          <div className="screen-only flex items-center justify-between px-3 py-2 border-b border-black bg-slate-50">
            <div className="font-semibold text-sm">
              Balloon (B) – Maintenance Experience Logbook
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={handlePrint}>
                Print / Export PDF
              </Button>
              <Link href="/balloons">
                <Button variant="outline" size="sm" type="button">
                  Back to Balloons
                </Button>
              </Link>
            </div>
          </div>

          {/* TODO: conteúdo restante permanece igual ao seu arquivo */}
          {/* Applicant name / File number, instructions, signatories, task list... */}
          {/* (sem alterações) */}
        </div>
      </div>
    </EntitlementGuard>
  );
}
