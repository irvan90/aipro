export type MoSCoW = 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";
export type ImpactArea = 'Revenue' | 'CX' | 'Compliance' | 'Ops' | 'Retention' | 'Risk';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Unplanned';
export type BacklogStatus = 'new' | 'draft' | 'ai_scored' | 'ready' | 'not_ready' | 'submitted' | 'archived' | 'delivered';
export type EvidenceType = 'Analytics' | 'Complaint Data' | 'Survey' | 'Incident Report' | 'Business Request';
export type BacklogSource = 'myservice' | 'internal';
export type ValueEffortLevel = 'Low' | 'Medium' | 'High';

export interface MyServiceData {
  myServiceId: string;
  businessProposalType?: string;
  featureInitiator: string;
  category?: string;
  epic?: string;
  timeToMarketMonths?: number;
  existingCondition?: string;
  customerValue?: string;
  functionalRequirement?: string;
  concern?: string;
  userType?: string;
  valuegraphValue: ValueEffortLevel;
  valuegraphEffort: ValueEffortLevel;
  involvementDWH?: boolean;
  involvementRPA?: boolean;
  personalDataAccess?: boolean;
  createdBy?: string;
  createdOn?: Date;
}

export type ValueEffortQuadrant = 'Quick Win' | 'Big Bet' | 'Fill-in' | 'Money Pit';

export interface ValueEffortQuadrantInfo {
  label: ValueEffortQuadrant;
  colorClass: string;
  detail: string;
}

export function valueEffortQuadrant(value: ValueEffortLevel, effort: ValueEffortLevel): ValueEffortQuadrantInfo {
  const highValue = value !== 'Low';
  const highEffort = effort === 'High';
  const label: ValueEffortQuadrant = highValue
    ? (highEffort ? 'Big Bet' : 'Quick Win')
    : (highEffort ? 'Money Pit' : 'Fill-in');
  const colorClass = {
    'Quick Win': 'bg-success/10 text-success',
    'Big Bet': 'bg-bca-accent text-bca-primary',
    'Fill-in': 'bg-gray-100 text-gray-600',
    'Money Pit': 'bg-danger/10 text-danger',
  }[label];
  return { label, colorClass, detail: `V:${value} · E:${effort}` };
}

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
  source: BacklogSource;
  myService?: MyServiceData;
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
  agentFindings?: AgentFinding[];
  missingFields?: string[];
}

export type AgentId = 'external-research' | 'internal-data' | 'compliance-risk'
  | 'effort-estimator' | 'product-fit' | 'synthesizer';

export interface AgentFinding {
  agentId: AgentId;
  agentName: string;
  role: string;
  icon: string;
  summary: string;
  contributesTo: ('Reach' | 'Impact' | 'Confidence' | 'Effort' | 'MoSCoW')[];
  evidence: string[];
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
