export type LogbookSource = 'Avianor' | 'Azul' | 'LATAM' | 'Other';

export interface LogbookEntry {
  id: string;
  date: string; // yyyy-mm-dd
  company: string;
  source: LogbookSource;
  aircraftType: string;
  aircraftReg: string;
  ata: string;
  taskType: string;
  description: string;
  role: string;
  durationHours: number;
  reference: string;
  location: string;
  supervisorName: string;
  createdAt: string;
}
