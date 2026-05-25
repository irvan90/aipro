import { Quarter } from './backlog.model';

export type RoadmapStatus = 'shadow' | 'draft' | 'submitted' | 'final';
export type QuarterStatus = 'completed' | 'submitted' | 'draft' | 'shadow';

export interface Roadmap {
  id: string;
  productId: string;
  year: number;
  quarters: RoadmapQuarter[];
  status: RoadmapStatus;
  submittedAt?: Date;
  submittedBy?: string;
  pmoComment?: string;
  lastModifiedAt: Date;
}

export interface RoadmapQuarter {
  quarter: Quarter;
  backlogIds: string[];
  status: QuarterStatus;
  submissionReadiness?: number;
  readyCount?: number;
  totalCount?: number;
}
