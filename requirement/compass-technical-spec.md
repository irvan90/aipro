# COMPASS — Technical Spec for Claude Code

## Angular 21 + Signals + Standalone + Tailwind

-----

## 1. PROJECT OVERVIEW

**Platform:** COMPASS — Cognitive Orchestration & Management for Product Agile Scoring System
**Type:** Internal SaaS — AI-Assisted Product Planning & Prioritization
**Primary User:** Product Owner (PO)
**Mode:** Frontend prototype only — no backend, all mock data

-----

## 2. TECH STACK

```
Framework       : Angular 21
Reactivity      : Angular Signals (signal, computed, effect)
Components      : Standalone (no NgModule)
Routing         : Angular Router (standalone)
UI Styling      : Tailwind CSS + Custom SCSS
Animation       : Angular Animations + CSS transitions
Drag & Drop     : Angular CDK DragDrop
HTTP            : Not needed (mock data only)
Forms           : Angular Reactive Forms
Icons           : Lucide Angular (lucide-angular)
Build           : Angular CLI + Vite
```

-----

## 3. PROJECT STRUCTURE

```
compass/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── backlog.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── roadmap.model.ts
│   │   │   │   ├── ai-result.model.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── mock-data.service.ts
│   │   │   │   ├── backlog.service.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── roadmap.service.ts
│   │   │   │   ├── pmo.service.ts
│   │   │   │   └── auth.service.ts
│   │   │   └── stores/
│   │   │       ├── app.store.ts
│   │   │       ├── backlog.store.ts
│   │   │       ├── roadmap.store.ts
│   │   │       └── ui.store.ts
│   │   ├── layout/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   └── sidebar.component.html
│   │   │   ├── topbar/
│   │   │   │   ├── topbar.component.ts
│   │   │   │   └── topbar.component.html
│   │   │   └── layout.component.ts
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── backlog-list/
│   │   │   ├── backlog-input/
│   │   │   ├── backlog-detail/
│   │   │   ├── impact-analysis/
│   │   │   ├── roadmap/
│   │   │   ├── prd-draft/
│   │   │   ├── pmo-submission/
│   │   │   ├── audit-trail/
│   │   │   ├── team-members/
│   │   │   └── product-context/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── backlog-card/
│   │   │   │   ├── ai-badge/
│   │   │   │   ├── moscow-tag/
│   │   │   │   ├── rice-score/
│   │   │   │   ├── completeness-bar/
│   │   │   │   ├── status-dot/
│   │   │   │   ├── stat-card/
│   │   │   │   ├── ai-insight-card/
│   │   │   │   ├── modal/
│   │   │   │   ├── toast/
│   │   │   │   ├── empty-state/
│   │   │   │   └── loading-skeleton/
│   │   │   └── pipes/
│   │   │       ├── rice-format.pipe.ts
│   │   │       └── relative-time.pipe.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── assets/
│   │   └── mock/
│   │       ├── backlogs.json
│   │       ├── products.json
│   │       └── activities.json
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _animations.scss
│   │   ├── _drag-drop.scss
│   │   └── styles.scss
│   └── main.ts
├── tailwind.config.js
├── angular.json
└── package.json
```

-----

## 4. TYPESCRIPT INTERFACES

