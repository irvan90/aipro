export type MoSCoW = 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";
export type ImpactArea = 'Revenue' | 'CX' | 'Compliance' | 'Ops' | 'Retention' | 'Risk';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Unplanned';
export type BacklogStatus = 'draft' | 'ai_scored' | 'ready' | 'not_ready' | 'submitted' | 'archived';
export type EvidenceType = 'Analytics' | 'Complaint Data' | 'Survey' | 'Incident Report' | 'Business Request';

export interface Backlog {
  id: string;
  title: string;
  description: string;
  businessObjective: string;
  targetUsers: string;
  impactArea: ImpactArea[];
  supportingEvidence: EvidenceType[];
  estimatedImpact: string;
  riskIfNotImplemented: string;
  effortEstimation: string;
  targetQuarter: Quarter;
  strategicTag?: string;
  dependency: string[];
  completenessScore: number;
  status: BacklogStatus;
  isEmergency: boolean;
  emergencyReason?: string;
  aiResult?: AIResult;
  humanOverride?: HumanOverride;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
}

export interface AIResult {
  riceScore: number;
  reach: RICEDimension;
  impact: RICEDimension;
  confidence: RICEDimension;
  effort: RICEDimension;
  moscow: MoSCoW;
  reasoning: AIReasoning;
  confidenceLevel: number;
  promptVersion: string;
  scoredAt: Date;
}

export interface RICEDimension {
  value: number;
  label: 'Minimal' | 'Low' | 'Medium' | 'High' | 'Massive';
  reasoning: string;
}

export interface AIReasoning {
  reach: string;
  impact: string;
  confidence: string;
  effort: string;
  summary: string;
  evidenceRefs: string[];
}

export interface HumanOverride {
  originalPriority: string;
  overriddenPriority: string;
  reason: string;
  overriddenBy: string;
  overriddenAt: Date;
}
