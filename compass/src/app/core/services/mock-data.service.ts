import { Injectable } from '@angular/core';
import { Backlog, BacklogStatus, ImpactArea, Quarter, MoSCoW, EvidenceType } from '../models/backlog.model';
import { Product } from '../models/product.model';
import { User, UserRole } from '../models/user.model';
import { Roadmap } from '../models/roadmap.model';
import { Activity } from '../models/activity.model';
import { Notification } from '../models/notification.model';
import { ImpactAnalysisResult } from '../models/ai-result.model';

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
    productIds: ['prod-001', 'prod-003'],
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

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'myBCA Mobile',
    description: "BCA's primary mobile banking super app for individual customers",
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
      backlogIds: ['bl-005'],
      status: 'shadow',
      submissionReadiness: 0,
      readyCount: 0,
      totalCount: 1,
    },
  ],
  status: 'draft',
  lastModifiedAt: new Date('2025-05-24T14:00:00'),
};

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

export const MOCK_IMPACT_RESULT: ImpactAnalysisResult = {
  backlogId: 'bl-001',
  targetQuarter: 'Q4',
  roadmapImpacts: [
    {
      affectedBacklogId: 'bl-002',
      affectedBacklogTitle: 'Login Biometrik — Face Recognition',
      description: 'Depends on QRIS infrastructure being stable first',
      severity: 'high',
    },
    {
      affectedBacklogId: 'bl-003',
      affectedBacklogTitle: 'Notifikasi Transaksi Real-time',
      description: 'Minor delay expected due to shared backend resources',
      severity: 'medium',
    },
  ],
  dependencyImpacts: [
    {
      dependencyId: 'dep-001',
      dependencyTitle: 'Payment Gateway v3',
      description: 'QRIS Retry requires Payment Gateway v3 to be stable',
      isBlocker: false,
    },
  ],
  kpiImpacts: [
    {
      kpi: 'Q3 Revenue KPI',
      description: 'Moving to Q4 risks missing the Q3 revenue target of reducing failed transactions by 30%',
      severity: 'high',
    },
    {
      kpi: 'Transaction Success Rate',
      description: 'Delay of 2 sprints estimated for success rate improvement',
      severity: 'medium',
    },
  ],
  estimatedDelayInSprints: 2,
  aiRecommendation: 'Keeping QRIS Retry in Q3 is strongly recommended. The revenue impact is significant and the dependency chain is manageable. If Q4 is necessary, consider moving Notifikasi Transaksi instead — it has a 40% lower dependency risk.',
  recommendedAction: 'keep',
};

export const MOCK_PRD_CONTENT = `## Problem Statement
The current QRIS transaction flow has a high failure rate of approximately 8.5%, causing significant revenue loss and customer frustration. Users who experience failed transactions often abandon the payment entirely, leading to churn.

## Business Objective  
Reduce failed QRIS transactions by 30% in Q3 2025, improving transaction success rate from 91.5% to above 99%.

## User Stories
- As a myBCA Mobile user, I want QRIS payments to automatically retry when they fail, so that I don't have to manually retry the transaction
- As a myBCA Mobile user, I want to see clear feedback when a retry is happening, so that I know the app is working
- As a myBCA Mobile user, I want to receive a notification if a retry ultimately fails, so that I can take action

## Scope & Features
**In Scope:**
- Automatic retry mechanism (up to 3 attempts)
- Retry progress indicator in UI
- Smart retry timing with exponential backoff
- Failure notification after all retries exhausted
- Audit log for retry attempts

**Out of Scope:**
- Manual retry button (covered by existing flow)
- Retry for non-QRIS payment methods

## Acceptance Criteria
1. System automatically retries failed QRIS transactions up to 3 times
2. Each retry uses exponential backoff: 1s, 3s, 9s
3. User sees retry progress indicator during retries
4. If all retries fail, user receives push notification
5. All retry attempts are logged in audit trail
6. Success rate of QRIS transactions improves by at least 30%

## Non-Functional Requirements
- Retry mechanism must not impact performance for successful transactions
- Maximum additional latency: 50ms for the retry logic
- Must work on both iOS 14+ and Android 9+

## Dependencies
- Payment Gateway v3 API stability
- Push Notification Service for failure alerts
- QRIS transaction logging system

## Open Questions
1. What is the fallback if retry fails 3 times and push notification service is down?
2. Should we show the retry count to the user (e.g., "Retrying 2/3...")?`;

export const MOCK_PRD_SECTIONS = {
  overview: `QRIS Retry Mechanism is a feature that automatically retries failed QRIS transactions in myBCA Mobile. The goal is to reduce failed transactions from 8.5% to below 1%, directly improving the Q3 revenue target and customer satisfaction.`,
  problemStatement: `The current QRIS transaction flow has a high failure rate of approximately 8.5%, causing significant revenue loss and customer frustration. Users who experience failed transactions often abandon the payment entirely, leading to churn.`,
  goalsAndKPIs: `Primary Goal: Reduce failed QRIS transactions by 30% in Q3 2025.\n\nKPIs:\n- Transaction success rate: 91.5% → above 99%\n- Customer retry abandonment: reduce by 50%\n- Revenue impact: +Rp 4.2B projected for Q3`,
  scope: `In Scope:\n- Automatic retry mechanism (up to 3 attempts)\n- Retry progress indicator in UI\n- Smart retry timing with exponential backoff\n- Failure notification after all retries exhausted\n- Audit log for retry attempts\n\nOut of Scope:\n- Manual retry button (covered by existing flow)\n- Retry for non-QRIS payment methods`,
  requirements: `Functional Requirements:\n1. System automatically retries failed QRIS transactions up to 3 times\n2. Each retry uses exponential backoff: 1s, 3s, 9s\n3. User sees retry progress indicator during retries\n4. If all retries fail, user receives push notification\n5. All retry attempts are logged in audit trail\n\nNon-Functional Requirements:\n- Maximum additional latency: 50ms for the retry logic\n- Must work on iOS 14+ and Android 9+\n- Zero impact on successful transactions`,
  risks: `1. Payment Gateway v3 Dependency\n   Risk: Retry mechanism depends on PGW v3 stability\n   Mitigation: Fallback to PGW v2 with graceful degradation\n\n2. User Experience During Retry\n   Risk: Users may cancel during retry window\n   Mitigation: Clear progress indicator with estimated wait time\n\n3. Audit Log Volume\n   Risk: 3x increase in transaction log volume\n   Mitigation: Log compression + archival after 90 days`,
};

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getBacklogs(): Backlog[] { return [...MOCK_BACKLOGS]; }
  getUsers(): User[] { return [...MOCK_USERS]; }
  getProducts(): Product[] { return [...MOCK_PRODUCTS]; }
  getRoadmap(): Roadmap { return { ...MOCK_ROADMAP }; }
  getActivities(): Activity[] { return [...MOCK_ACTIVITIES]; }
  getNotifications(): Notification[] { return [...MOCK_NOTIFICATIONS]; }
  getCurrentUser(): User { return { ...MOCK_CURRENT_USER }; }
  getImpactResult(): ImpactAnalysisResult { return { ...MOCK_IMPACT_RESULT }; }
  getPRDContent(): string { return MOCK_PRD_CONTENT; }
}
