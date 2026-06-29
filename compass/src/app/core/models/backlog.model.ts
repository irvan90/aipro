export type MoSCoW = 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";
export type ImpactArea = 'Revenue' | 'CX' | 'Compliance' | 'Ops' | 'Retention' | 'Risk';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Unplanned';
export type BacklogStatus = 'new' | 'draft' | 'ai_scored' | 'ready' | 'not_ready' | 'submitted' | 'archived' | 'delivered';
export type EvidenceType = 'Analytics' | 'Complaint Data' | 'Survey' | 'Incident Report' | 'Business Request';
export type BacklogSource = 'myservice';
export type ValueEffortLevel = 'Low' | 'Medium' | 'High';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type PriorityRecommendation = 'promote' | 'keep' | 'defer';
export type RoadmapLane = 'Now' | 'Next' | 'Later';

export interface OpportunityRange {
  metric: 'retained_balance';
  min: number;
  max: number;
  currency: 'IDR';
  label: string;
  formula: string;
  assumptions: string[];
  isDemoEstimate: true;
}

export interface EvidenceSignal {
  type: 'competitive' | 'customer' | 'business' | 'delivery';
  label: string;
  detail: string;
  source: string;
  observedAt: string;
}

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
  source?: BacklogSource;
  myService?: MyServiceData;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  initialPriority?: PriorityLevel;
  recommendation?: PriorityRecommendation;
  priorityChangeReason?: string;
  roadmapLane?: RoadmapLane;
  opportunityAtRisk?: OpportunityRange;
  evidenceSignals?: EvidenceSignal[];
  isHistoricalScenario?: boolean;
}

export interface RICEScore {
  reach: number;       // estimated users affected (e.g. 80000)
  impact: number;      // scale 0.25 | 0.5 | 1 | 2 | 3
  confidence: number;  // percentage 0-100
  effort: number;      // person-sprints
  total: number;       // (Reach × Impact × Confidence%) / Effort
}

export interface AIResult {
  moscow: MoSCoW;
  reasoning: AIReasoning;
  confidenceLevel: number;
  promptVersion: string;
  scoredAt: Date;
  riceScore?: RICEScore;
  valueEffort?: { value: ValueEffortLevel; effort: ValueEffortLevel };
  agentFindings?: AgentFinding[];
  missingFields?: string[];
}

export type AgentId = 'market-gap' | 'business-impact' | 'feasibility-risk';

export interface AgentFinding {
  agentId: AgentId;
  agentName: string;
  role: string;
  icon: string;
  summary: string;
  contributesTo: ('Reach' | 'Impact' | 'Confidence' | 'Effort' | 'MoSCoW')[];
  evidence: string[];
}

export interface AIReasoning {
  reach?: string;
  impact?: string;
  confidence?: string;
  effort?: string;
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
