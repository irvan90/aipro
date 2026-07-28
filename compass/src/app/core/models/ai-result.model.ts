import { Quarter, RoadmapLane } from './backlog.model';

export interface ImpactAnalysisResult {
  backlogId: string;
  targetLane: RoadmapLane | Quarter;
  roadmapImpacts: RoadmapImpact[];
  dependencyImpacts: DependencyImpact[];
  kpiImpacts: KPIImpact[];
  estimatedDelayInSprints: number;
  aiRecommendation: string;
  recommendedAction: 'promote' | 'keep' | 'defer' | 'reject';
}

export interface RoadmapImpact {
  affectedBacklogId: string;
  affectedBacklogTitle: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DependencyImpact {
  dependencyId: string;
  dependencyTitle: string;
  description: string;
  isBlocker: boolean;
}

export interface KPIImpact {
  kpi: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}
