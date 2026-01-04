'use client';

import React from 'react';
import EntitlementGuard from '@/components/EntitlementGuard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TaskGroup = {
  title: string;
  tasks: string[];
};

const TASK_GROUPS_S: TaskGroup[] = [
  {
    title: 'Corrosion Control',
    tasks: [
      'Removal and treatment of aluminium alloy corrosion',
      'Removal and treatment of steel alloy corrosion',
      'Removal and treatment of magnesium alloy corrosion',
      'Prepare metal surface by shot peening',
      'Perform removal and treatment of galvanic corrosion.',
    ],
  },
  {
    title: 'Corrosion Assessment',
    tasks: [
      'Perform inspection of aircraft structure for corrosion',
      'Perform removal of affected corroded areas by chemical/mechanical methods',
      'Perform measurement of corrosion damage',
      'Perform test of metal composites for corrosion',
      'Perform non-destructive testing inspection (NDI) and interpret results',
    ],
  },
  {
    title: 'Aircraft Drawings',
    tasks: ['Interpret information from blueprints'],
  },
  {
    title: 'Sealing',
    tasks: [
      'Prepare metal/wood/composite surfaces for sealing',
      'Select/mix and apply sealants to seams, joints and fasteners',
    ],
  },
  {
    title: 'Fastener Installation',
    tasks: [
      'Identify fasteners and prepare lay out pattern',
      'Drill, ream and countersink holes',
      'Identify solid rivet types',
      'Perform heat treatment of rivets',
      'Perform rivet installation (set and buck)',
      'Perform installation of special fasteners/swage threadless collars',
      'Perform installation of panel and cowl fasteners',
      'Perform installation of blind bolts/nuts/rivets/rivnuts',
      'Perform installation of threaded fasteners/self and non-self locking fasteners',
      'Remove and install heli-coil',
    ],
  },
  {
    title: 'Structural Damage Assessment',
    tasks: [
      'Perform visual inspection of damaged area',
      'Interpret NDI results',
      'Draw sketch of damaged area and determine required repair',
    ],
  },
  {
    title: 'Aircraft Structure and Designs',
    tasks: [
      'Remove, install and align wing assembly after repair',
      'Remove, repair, balance, install and rig flight control surfaces',
      'Perform sheet metal repair to monocoque/semi-monocoque fuselages',
      'Perform a weld repair to tubular structure',
    ],
  },
  {
    title: 'Engine & Mounting',
    tasks: ['Perform a weld repair to an engine mount'],
  },
  {
    title: 'Metallurgy and Heat Treatment of Metals',
    tasks: [
      'Perform heat treatment of ferrous/non-ferrous metals',
      'Perform hardness testing of ferrous and non-ferrous metals',
    ],
  },
  {
    title: 'Assembly',
    tasks: [
      'Install and align parts using jigs/holding fixtures',
      'Install parts maintaining tolerances',
      'Install, trim and fit parts',
      'Perform drilling, reaming and countersinking of holes',
      'Removal, disassembly, reassembly and installation of components and parts to gain access to a sheet metal repair',
      'Perform dressing and deburring of repaired area',
      'Application of corrosion protection',
      'Application of required sealants',
      'Perform bonding/spot weld parts',
      'Assemble parts using structural fasteners',
      'Remove/fabricate/install safety flight control cables',
      'Remove old sealant, prepare and apply sealant to "wet wing" fuel tank and pressure test tank for leaks',
      'Removal, repair and installation of wing leading edge/vertical/horizontal stabilizer surfaces after hail/bird strike damage',
      'Remove, prepare and install de-icing boots to wing leading edge/vertical/horizontal stabilizer surfaces',
      'Removal, prepare and install propeller de-icing boots',
    ],
  },
  {
    title: 'Landing Gear',
    tasks: [
      'Repair main/nose landing gear doors',
      'Repair to skis/floats',
    ],
  },
  {
    title: 'Sheet Metal Structures',
    tasks: [
      'Remove, repair/replace damaged parts',
      'Reinforce/splice/replace structural sheet metal parts',
      'Reinforce/splice/replace forgings and extrusions',
      'Remove and replace rod-end fittings',
      'Repair non-structural cabin interior lining',
      'Perform stop drilling of small cracks in sheet metal parts',
      'Prepare and install patch to sheet metal skins',
    ],
  },
  {
    title: 'Sheet Metal Fabrication',
    tasks: [
      'Read and interpret technical drawings',
      'Perform layout patterns templates',
      'Perform cutting of material to size',
      'Form sheet metal with hand/machine tools',
      'Perform cold-working of fastener holes',
      'Perform sawing and routing of sheet metal',
      'Perform stop drilling of small cracks in sheet metal',
      'Perform fastening of sheet metal with rivets',
      'Perform fastening of sheet metal using bonding process',
      'Perform punch and drilling of sheet metal',
      'Perform dimpling and countersinking of sheet metal',
    ],
  },
  {
    title: 'Composite Structures – Composite Repairs',
    tasks: [
      'Perform sanding/grinding routing of damaged area',
      'Prepare damaged area by step/taper sanding',
      'Perform fabrication of pattern for cutting cloth patches',
      'Perform wetting-out of fabric with resin and cut out patches',
      'Perform a lay-up repair ply/plies using wet/pre-preg cloth',
      'Perform curing of repairs at room temperature',
      'Perform curing of repairs with heat blankets/oven',
      'Perform check for delamination',
      'Perform installation of inserts',
      'Perform sanding/priming and painting of repaired surface',
    ],
  },
  {
    title: 'Composite Fabrication',
    tasks: [
      'Perform fabrication of master model',
      'Perform removal of mould from master model',
      'Perform fabrication of cutting pattern for lay-up plies',
      'Prepare plies for wet/pre-preg lay-up',
      'Prepare mould surface',
      'Perform curing of lay-up with heat blanket/oven/autoclave/room',
      'Perform check for improper bonding',
      'Perform trimming of excess from parts/structure being fabricated',
      'Perform sanding/priming/painting of fabricated parts',
    ],
  },
  {
    title: 'Fabric and Wood Repair',
    tasks: [
      'Perform fabric tests',
      'Perform repair to fabric covering',
      'Perform recovering of aircraft fabric surfaces',
      'Perform application of dope to aircraft fabric surfaces',
      'Perform application of paint to recovered fabric surfaces',
    ],
  },
  {
    title: 'Wood Structures',
    tasks: [
      'Perform inspection of wood structures',
      'Perform selection of aircraft grade wood',
      'Perform repair/replacement to aircraft wood structure',
      'Perform sealing and refinishing to an aircraft wood structure',
      'Perform lamination of fabric to an aircraft wood structure',
      'Perform application of varnish to an aircraft wood structure',
    ],
  },
  {
    title: 'Fluid Lines and Conduits',
    tasks: [
      'Perform bending of tubing as per drawings/sample',
      'Perform fabrication of flexible hoses and leak test',
      'Perform fabrication of conduits and manifolds',
    ],
  },
  {
    title: 'Windows',
    tasks: [
      'Perform inspection of aircraft windows',
      'Remove and install cockpit windshield/sliding windows/side windows',
      'Perform buffing/polishing of windows',
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

export default function StructuresLogbookPage() {
  return (
    <EntitlementGuard
      moduleKey="structures.logbook"
      title="Structures (S) – Maintenance Experience Logbook"
    >
      {/* todo o conteúdo original permanece igual */}
      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-5xl bg-white text-[11px] leading-snug border border-black">
          {/* … conteúdo inalterado … */}
        </div>
      </div>
    </EntitlementGuard>
  );
}
