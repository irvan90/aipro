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
  // ── Q1 2026 — Completed (Jan–Mar) ─────────────────────────────────────────
  {
    id: 'bl-q1-001',
    title: 'Redesign Transfer Flow',
    description: 'Simplify the fund transfer flow with a single-page layout, reducing steps from 5 to 2.',
    businessObjective: 'Improve transfer conversion rate and reduce drop-off',
    targetUsers: 'All myBCA Mobile users performing transfers',
    impactArea: ['CX'],
    supportingEvidence: ['Analytics', 'Survey'],
    estimatedImpact: 'Reduce transfer abandonment by 35%',
    riskIfNotImplemented: 'Continued high abandonment on transfer flow',
    effortEstimation: '8 story points',
    targetQuarter: 'Q1',
    dependency: [],
    completenessScore: 100,
    status: 'submitted',
    isEmergency: false,
    aiResult: {
      riceScore: 12000,
      reach: { value: 70000, label: 'High', reasoning: 'Estimated 70K monthly transfer users' },
      impact: { value: 2, label: 'High', reasoning: 'Core UX improvement for most-used feature' },
      confidence: { value: 0.85, label: 'High', reasoning: 'Validated by A/B test data Q4 2025' },
      effort: { value: 8, label: 'Medium', reasoning: 'UI-only change, no backend change' },
      moscow: 'Must Have',
      reasoning: {
        reach: '70,000 users perform fund transfers monthly.',
        impact: 'Direct impact on primary product KPI — transfer success rate.',
        confidence: '85% confidence from A/B test data.',
        effort: 'Moderate effort — UI redesign only.',
        summary: 'High priority, delivered Q1 2026.',
        evidenceRefs: ['A/B Test Report Q4 2025', 'Transfer Funnel Analytics'],
      },
      confidenceLevel: 85,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-12-10T10:00:00'),
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2025-12-01T09:00:00'),
    updatedAt: new Date('2026-02-15T14:00:00'),
    productId: 'prod-001',
  },
  {
    id: 'bl-q1-002',
    title: 'Dark Mode Implementation',
    description: 'Full dark mode support across all screens in myBCA Mobile.',
    businessObjective: 'Increase app rating and daily engagement time',
    targetUsers: 'All myBCA Mobile users',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Survey', 'Business Request'],
    estimatedImpact: 'Increase app rating from 4.3 → 4.6, extend session time 12%',
    riskIfNotImplemented: 'Lower app store rating vs competitors',
    effortEstimation: '13 story points',
    targetQuarter: 'Q1',
    dependency: [],
    completenessScore: 100,
    status: 'submitted',
    isEmergency: false,
    aiResult: {
      riceScore: 8500,
      reach: { value: 80000, label: 'High', reasoning: 'All active users benefit from dark mode' },
      impact: { value: 1, label: 'Medium', reasoning: 'Quality-of-life improvement — indirect revenue via retention' },
      confidence: { value: 0.8, label: 'High', reasoning: 'User survey: 68% prefer dark mode' },
      effort: { value: 13, label: 'High', reasoning: 'All screens need theme variants' },
      moscow: 'Should Have',
      reasoning: {
        reach: '80,000 active users.',
        impact: 'Indirect impact through retention and store rating.',
        confidence: '80% from user survey (n=3,200).',
        effort: 'High — requires theming across all 40+ screens.',
        summary: 'Good CX win. Delivered Q1 2026.',
        evidenceRefs: ['User Survey Dec 2025', 'App Store Review Analysis'],
      },
      confidenceLevel: 80,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-11-20T11:00:00'),
    },
    createdBy: 'user-apo-001',
    createdAt: new Date('2025-11-15T10:00:00'),
    updatedAt: new Date('2026-03-20T09:00:00'),
    productId: 'prod-001',
  },
  {
    id: 'bl-q1-003',
    title: 'KYC Document Upload v2',
    description: 'Upgrade KYC document upload with real-time validation and auto-OCR for ID cards.',
    businessObjective: 'Reduce KYC rejection rate and manual review queue',
    targetUsers: 'New myBCA users during onboarding',
    impactArea: ['Compliance', 'Ops'],
    supportingEvidence: ['Business Request', 'Analytics'],
    estimatedImpact: 'Reduce KYC rejection rate from 22% to under 8%',
    riskIfNotImplemented: 'Regulatory non-compliance, high ops cost for manual review',
    effortEstimation: '10 story points',
    targetQuarter: 'Q1',
    dependency: [],
    completenessScore: 100,
    status: 'submitted',
    isEmergency: false,
    aiResult: {
      riceScore: 7200,
      reach: { value: 12000, label: 'Medium', reasoning: '12,000 new users monthly go through KYC' },
      impact: { value: 3, label: 'Massive', reasoning: 'Compliance-critical: directly reduces rejection & ops cost' },
      confidence: { value: 0.9, label: 'High', reasoning: 'Well-defined compliance requirement from OJK' },
      effort: { value: 10, label: 'Medium', reasoning: 'OCR vendor API integration required' },
      moscow: 'Must Have',
      reasoning: {
        reach: '12,000 new users monthly.',
        impact: 'Massive ops cost reduction and compliance improvement.',
        confidence: '90% from clear compliance requirement.',
        effort: 'Moderate — vendor OCR API integration.',
        summary: 'Compliance-driven, delivered Q1 2026.',
        evidenceRefs: ['OJK Circular 2025', 'Onboarding Rejection Analytics'],
      },
      confidenceLevel: 90,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2025-12-05T14:00:00'),
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2025-12-01T11:00:00'),
    updatedAt: new Date('2026-03-28T10:00:00'),
    productId: 'prod-001',
  },
  // ── Q2 2026 — Current (Apr–Jun, ongoing) ──────────────────────────────────
  {
    id: 'bl-q2-001',
    title: 'BCA One Click Payment',
    description: 'Saved merchant payment with one-tap checkout for frequent merchants (Tokopedia, Grab, Gojek).',
    businessObjective: 'Increase payment transaction volume and reduce checkout friction',
    targetUsers: 'myBCA Mobile users with saved merchant accounts',
    impactArea: ['Revenue', 'CX'],
    supportingEvidence: ['Analytics', 'Business Request'],
    estimatedImpact: 'Increase merchant payment volume by 25%, reduce checkout time by 60%',
    riskIfNotImplemented: 'Users prefer competitor wallets for quick checkout',
    effortEstimation: '10 story points',
    targetQuarter: 'Q2',
    dependency: [],
    completenessScore: 90,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 13800,
      reach: { value: 55000, label: 'High', reasoning: '55K users linked to 3+ merchant accounts' },
      impact: { value: 3, label: 'Massive', reasoning: 'Core revenue driver — directly increases transaction volume' },
      confidence: { value: 0.8, label: 'High', reasoning: 'Validated by merchant partner data and competitor analysis' },
      effort: { value: 10, label: 'Medium', reasoning: 'Merchant API already integrated — UX layer only' },
      moscow: 'Must Have',
      reasoning: {
        reach: '55,000 active users with saved merchants.',
        impact: 'Massive revenue impact — reduces friction to zero for repeat payments.',
        confidence: '80% from merchant transaction data.',
        effort: 'Moderate — merchant APIs already exist.',
        summary: 'High priority Q2 item. Strong revenue case.',
        evidenceRefs: ['Merchant Partner Analytics Q1 2026', 'Competitor Feature Analysis'],
      },
      confidenceLevel: 80,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2026-04-10T14:30:00'),
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2026-03-20T09:00:00'),
    updatedAt: new Date('2026-04-10T14:30:00'),
    productId: 'prod-001',
  },
  {
    id: 'bl-q2-002',
    title: 'Tabungan Emas Integration',
    description: 'In-app gold savings investment feature integrated with BCA partner (Antam/Pegadaian).',
    businessObjective: 'Expand investment product portfolio and increase AUM',
    targetUsers: 'myBCA Mobile users with savings account, age 25–45',
    impactArea: ['Revenue', 'Retention'],
    supportingEvidence: ['Survey', 'Business Request'],
    estimatedImpact: 'Target 20K new gold savings accounts in Q2, AUM +Rp 50B',
    riskIfNotImplemented: 'Users use competitor apps (Pluang, Tokomas) for gold investment',
    effortEstimation: '15 story points',
    targetQuarter: 'Q2',
    dependency: [],
    completenessScore: 82,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 11500,
      reach: { value: 40000, label: 'High', reasoning: '40K users in target demographic based on savings profile' },
      impact: { value: 2, label: 'High', reasoning: 'New revenue stream — gold investment fees + AUM growth' },
      confidence: { value: 0.75, label: 'Medium', reasoning: 'Based on market survey and competitor data' },
      effort: { value: 15, label: 'High', reasoning: 'Partner API integration + OJK investment product approval' },
      moscow: 'Should Have',
      reasoning: {
        reach: '40,000 target users in savings + investment demographic.',
        impact: 'New revenue stream, high retention driver.',
        confidence: '75% — needs partner API confirmation.',
        effort: 'High due to regulatory and partner integration.',
        summary: 'Strategic Q2 initiative. Strong market demand signal.',
        evidenceRefs: ['Investment Survey Q1 2026', 'Competitor Product Analysis'],
      },
      confidenceLevel: 75,
      promptVersion: 'v1.2.3',
      scoredAt: new Date('2026-04-15T11:00:00'),
    },
    createdBy: 'user-apo-001',
    createdAt: new Date('2026-04-01T10:00:00'),
    updatedAt: new Date('2026-04-15T11:00:00'),
    productId: 'prod-001',
  },
  {
    id: 'bl-q2-003',
    title: 'Split Bill Feature',
    description: 'Allow users to split bills with multiple contacts directly from the transaction history.',
    businessObjective: 'Increase P2P transaction volume and social engagement',
    targetUsers: 'myBCA Mobile users, age 18–35',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Increase P2P transfer volume 15%',
    riskIfNotImplemented: 'Users prefer competitor apps (GoPay, OVO) for social payments',
    effortEstimation: '',
    targetQuarter: 'Q2',
    dependency: [],
    completenessScore: 55,
    status: 'draft',
    isEmergency: false,
    createdBy: 'user-apo-001',
    createdAt: new Date('2026-05-10T09:00:00'),
    updatedAt: new Date('2026-05-10T09:00:00'),
    productId: 'prod-001',
  },
  // ── Q3 2026 — Planning (Jul–Sep) ──────────────────────────────────────────
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
  year: 2026,
  quarters: [
    {
      quarter: 'Q1',
      backlogIds: ['bl-q1-001', 'bl-q1-002', 'bl-q1-003'],
      status: 'completed',
      submissionReadiness: 100,
      readyCount: 3,
      totalCount: 3,
    },
    {
      quarter: 'Q2',
      backlogIds: ['bl-q2-001', 'bl-q2-002', 'bl-q2-003'],
      status: 'draft',
      submissionReadiness: 60,
      readyCount: 2,
      totalCount: 3,
    },
    {
      quarter: 'Q3',
      backlogIds: ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005'],
      status: 'shadow',
      submissionReadiness: 40,
      readyCount: 2,
      totalCount: 5,
    },
    {
      quarter: 'Q4',
      backlogIds: ['bl-006'],
      status: 'shadow',
      submissionReadiness: 0,
      readyCount: 0,
      totalCount: 1,
    },
  ],
  status: 'draft',
  lastModifiedAt: new Date('2026-05-26T09:00:00'),
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