```typescript
// ── backlog.model.ts ──

export type MoSCoW = 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
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
  dependency: string[];           // backlog IDs
  completenessScore: number;      // 0-100
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
  confidenceLevel: number;        // 0-100
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

// ── product.model.ts ──

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  objective: string;
  kpi: string[];
  customerSegment: string;
  existingFeatures: string[];
  currentChallenges: string[];
  techStack: string[];
  dependencySystems: string[];
  complianceTags: string[];
  // Note: squad velocity & sprint capacity intentionally excluded
  // (out of scope — managed by scrum team agreement)
  teamId: string;
  poId: string;
  apoIds: string[];
  createdAt: Date;
}

// ── user.model.ts ──

export type UserRole = 'PO' | 'APO' | 'PMO' | 'CPO' | 'Dev' | 'BA' | 'QA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;             // initials e.g. "BS"
  productIds: string[];       // products they belong to
  trackIds?: string[];        // for multi-track teams
}

// ── roadmap.model.ts ──

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
  submissionReadiness?: number;   // 0-100 percentage
  readyCount?: number;
  totalCount?: number;
}

// ── ai-result.model.ts ──

export interface ImpactAnalysisResult {
  backlogId: string;
  targetQuarter: Quarter;
  roadmapImpacts: RoadmapImpact[];
  dependencyImpacts: DependencyImpact[];
  kpiImpacts: KPIImpact[];
  estimatedDelayInSprints: number;
  aiRecommendation: string;
  recommendedAction: 'keep' | 'move';
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

// ── activity.model.ts ──

export type ActivityType = 'ai_scored' | 'human_override' | 'dependency_conflict'
  | 'backlog_added' | 'prd_generated' | 'submission' | 'warning';

export interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  actorRole: UserRole;
  description: string;
  subDescription?: string;
  backlogId?: string;
  backlogTitle?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  productId: string;
}

// ── notification.model.ts ──

export type NotificationType = 'ai_scored' | 'deadline' | 'pmo_comment'
  | 'dependency_conflict' | 'emergency_approval' | 'submission_confirmed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl?: string;
  timestamp: Date;
}

// ── ui.model.ts ──

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type ModalType =
  | 'submit-pmo'
  | 'override-ai'
  | 'backlog-swap'
  | 'emergency-flag'
  | 're-analyze'
  | 'export-pdf'
  | 'product-switcher'
  | 'revert-override'
  | 'drag-confirm'
  | 'drag-final-warning';

export interface ModalConfig {
  type: ModalType;
  data?: any;
}

export type AILoadingStep =
  | 'Reading backlog context...'
  | 'Analyzing Jira history...'
  | 'Calculating RICE dimensions...'
  | 'Classifying MoSCoW...'
  | 'Generating reasoning...'
  | 'Mapping dependency chain...'
  | 'Analyzing roadmap consequences...'
  | 'Calculating KPI effects...'
  | 'Generating recommendations...'
  | 'Structuring PRD sections...'
  | 'Generating acceptance criteria...';

export type AILoadingState = 'idle' | 'loading' | 'revealing' | 'complete' | 'error';
```

-----

## 5. SIGNAL STORES

```typescript
// ── app.store.ts ──

export const appStore = {
  // Current user
  currentUser: signal<User>(MOCK_CURRENT_USER),

  // Active product
  activeProduct: signal<Product>(MOCK_PRODUCTS[0]),
  activeProductId: computed(() => appStore.activeProduct().id),

  // Products list (for switcher)
  products: signal<Product[]>(MOCK_PRODUCTS),

  // Notifications
  notifications: signal<Notification[]>(MOCK_NOTIFICATIONS),
  unreadCount: computed(() =>
    appStore.notifications().filter(n => !n.isRead).length
  ),

  // UI state
  isSidebarOpen: signal(true),
  activeModal: signal<ModalConfig | null>(null),
  toasts: signal<Toast[]>([]),
};

// ── backlog.store.ts ──

export const backlogStore = {
  // All backlogs for active product
  all: signal<Backlog[]>(MOCK_BACKLOGS),

  // Filters & sort
  filterStatus: signal<BacklogStatus | 'all'>('all'),
  filterQuarter: signal<Quarter | 'all'>('all'),
  filterMoscow: signal<MoSCoW | 'all'>('all'),
  searchQuery: signal(''),
  sortBy: signal<'rice' | 'date' | 'completeness'>('rice'),

  // Filtered list
  filtered: computed(() => {
    let list = backlogStore.all();
    const q = backlogStore.searchQuery().toLowerCase();
    if (q) list = list.filter(b => b.title.toLowerCase().includes(q));
    if (backlogStore.filterStatus() !== 'all')
      list = list.filter(b => b.status === backlogStore.filterStatus());
    if (backlogStore.filterQuarter() !== 'all')
      list = list.filter(b => b.targetQuarter === backlogStore.filterQuarter());
    return list.sort((a, b) =>
      (b.aiResult?.riceScore ?? 0) - (a.aiResult?.riceScore ?? 0)
    );
  }),

  // Stats
  totalCount: computed(() => backlogStore.all().length),
  scoredCount: computed(() =>
    backlogStore.all().filter(b => b.status === 'ai_scored' || b.status === 'ready').length
  ),
  prdDraftedCount: computed(() =>
    backlogStore.all().filter(b => b.status !== 'draft').length
  ),
  needsAttentionCount: computed(() =>
    backlogStore.all().filter(b => b.dependency.length > 0).length
  ),

  // AI loading state
  aiLoadingState: signal<AILoadingState>('idle'),
  aiLoadingStep: signal<AILoadingStep>('Reading backlog context...'),
  currentAnalyzingId: signal<string | null>(null),

  // Selected backlog for detail view
  selectedBacklogId: signal<string | null>(null),
  selectedBacklog: computed(() =>
    backlogStore.all().find(b => b.id === backlogStore.selectedBacklogId()) ?? null
  ),
};

// ── roadmap.store.ts ──

export const roadmapStore = {
  roadmap: signal<Roadmap>(MOCK_ROADMAP),
  viewMode: signal<'shadow' | 'final'>('shadow'),

  // Quarter data
  quarters: computed(() => roadmapStore.roadmap().quarters),

  // Drag state
  isDragging: signal(false),
  draggedBacklogId: signal<string | null>(null),
  dragTargetQuarter: signal<Quarter | null>(null),

  // Impact analysis after drag
  pendingDragImpact: signal<ImpactAnalysisResult | null>(null),
  showDragImpactModal: signal(false),

  // Submission readiness per quarter
  submissionReadiness: computed(() => {
    const q3 = roadmapStore.quarters().find(q => q.quarter === 'Q3');
    return q3?.submissionReadiness ?? 0;
  }),
  readyCount: computed(() => {
    const q3 = roadmapStore.quarters().find(q => q.quarter === 'Q3');
    return q3?.readyCount ?? 0;
  }),
  totalQ3Count: computed(() => {
    const q3 = roadmapStore.quarters().find(q => q.quarter === 'Q3');
    return q3?.totalCount ?? 0;
  }),
};
```

