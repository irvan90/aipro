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
  myServiceId: string; // ID project (ex: BPRO110026050)
  projectName?: string; // Name -> nama project
  description?: string; // Description -> deskripsi project
  product?: string; // Product -> nama produknya (ex: myBCA Mobile)
  businessProposalType?: string; // Business Proposal Type -> feature
  featureInitiator: string; // Feature Initiator -> nama yang membuat BPRO
  status?: string; // Status -> Approved (always Approved)
  category?: string; // Category -> Project/BAU
  projectNumber?: string; // Project Number -> PRO25103234
  epic?: string; // Epic
  timeToMarket?: string; // Time to Market (Month) -> target delivery (ex: November-2026)
  timeToMarketMonths?: number; // kept for compatibility if needed
  existingCondition?: string; // Existing Condition -> deskripsi
  customerValue?: string; // Value Untuk Nasabah atau User -> deskripsi
  functionalRequirement?: string; // Functional Requirement Description -> deskripsi
  concern?: string; // Concern -> deskripsi
  newActivityOrFeature?: boolean; // New Activity or Feature -> apakah fitur baru atau pengembangan fitur (true/false)
  testingMethodKLA?: string; // Testing Method by KLA -> cara testing dari tim KLA
  pmoSubmission?: 'adhoc' | 'planned'; // Pengajuan PMO -> adhoc/planned
  picIT?: string; // PIC IT (S4 - S6)
  ebiCode?: string; // Kode EBI (ex: R.200004)
  userType?: 'internal' | 'external'; // User Type -> internal/external
  valuegraphValue: ValueEffortLevel; // Valuegraph Value -> Low,Medium,High
  valuegraphEffort: ValueEffortLevel; // Valuegraph Effort -> Low,Medium,High
  involvementDWH?: boolean; // Involvement DWH -> true/false
  involvementRPA?: boolean; // Involvement RPA -> true/false
  networkIntranet?: boolean; // Intranet / koneksi internal -> true/false
  networkInternet?: boolean; // Internet -> true/false
  networkVsat?: boolean; // GSM ISP Khusus / VSAT -> true/false
  networkVpnInternet?: boolean; // VPN Internet -> true/false
  networkVpnIpSec?: boolean; // VPN IP Sec -> true/false
  networkMpls?: boolean; // MPLS / Host to Host -> true/false
  personalDataAccess?: boolean; // Any Personal Data Access? -> true/false
  ropaDpiaLink?: string; // Link ROPA DPIA
  blueprintUrl?: string; // URL Artifact Blueprint
  picBA?: string; // PIC Business Analyst (Min. S6)
  picBAManager?: string; // PIC Business Analyst (Min. S3) (manager)
  picGSIT?: string; // Approval PIC GSIT (Min. S4)
  createdBy?: string; // Created By -> NIP pembuat contoh (u066684)
  createdOn?: Date; // Created On -> timestamp pembuatan
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
  
  // PO Additional manual parameter overrides
  // Reach dinormalisasi dengan Skala Relatif Proporsional terhadap Total Populasi Target (TAM):
  //   External (Nasabah): >50% TAM→Skor 10, 20-50%→Skor 5, 5-20%→Skor 2, <5%→Skor 1
  //   Internal (Karyawan): >50% staf unit→Skor 10, 20-50%→Skor 5, 5-20%→Skor 2, <5%→Skor 1
  targetCakupanAdopsi?: string; // '>50% TAM' | '20-50% TAM' | '5-20% TAM' | '<5% TAM'
  skalaDampakBisnis?: string; // 'Massive' | 'High' | 'Medium' | 'Low'
  estimasiKepercayaan?: number; // 50 to 100
  fleksibilitasPeluncuran?: string; // 'Strict' | 'Flexible'
  riceImpact?: number; // 0.25 | 0.5 | 1 | 2 | 3 — RICE impact multiplier override
}

export interface RICEScore {
  reach: number;       // normalized 1-10 scale (persentase dampak terhadap total populasi target)
  impact: number;      // scale 0.25 | 0.5 | 1 | 2 | 3
  confidence: number;  // percentage 0-100
  effort: number;      // person-sprints / story points
  total: number;       // (Reach × Impact × Confidence%) / Effort
  reachLabel?: string; // label tier jangkauan (e.g. "Massive Reach", "Enterprise Wide", etc.)
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

export type AgentId = 'market-agent' | 'value-agent' | 'feasibility-agent';

export interface AgentFinding {
  agentId: AgentId;
  agentName: string;
  role: string;
  icon: string;
  summary: string;
  contributesTo: string[];
  evidence: string[];
}

export type ThinkingAgent = 'orchestrator' | AgentId | 'decision-engine';
export type ThinkingType = 'info' | 'process' | 'finding' | 'warning' | 'result';

export interface ThinkingStep {
  agent: ThinkingAgent;
  agentLabel: string;
  icon: string;
  message: string;
  type: ThinkingType;
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