-----

## 6. MOCK DATA

```typescript
// ── mock-backlogs.ts ──

export const MOCK_BACKLOGS: Backlog[] = [
  {
    id: 'bl-001',
    title: 'Improve QRIS Retry Flow',
    description: 'Enhance the retry mechanism for failed QRIS transactions to reduce failure rate and improve user experience.',
    businessObjective: 'Reduce failed QRIS transactions by 30% in Q3 2025',
    targetUsers: 'myBCA Mobile users performing QRIS payments',
    impactArea: ['Revenue'],
    supportingEvidence: ['Analytics', 'Complaint Data'],
    estimatedImpact: 'Reduce 1.2M monthly failed transactions',
    riskIfNotImplemented: 'Continued revenue loss and user churn to competitor apps',
    effortEstimation: '8 story points',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 92,
    status: 'ready',
    isEmergency: false,
    aiResult: {
      riceScore: 15000,
      reach: { value: 50000, label: 'High', reasoning: 'Estimated 50,000 monthly active QRIS users based on transaction analytics' },
      impact: { value: 3, label: 'Massive', reasoning: 'Directly reduces failed transactions — core revenue impact' },
      confidence: { value: 0.8, label: 'High', reasoning: 'Supported by 3 months of QRIS analytics data' },
      effort: { value: 8, label: 'Medium', reasoning: 'Core infrastructure already exists, enhancement only' },
      moscow: 'Must Have',
      reasoning: {
        reach: 'Based on QRIS transaction volume analytics for Q2 2025, approximately 50,000 unique users perform QRIS transactions monthly.',
        impact: 'Failed QRIS transactions directly impact revenue. Each failed transaction is a lost sale opportunity.',
        confidence: 'Confidence level at 80% based on strong analytics data from QRIS dashboard and complaint reports.',
        effort: 'Existing payment infrastructure can be extended. No new system required.',
        summary: 'High priority backlog with strong data backing. Recommend inclusion in Q3 roadmap.',
        evidenceRefs: ['QRIS Analytics Q2 2025', 'Customer Complaint Report May 2025']
      },
      confidenceLevel: 80,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-05-24T14:30:00')
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2025-05-20T09:00:00'),
    updatedAt: new Date('2025-05-24T14:30:00'),
    productId: 'prod-001'
  },
  {
    id: 'bl-002',
    title: 'Login Biometrik — Face Recognition',
    description: 'Implement face recognition as an additional biometric authentication method for myBCA Mobile.',
    businessObjective: 'Improve login conversion rate and reduce friction for mobile users',
    targetUsers: 'All myBCA Mobile users with face recognition capable devices',
    impactArea: ['CX'],
    supportingEvidence: ['Survey', 'Analytics'],
    estimatedImpact: 'Increase login success rate by 18%',
    riskIfNotImplemented: 'Users continue to experience friction, potential churn to competitor apps',
    effortEstimation: '13 story points',
    targetQuarter: 'Q3',
    dependency: ['bl-005'],
    completenessScore: 88,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 13200,
      reach: { value: 45000, label: 'High', reasoning: 'Based on device capability analytics, 45% of users have face-capable devices' },
      impact: { value: 2, label: 'High', reasoning: 'Significant CX improvement — reduces login friction' },
      confidence: { value: 0.8, label: 'High', reasoning: 'Supported by user survey (n=2,400) and competitor analysis' },
      effort: { value: 13, label: 'High', reasoning: 'Requires Identity Service v2 integration (dependency)' },
      moscow: 'Must Have',
      reasoning: {
        reach: '45,000 monthly active users with face-recognition capable devices based on device analytics.',
        impact: 'High impact on customer experience. Login friction is top complaint in Q2 user survey.',
        confidence: '80% confidence based on user survey data and market research.',
        effort: 'Higher effort due to dependency on Identity Service v2 which needs to be ready first.',
        summary: 'Strong CX backlog but dependent on Identity Service v2. Coordinate delivery timeline.',
        evidenceRefs: ['User Survey Q2 2025', 'Device Capability Report']
      },
      confidenceLevel: 80,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-05-24T14:35:00')
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2025-05-21T10:00:00'),
    updatedAt: new Date('2025-05-24T14:35:00'),
    productId: 'prod-001'
  },
  {
    id: 'bl-003',
    title: 'Notifikasi Transaksi Real-time',
    description: 'Push notification for every transaction in real-time with customizable alert preferences.',
    businessObjective: 'Increase user engagement and transaction awareness',
    targetUsers: 'All myBCA Mobile active users',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Analytics', 'Business Request'],
    estimatedImpact: 'Increase DAU by 12%, reduce fraud inquiry calls by 20%',
    riskIfNotImplemented: 'Users unaware of transactions, higher fraud dispute rate',
    effortEstimation: '8 story points',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 78,
    status: 'not_ready',
    isEmergency: false,
    aiResult: {
      riceScore: 11800,
      reach: { value: 80000, label: 'High', reasoning: 'All active users eligible for push notifications' },
      impact: { value: 2, label: 'High', reasoning: 'Improves engagement and reduces fraud inquiry overhead' },
      confidence: { value: 0.75, label: 'Medium', reasoning: 'Based on analytics and business request, limited user survey data' },
      effort: { value: 8, label: 'Medium', reasoning: 'Push notification infrastructure partially exists' },
      moscow: 'Should Have',
      reasoning: {
        reach: '80,000 monthly active users can receive push notifications.',
        impact: 'High impact on engagement and fraud awareness. Reduces call center load.',
        confidence: '75% confidence — needs more user validation data.',
        effort: 'Moderate effort, existing push infrastructure can be extended.',
        summary: 'Good backlog but needs additional evidence. Completeness should be improved.',
        evidenceRefs: ['DAU Analytics Q2', 'Business Request BR-2025-042']
      },
      confidenceLevel: 75,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-05-23T11:00:00')
    },
    createdBy: 'user-apo-001',
    createdAt: new Date('2025-05-22T08:00:00'),
    updatedAt: new Date('2025-05-23T11:00:00'),
    productId: 'prod-001'
  },
  {
    id: 'bl-004',
    title: 'Onboarding Nasabah Digital v2',
    description: 'Redesign the digital onboarding flow with simplified KYC and document upload.',
    businessObjective: 'Reduce onboarding drop-off rate by 40%',
    targetUsers: 'New myBCA Mobile users',
    impactArea: ['Ops', 'CX'],
    supportingEvidence: ['Analytics', 'Survey'],
    estimatedImpact: 'Reduce drop-off from 60% to 20%',
    riskIfNotImplemented: 'Continued high acquisition cost, low conversion',
    effortEstimation: '13 story points',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 85,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 10400,
      reach: { value: 15000, label: 'Medium', reasoning: 'New user acquisition per month based on marketing data' },
      impact: { value: 3, label: 'Massive', reasoning: 'Directly impacts acquisition conversion — strategic KPI' },
      confidence: { value: 0.8, label: 'High', reasoning: 'Strong data from funnel analytics and user research' },
      effort: { value: 13, label: 'High', reasoning: 'KYC integration with external provider required' },
      moscow: 'Should Have',
      reasoning: {
        reach: '15,000 new users attempt onboarding monthly.',
        impact: 'Massive impact if drop-off reduced — directly tied to Q3 acquisition KPI.',
        confidence: '80% confidence based on funnel data and user interview findings.',
        effort: 'Higher effort due to KYC provider integration and regulatory requirements.',
        summary: 'Strategic backlog for acquisition KPI. Consider for Q3 but monitor effort.',
        evidenceRefs: ['Onboarding Funnel Analytics', 'User Research Report April 2025']
      },
      confidenceLevel: 80,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-05-22T15:00:00')
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2025-05-19T14:00:00'),
    updatedAt: new Date('2025-05-22T15:00:00'),
    productId: 'prod-001'
  },
  {
    id: 'bl-005',
    title: 'Identity Service v2 Integration',
    description: 'Upgrade to Identity Service v2 to support biometric and advanced authentication methods.',
    businessObjective: 'Enable advanced authentication capabilities across all myBCA products',
    targetUsers: 'Internal — enables other features',
    impactArea: ['Ops'],
    supportingEvidence: ['Business Request'],
    estimatedImpact: 'Enables Login Biometrik and 2 other planned features',
    riskIfNotImplemented: 'Login Biometrik and other auth features blocked',
    effortEstimation: '20 story points',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 90,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 9500,
      reach: { value: 45000, label: 'High', reasoning: 'Enables features for 45,000+ users' },
      impact: { value: 2, label: 'High', reasoning: 'Foundational — enables multiple dependent features' },
      confidence: { value: 0.9, label: 'High', reasoning: 'Clear technical requirement, well-defined scope' },
      effort: { value: 20, label: 'High', reasoning: 'Full integration with external identity provider' },
      moscow: 'Must Have',
      reasoning: {
        reach: 'Foundational service that unlocks features for 45,000+ users.',
        impact: 'High impact as it enables Login Biometrik and other planned features.',
        confidence: '90% confidence — well-defined technical scope.',
        effort: 'High effort due to full identity provider integration.',
        summary: 'Must be delivered before Login Biometrik. Critical path item.',
        evidenceRefs: ['Technical Architecture Decision', 'Business Request BR-2025-038']
      },
      confidenceLevel: 90,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-05-21T16:00:00')
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2025-05-18T10:00:00'),
    updatedAt: new Date('2025-05-21T16:00:00'),
    productId: 'prod-001'
  },
  {
    id: 'bl-006',
    title: 'Pembaruan Kebijakan OTP Compliance',
    description: 'Update OTP mechanism to comply with new OJK regulation effective Q4 2025.',
    businessObjective: 'Ensure compliance with OJK Circular SE-12/2025',
    targetUsers: 'All myBCA Mobile users using OTP',
    impactArea: ['Compliance'],
    supportingEvidence: [],
    estimatedImpact: 'Regulatory compliance — mandatory',
    riskIfNotImplemented: 'Regulatory non-compliance, potential sanctions',
    effortEstimation: '',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 45,
    status: 'draft',
    isEmergency: false,
    createdBy: 'user-apo-001',
    createdAt: new Date('2025-05-24T10:00:00'),
    updatedAt: new Date('2025-05-24T10:00:00'),
    productId: 'prod-001'
  },
];

// ── mock-users.ts ──

export const MOCK_CURRENT_USER: User = {
  id: 'user-po-001',
  name: 'Budi Santoso',
  email: 'budi.santoso@bca.co.id',
  role: 'PO',
  avatar: 'BS',
  productIds: ['prod-001', 'prod-002'],
};

export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: 'user-apo-001',
    name: 'Sari Dewi',
    email: 'sari.dewi@bca.co.id',
    role: 'APO',
    avatar: 'SD',
    productIds: ['prod-001'],
  },
  {
    id: 'user-pmo-001',
    name: 'Anton Wijaya',
    email: 'anton.wijaya@bca.co.id',
    role: 'PMO',
    avatar: 'AW',
    productIds: [],
  },
  {
    id: 'user-dev-001',
    name: 'Citra Dewi',
    email: 'citra.dewi@bca.co.id',
    role: 'Dev',
    avatar: 'CD',
    productIds: ['prod-001'],
    trackIds: ['track-mobile'],
  },
  {
    id: 'user-dev-002',
    name: 'Dodi Firmansyah',
    email: 'dodi.firmansyah@bca.co.id',
    role: 'Dev',
    avatar: 'DF',
    productIds: ['prod-001', 'prod-003'],  // shared member
    trackIds: ['track-backend'],
  },
  {
    id: 'user-ba-001',
    name: 'Eka Rahayu',
    email: 'eka.rahayu@bca.co.id',
    role: 'BA',
    avatar: 'ER',
    productIds: ['prod-001'],
  },
  {
    id: 'user-qa-001',
    name: 'Fajar Maulana',
    email: 'fajar.maulana@bca.co.id',
    role: 'QA',
    avatar: 'FM',
    productIds: ['prod-001'],
  },
];

// ── mock-products.ts ──

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'myBCA Mobile',
    description: 'BCA\'s primary mobile banking super app for individual customers',
    category: 'Mobile Banking',
    objective: 'Increase digital transaction volume and customer engagement',
    kpi: ['DAU growth 15%', 'Transaction success rate > 99%', 'App rating > 4.5'],
    customerSegment: 'Individual BCA customers, age 18-45',
    existingFeatures: ['Transfer', 'QRIS Payment', 'Bill Payment', 'Savings', 'Investment'],
    currentChallenges: ['High QRIS failure rate', 'Login friction', 'Low onboarding conversion'],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis'],
    dependencySystems: ['Core Banking', 'Identity Service v1', 'Payment Gateway', 'Notification Service'],
    complianceTags: ['OJK', 'PBI', 'POJK-38'],
    teamId: 'team-001',
    poId: 'user-po-001',
    apoIds: ['user-apo-001'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'prod-002',
    name: 'BCA Mobile Bisnis',
    description: 'Mobile banking app for BCA business customers',
    category: 'Business Banking',
    objective: 'Simplify business banking operations for SME customers',
    kpi: ['Active business users 10K', 'Transaction volume growth 20%'],
    customerSegment: 'SME business owners',
    existingFeatures: ['Business Transfer', 'Payroll', 'Tax Payment', 'Account Statement'],
    currentChallenges: ['Complex UI for bulk transactions', 'Limited reporting features'],
    techStack: ['React Native', 'Java Spring', 'Oracle DB'],
    dependencySystems: ['Core Banking', 'Tax Service', 'Payroll Engine'],
    complianceTags: ['OJK', 'POJK-38'],
    teamId: 'team-002',
    poId: 'user-po-001',
    apoIds: [],
    createdAt: new Date('2024-03-01'),
  },
];

// ── mock-roadmap.ts ──

export const MOCK_ROADMAP: Roadmap = {
  id: 'rm-001',
  productId: 'prod-001',
  year: 2025,
  quarters: [
    {
      quarter: 'Q1',
      backlogIds: ['bl-q1-001', 'bl-q1-002'],
      status: 'completed',
      submissionReadiness: 100,
      readyCount: 2,
      totalCount: 2,
    },
    {
      quarter: 'Q2',
      backlogIds: ['bl-q2-001', 'bl-q2-002'],
      status: 'submitted',
      submissionReadiness: 100,
      readyCount: 2,
      totalCount: 2,
    },
    {
      quarter: 'Q3',
      backlogIds: ['bl-001', 'bl-002', 'bl-003', 'bl-004'],
      status: 'draft',
      submissionReadiness: 75,
      readyCount: 3,
      totalCount: 4,
    },
    {
      quarter: 'Q4',
      backlogIds: ['bl-004'],
      status: 'shadow',
      submissionReadiness: 0,
      readyCount: 0,
      totalCount: 1,
    },
  ],
  status: 'draft',
  lastModifiedAt: new Date('2025-05-24T14:00:00'),
};

// ── mock-activities.ts ──

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    type: 'human_override',
    actor: 'Budi Santoso',
    actorRole: 'PO',
    description: 'Overrode QRIS Retry Flow priority: Medium → High',
    subDescription: '"Strategic initiative Q4 BCA campaign"',
    backlogId: 'bl-001',
    backlogTitle: 'Improve QRIS Retry Flow',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    productId: 'prod-001'
  },
  {
    id: 'act-002',
    type: 'ai_scored',
    actor: 'COMPASS AI',
    actorRole: 'PO',
    description: 'Scored Login Biometrik',
    subDescription: 'RICE: 13,200 · Confidence: 80% · Prompt v1.2.3',
    backlogId: 'bl-002',
    backlogTitle: 'Login Biometrik — Face Recognition',
    timestamp: new Date(Date.now() - 23 * 60 * 1000),
    productId: 'prod-001'
  },
  {
    id: 'act-003',
    type: 'dependency_conflict',
    actor: 'COMPASS AI',
    actorRole: 'PO',
    description: 'Detected dependency conflict',
    subDescription: 'Biometrik ↔ Identity Service v2',
    backlogId: 'bl-002',
    backlogTitle: 'Login Biometrik — Face Recognition',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    productId: 'prod-001'
  },
  {
    id: 'act-004',
    type: 'backlog_added',
    actor: 'Sari Dewi',
    actorRole: 'APO',
    description: 'Added new backlog: OTP Compliance Update',
    subDescription: 'Completeness: 45% — needs completion',
    backlogId: 'bl-006',
    backlogTitle: 'Pembaruan Kebijakan OTP Compliance',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    productId: 'prod-001'
  },
  {
    id: 'act-005',
    type: 'prd_generated',
    actor: 'COMPASS AI',
    actorRole: 'PO',
    description: 'Generated PRD draft for Notifikasi Realtime',
    subDescription: 'For: Notifikasi Transaksi Real-time',
    backlogId: 'bl-003',
    backlogTitle: 'Notifikasi Transaksi Real-time',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    productId: 'prod-001'
  },
];

// ── mock-notifications.ts ──

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'ai_scored',
    title: 'AI Scoring Complete',
    body: 'Login Biometrik scored — RICE: 13,200',
    isRead: false,
    actionUrl: '/backlog/bl-002',
    timestamp: new Date(Date.now() - 23 * 60 * 1000),
  },
  {
    id: 'notif-002',
    type: 'deadline',
    title: 'Submission Deadline Approaching',
    body: 'Q3 submission due in 18 days — 4 backlogs pending',
    isRead: false,
    actionUrl: '/pmo-submission',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'notif-003',
    type: 'dependency_conflict',
    title: 'Dependency Conflict Detected',
    body: 'Biometrik ↔ Identity Service v2',
    isRead: false,
    actionUrl: '/impact-analysis',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'notif-004',
    type: 'pmo_comment',
    title: 'PMO Comment',
    body: 'PMO commented on your Q2 submission',
    isRead: true,
    actionUrl: '/pmo-submission',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];
```

-----

## 7. ROUTING CONFIG

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'backlog', loadComponent: () => import('./pages/backlog-list/backlog-list.component').then(m => m.BacklogListComponent) },
      { path: 'backlog/new', loadComponent: () => import('./pages/backlog-input/backlog-input.component').then(m => m.BacklogInputComponent) },
      { path: 'backlog/:id', loadComponent: () => import('./pages/backlog-detail/backlog-detail.component').then(m => m.BacklogDetailComponent) },
      { path: 'backlog/:id/edit', loadComponent: () => import('./pages/backlog-input/backlog-input.component').then(m => m.BacklogInputComponent) },
      { path: 'roadmap', loadComponent: () => import('./pages/roadmap/roadmap.component').then(m => m.RoadmapComponent) },
      { path: 'impact-analysis', loadComponent: () => import('./pages/impact-analysis/impact-analysis.component').then(m => m.ImpactAnalysisComponent) },
      { path: 'prd-draft', loadComponent: () => import('./pages/prd-draft/prd-draft.component').then(m => m.PrdDraftComponent) },
      { path: 'prd-draft/:backlogId', loadComponent: () => import('./pages/prd-draft/prd-draft.component').then(m => m.PrdDraftComponent) },
      { path: 'pmo-submission', loadComponent: () => import('./pages/pmo-submission/pmo-submission.component').then(m => m.PmoSubmissionComponent) },
      { path: 'audit-trail', loadComponent: () => import('./pages/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent) },
      { path: 'team-members', loadComponent: () => import('./pages/team-members/team-members.component').then(m => m.TeamMembersComponent) },
      { path: 'product-context', loadComponent: () => import('./pages/product-context/product-context.component').then(m => m.ProductContextComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
```

-----

## 8. TAILWIND CONFIG

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bca: {
          navy:       '#083767',
          primary:    '#0d5cab',
          hover:      '#3174b8',
          light:      '#4a85c0',
          accent:     '#e7eff7',
          'accent-dark': '#dbeafe',
        },
        success: {
          DEFAULT: '#12b76a',
          bg:      '#dcfce7',
        },
        warning: {
          DEFAULT: '#f79009',
          bg:      '#fef3c7',
        },
        danger: {
          DEFAULT: '#f04438',
          bg:      '#fee4e2',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn:  '8px',
      },
      boxShadow: {
        'blue-sm': '0 1px 3px rgba(13,92,171,0.07), 0 1px 2px rgba(16,24,40,0.05)',
        'blue-md': '0 4px 16px rgba(13,92,171,0.14), 0 1px 4px rgba(16,24,40,0.06)',
        'blue-btn': '0 1px 3px rgba(13,92,171,0.28)',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-spring':   'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      }
    }
  },
  plugins: [],
};
```

-----

## 9. AI SERVICE (MOCK)

```typescript
// ai.service.ts
@Injectable({ providedIn: 'root' })
export class AiService {

  private loadingSteps: AILoadingStep[] = [
    'Reading backlog context...',
    'Analyzing Jira history...',
    'Calculating RICE dimensions...',
    'Classifying MoSCoW...',
    'Generating reasoning...',
  ];

  analyzeBacklog(backlog: Backlog): Observable<AIResult> {
    // Simulate AI processing with realistic delay
    return new Observable(observer => {
      let stepIndex = 0;

      // Update loading step every 600ms
      const stepInterval = setInterval(() => {
        if (stepIndex < this.loadingSteps.length) {
          backlogStore.aiLoadingStep.set(this.loadingSteps[stepIndex]);
          stepIndex++;
        }
      }, 600);

      // Complete after 3.2 seconds
      setTimeout(() => {
        clearInterval(stepInterval);
        const result = this.generateMockResult(backlog);
        observer.next(result);
        observer.complete();
      }, 3200);
    });
  }

  analyzeImpact(backlogId: string, targetQuarter: Quarter): Observable<ImpactAnalysisResult> {
    const steps: AILoadingStep[] = [
      'Mapping dependency chain...',
      'Analyzing roadmap consequences...',
      'Calculating KPI effects...',
      'Generating recommendations...',
    ];

    return new Observable(observer => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < steps.length) {
          backlogStore.aiLoadingStep.set(steps[i]);
          i++;
        }
      }, 700);

      setTimeout(() => {
        clearInterval(interval);
        observer.next(MOCK_IMPACT_RESULT);
        observer.complete();
      }, 3000);
    });
  }

  generatePRD(backlog: Backlog): Observable<string> {
    const steps: AILoadingStep[] = [
      'Analyzing backlog context...',
      'Structuring PRD sections...',
      'Generating acceptance criteria...',
    ];

    return new Observable(observer => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < steps.length) {
          backlogStore.aiLoadingStep.set(steps[i]);
          i++;
        }
      }, 800);

      setTimeout(() => {
        clearInterval(interval);
        observer.next(MOCK_PRD_CONTENT);
        observer.complete();
      }, 2800);
    });
  }

  private generateMockResult(backlog: Backlog): AIResult {
    // Return realistic mock result based on backlog content
    return MOCK_BACKLOGS.find(b => b.id === backlog.id)?.aiResult
      ?? MOCK_BACKLOGS[0].aiResult!;
  }
}
```

-----

## 10. DRAG & DROP IMPLEMENTATION NOTES

```typescript
// roadmap.component.ts — key drag & drop logic

// Angular CDK imports needed:
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

// Template pattern:
// <div cdkDropListGroup>
//   <div *ngFor="let quarter of quarters"
//        cdkDropList
//        [cdkDropListData]="quarter.backlogs"
//        (cdkDropListDropped)="onDrop($event, quarter)">
//     <div *ngFor="let backlog of quarter.backlogs"
//          cdkDrag
//          [cdkDragDisabled]="isFinalMode && isLocked(backlog)">
//     </div>
//   </div>
// </div>

onDrop(event: CdkDragDrop<Backlog[]>, targetQuarter: RoadmapQuarter) {
  if (event.previousContainer === event.container) {
    // Same quarter — reorder
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.toastService.show('success', 'Reordered successfully');
  } else {
    // Different quarter — show impact analysis first
    this.pendingDrop.set(event);
    this.pendingTargetQuarter.set(targetQuarter.quarter);
    this.showImpactModal.set(true);

    // Run mini impact analysis
    this.aiService.analyzeImpact(
      event.item.data.id,
      targetQuarter.quarter
    ).subscribe(result => {
      this.impactResult.set(result);
    });
  }
}

confirmDrop() {
  const event = this.pendingDrop();
  if (!event) return;

  transferArrayItem(
    event.previousContainer.data,
    event.container.data,
    event.previousIndex,
    event.currentIndex,
  );

  this.showImpactModal.set(false);
  this.toastService.show('success', 'Moved — recorded in audit trail');
}

cancelDrop() {
  this.showImpactModal.set(false);
  this.pendingDrop.set(null);
}
```

-----

## 11. PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "@angular/animations": "^21.0.0",
    "@angular/cdk": "^21.0.0",
    "@angular/common": "^21.0.0",
    "@angular/compiler": "^21.0.0",
    "@angular/core": "^21.0.0",
    "@angular/forms": "^21.0.0",
    "@angular/platform-browser": "^21.0.0",
    "@angular/router": "^21.0.0",
    "lucide-angular": "^0.446.0",
    "rxjs": "~7.8.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular/cli": "^21.0.0",
    "@angular/compiler-cli": "^21.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "typescript": "~5.6.0"
  }
}
```

-----

## 12. CONTEXT FOR CLAUDE CODE

Saat memulai sesi Claude Code, gunakan prompt ini:

```
Saya ingin membangun COMPASS — sebuah AI-Assisted 
Product Planning & Prioritization Platform untuk internal BCA.

Tech stack:
- Angular 21
- Signals (bukan NgRx)
- Standalone components
- Tailwind CSS + Custom SCSS
- Angular CDK DragDrop
- Lucide Angular icons
- No backend — semua mock data

Ini adalah prototype untuk lomba inovasi BCA.
Total ada 55 frames yang perlu dibangun.

Dokumen referensi:
1. Technical Spec (file ini) — interfaces, mock data, store
2. Interaction Spec — semua clickable flow, 55 frames
3. Design Handoff — color system, typography, components

Color system utama:
- BCA Navy: #083767 (sidebar)
- BCA Primary: #0d5cab (primary blue)
- BCA Accent: #e7eff7 (light blue bg)

Mulai dari: setup project → layout component → 
sidebar → topbar → dashboard page
```

-----

*Technical Spec untuk COMPASS Angular Prototype*
*Siap untuk handoff ke Claude Code*