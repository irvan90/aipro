import { Injectable } from '@angular/core';
import { Activity } from '../models/activity.model';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AgentId, Backlog } from '../models/backlog.model';
import { Notification } from '../models/notification.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

export const MOCK_CURRENT_USER: User = {
  id: 'user-po-001',
  name: 'Budi Santoso',
  email: 'budi.santoso@bca.co.id',
  role: 'PO',
  avatar: 'BS',
  productIds: ['prod-001'],
};

export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  { id: 'user-apo-001', name: 'Sari Dewi', email: 'sari.dewi@bca.co.id', role: 'APO', avatar: 'SD', productIds: ['prod-001'] },
  { id: 'user-ba-001', name: 'Eka Rahayu', email: 'eka.rahayu@bca.co.id', role: 'BA', avatar: 'ER', productIds: ['prod-001'] },
  { id: 'user-dev-001', name: 'Citra Dewi', email: 'citra.dewi@bca.co.id', role: 'Dev', avatar: 'CD', productIds: ['prod-001'], trackIds: ['mobile'] },
  { id: 'user-qa-001', name: 'Fajar Maulana', email: 'fajar.maulana@bca.co.id', role: 'QA', avatar: 'FM', productIds: ['prod-001'] },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'myBCA Mobile',
    description: 'Primary mobile banking app for individual customers',
    category: 'Mobile Banking',
    objective: 'Increase digital engagement and retained customer balance',
    kpi: ['Monthly active users', 'Retained balance', 'Digital transaction frequency'],
    customerSegment: 'Individual BCA customers, age 18-45',
    existingFeatures: ['Transfer', 'QRIS Payment', 'Bill Payment', 'Savings'],
    currentChallenges: ['Competitive feature gap', 'Fragmented budgeting journeys'],
    techStack: ['Angular', 'Node.js', 'PostgreSQL'],
    dependencySystems: ['Core Banking', 'Identity Service', 'Analytics Platform'],
    complianceTags: ['OJK', 'PBI'],
    teamId: 'team-001',
    poId: 'user-po-001',
    apoIds: [],
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-002',
    name: 'BCA Mobile Bisnis',
    description: 'Mobile banking for business customers',
    category: 'Business Banking',
    objective: 'Simplify daily financial operations for business customers',
    kpi: ['Active business users', 'Transaction frequency'],
    customerSegment: 'SME business owners',
    existingFeatures: ['Business Transfer', 'Payroll', 'Account Statement'],
    currentChallenges: ['Complex bulk transaction flow'],
    techStack: ['Angular', 'Java', 'Oracle'],
    dependencySystems: ['Core Banking', 'Payroll Engine'],
    complianceTags: ['OJK'],
    teamId: 'team-002',
    poId: 'user-po-001',
    apoIds: [],
    createdAt: new Date('2026-01-01'),
  },
];

const scoredAt = new Date('2026-06-20T10:00:00');

export const MOCK_BACKLOGS: Backlog[] = [
  {
    id: 'pocket-bca',
    title: 'Pocket BCA',
    description: 'Membagi saldo ke beberapa kantong untuk budgeting harian dan tujuan menabung dalam satu aplikasi.',
    businessObjective: 'Meningkatkan engagement dan mempertahankan saldo nasabah di ekosistem myBCA.',
    targetUsers: '80.000 pengguna aktif yang rutin mengatur anggaran dan tujuan tabungan.',
    impactArea: ['Retention', 'CX', 'Revenue'],
    supportingEvidence: ['Analytics', 'Survey'],
    estimatedImpact: '6.400-12.000 adopter potensial dan Rp9,6-30 miliar retained balance.',
    riskIfNotImplemented: 'Nasabah memindahkan aktivitas budgeting dan saldo tujuan ke aplikasi kompetitor.',
    effortEstimation: '8 story points',
    targetQuarter: 'Q4',
    dependency: [],
    completenessScore: 86,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 15000,
      reach: { value: 80000, label: 'High', reasoning: '80.000 pengguna aktif memenuhi profil pengguna eligible.' },
      impact: { value: 2, label: 'High', reasoning: 'Mendorong engagement, retention, dan saldo yang dipertahankan.' },
      confidence: { value: 0.75, label: 'High', reasoning: 'Confidence 75% dari sinyal pasar dan asumsi internal demo.' },
      effort: { value: 8, label: 'Medium', reasoning: 'Memakai rekening dan transfer internal yang sudah tersedia.' },
      moscow: 'Must Have',
      reasoning: {
        reach: '80.000 pengguna eligible dari basis pengguna aktif demo.',
        impact: 'Feature gap sudah menjadi ekspektasi pasar dan memengaruhi engagement serta retained balance.',
        confidence: '75% karena bukti kompetitor kuat, tetapi angka adopsi masih berupa asumsi demo.',
        effort: '8 story points; kompleksitas moderat karena fondasi rekening dan transfer sudah tersedia.',
        summary: 'Prioritas PO Low tidak sejalan dengan opportunity at risk. Rekomendasi: promosikan ke Next.',
        evidenceRefs: ['Jenius feature reference - verifikasi sebelum demo', 'blu feature reference - verifikasi sebelum demo', 'Demo eligible-user assumption'],
      },
      confidenceLevel: 75,
      promptVersion: 'demo-v3.0',
      scoredAt,
      agentFindings: [
        {
          agentId: 'market-gap',
          agentName: 'Market Gap',
          role: 'Membaca ekspektasi pasar',
          icon: '◎',
          summary: 'Jenius dan blu telah membiasakan pengguna membagi uang ke kantong atau tujuan terpisah.',
          contributesTo: ['Impact', 'Confidence'],
          evidence: ['Public competitor references - verify before presentation'],
        },
        {
          agentId: 'business-impact',
          agentName: 'Customer & Business Impact',
          role: 'Mengestimasi opportunity at risk',
          icon: '↗',
          summary: 'Dengan asumsi konservatif, 6.400-12.000 pengguna dapat mempertahankan Rp9,6-30 miliar saldo.',
          contributesTo: ['Reach', 'Impact'],
          evidence: ['Demo adoption and balance assumptions'],
        },
        {
          agentId: 'feasibility-risk',
          agentName: 'Feasibility & Risk',
          role: 'Menilai effort dan trade-off',
          icon: '◇',
          summary: 'Effort moderat dan tidak memiliki blocker kritis; risiko terbesar adalah terlambat mengejar ekspektasi pasar.',
          contributesTo: ['Effort', 'MoSCoW'],
          evidence: ['Existing transfer and account capabilities'],
        },
      ],
    },
    initialPriority: 'Low',
    recommendation: 'promote',
    priorityChangeReason: 'Feature gap pasar berisiko mengurangi engagement dan retained balance.',
    roadmapLane: 'Later',
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 9_600_000_000,
      max: 30_000_000_000,
      currency: 'IDR',
      label: 'Rp9,6-30 miliar retained balance',
      formula: '80.000 pengguna × adopsi 8-15% × saldo rata-rata Rp1,5-2,5 juta',
      assumptions: [
        '80.000 pengguna aktif eligible',
        'Adopsi konservatif 8-15%',
        'Saldo rata-rata per pocket Rp1,5-2,5 juta',
      ],
      isDemoEstimate: true,
    },
    evidenceSignals: [
      {
        type: 'competitive',
        label: 'Market expectation',
        detail: 'Kapabilitas kantong/tujuan tabungan telah diperkenalkan oleh Jenius dan blu.',
        source: 'Brief pengguna; tautan resmi wajib diverifikasi sebelum presentasi',
        observedAt: 'Juni 2026',
      },
      {
        type: 'customer',
        label: 'Customer behavior',
        detail: 'Pengguna membutuhkan pemisahan saldo tanpa berpindah aplikasi.',
        source: 'Asumsi skenario demo',
        observedAt: 'Juni 2026',
      },
      {
        type: 'delivery',
        label: 'Moderate effort',
        detail: 'Memanfaatkan fondasi rekening dan transfer internal yang telah tersedia.',
        source: 'Asumsi arsitektur demo',
        observedAt: 'Juni 2026',
      },
    ],
    isHistoricalScenario: true,
    source: 'myservice',
    myService: {
      myServiceId: 'MS-2026-0442',
      businessProposalType: 'New Feature',
      featureInitiator: 'Divisi Digital Banking',
      category: 'Savings & Budgeting',
      epic: 'Money Management Experience',
      timeToMarketMonths: 3,
      existingCondition: 'Saldo tabungan belum dapat dipisahkan berdasarkan tujuan atau kategori anggaran.',
      customerValue: 'Nasabah dapat mengatur budgeting dan tujuan menabung tanpa berpindah aplikasi.',
      functionalRequirement: 'Membuat, memberi nama, memindahkan saldo, dan memantau beberapa pocket.',
      concern: 'Perlu definisi perlakuan saldo dan mutasi antar-pocket.',
      userType: 'Nasabah individu aktif',
      valuegraphValue: 'High',
      valuegraphEffort: 'Medium',
      involvementDWH: false,
      involvementRPA: false,
      personalDataAccess: false,
      createdBy: 'Divisi Digital Banking',
      createdOn: new Date('2026-05-12T09:00:00'),
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2026-05-12T09:00:00'),
    updatedAt: scoredAt,
    productId: 'prod-001',
  },
  {
    id: 'qris-retry',
    title: 'Improve QRIS Retry Flow',
    description: 'Retry otomatis dan recovery flow untuk transaksi QRIS yang gagal.',
    businessObjective: 'Meningkatkan transaction success rate.',
    targetUsers: 'Pengguna QRIS aktif.',
    impactArea: ['Revenue', 'CX'],
    supportingEvidence: ['Analytics', 'Complaint Data'],
    estimatedImpact: 'Mengurangi transaksi gagal sebesar 30%.',
    riskIfNotImplemented: 'Lost transaction dan peningkatan komplain.',
    effortEstimation: '10 story points',
    targetQuarter: 'Q2',
    dependency: [],
    completenessScore: 95,
    status: 'delivered',
    isEmergency: false,
    aiResult: {
      riceScore: 14200,
      reach: { value: 65000, label: 'High', reasoning: 'Volume pengguna QRIS tinggi.' },
      impact: { value: 3, label: 'Massive', reasoning: 'Berdampak langsung pada transaksi berhasil.' },
      confidence: { value: 0.85, label: 'High', reasoning: 'Didukung analytics dan complaint data.' },
      effort: { value: 10, label: 'Medium', reasoning: 'Perubahan pada recovery flow.' },
      moscow: 'Must Have',
      reasoning: { reach: 'High', impact: 'Direct revenue impact', confidence: '85%', effort: 'Moderate', summary: 'Prioritas PO sudah tepat.', evidenceRefs: ['QRIS analytics'] },
      confidenceLevel: 85,
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'High',
    recommendation: 'keep',
    priorityChangeReason: 'Prioritas PO selaras dengan dampak transaksi dan data komplain.',
    roadmapLane: 'Now',
    source: 'internal',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-10'),
    updatedAt: scoredAt,
    productId: 'prod-001',
  },
  {
    id: 'login-biometric',
    title: 'Login Biometrik',
    description: 'Login menggunakan face recognition dan biometric device.',
    businessObjective: 'Mengurangi login friction.',
    targetUsers: 'Pengguna aktif myBCA.',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Mengurangi waktu login 60%.',
    riskIfNotImplemented: 'Pengalaman login tertinggal dari kompetitor.',
    effortEstimation: '13 story points',
    targetQuarter: 'Q3',
    dependency: ['identity-v2'],
    completenessScore: 88,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 10800,
      reach: { value: 70000, label: 'High', reasoning: 'Mayoritas pengguna aktif.' },
      impact: { value: 2, label: 'High', reasoning: 'Mengurangi login friction.' },
      confidence: { value: 0.8, label: 'High', reasoning: 'Didukung survey.' },
      effort: { value: 13, label: 'High', reasoning: 'Memerlukan Identity Service v2.' },
      moscow: 'Should Have',
      reasoning: { reach: 'High', impact: 'Strong CX', confidence: '80%', effort: 'High', summary: 'Tahan sampai dependency siap.', evidenceRefs: ['User survey'] },
      confidenceLevel: 80,
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Medium',
    recommendation: 'defer',
    priorityChangeReason: 'Nilai tinggi, tetapi Identity Service v2 belum siap.',
    roadmapLane: 'Next',
    source: 'internal',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-15'),
    updatedAt: scoredAt,
    productId: 'prod-001',
  },
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    description: 'Dukungan dark mode di seluruh layar myBCA.',
    businessObjective: 'Meningkatkan kenyamanan visual.',
    targetUsers: 'Seluruh pengguna myBCA.',
    impactArea: ['CX'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Peningkatan kepuasan pengguna.',
    riskIfNotImplemented: 'Dampak bisnis langsung rendah.',
    effortEstimation: '13 story points',
    targetQuarter: 'Q4',
    dependency: [],
    completenessScore: 80,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      riceScore: 3900,
      reach: { value: 80000, label: 'High', reasoning: 'Semua pengguna dapat mengakses.' },
      impact: { value: 1, label: 'Medium', reasoning: 'Dampak bisnis tidak langsung.' },
      confidence: { value: 0.7, label: 'Medium', reasoning: 'Berbasis preferensi survey.' },
      effort: { value: 13, label: 'High', reasoning: 'Perlu perubahan lintas layar.' },
      moscow: 'Could Have',
      reasoning: { reach: 'High', impact: 'Quality of life', confidence: '70%', effort: 'High', summary: 'Defer setelah backlog berdampak langsung.', evidenceRefs: ['Preference survey'] },
      confidenceLevel: 70,
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'High',
    recommendation: 'defer',
    priorityChangeReason: 'Effort lintas layar tinggi dengan dampak bisnis langsung yang rendah.',
    roadmapLane: 'Later',
    source: 'internal',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-20'),
    updatedAt: scoredAt,
    productId: 'prod-001',
  },
];

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  icon: string;
  steps: string[];
}

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  { id: 'market-gap', name: 'Market Gap', role: 'Membaca ekspektasi pasar', icon: '◎', steps: ['Membandingkan kapabilitas kompetitor', 'Mengukur usia feature gap'] },
  { id: 'business-impact', name: 'Customer & Business Impact', role: 'Mengestimasi opportunity at risk', icon: '↗', steps: ['Menghitung pengguna eligible', 'Membentuk rentang retained balance'] },
  { id: 'feasibility-risk', name: 'Feasibility & Risk', role: 'Menilai effort dan trade-off', icon: '◇', steps: ['Memeriksa fondasi teknis', 'Menyusun rekomendasi final'] },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-pocket-001', type: 'ai_scored', actor: 'AIPRO AI', actorRole: 'PO',
    description: 'Priority mismatch detected: Pocket BCA',
    subDescription: 'PO Low → AI Must Have · RICE 15.000 · confidence 75%',
    backlogId: 'pocket-bca', backlogTitle: 'Pocket BCA', timestamp: new Date('2026-06-20T10:00:00'), productId: 'prod-001',
  },
  {
    id: 'act-pocket-002', type: 'human_override', actor: 'Budi Santoso', actorRole: 'PO',
    description: 'Reviewed AIPRO recommendation for Pocket BCA',
    subDescription: 'Human decision required before roadmap change',
    backlogId: 'pocket-bca', backlogTitle: 'Pocket BCA', timestamp: new Date('2026-06-20T10:05:00'), productId: 'prod-001',
  },
  {
    id: 'act-login-001', type: 'dependency_conflict', actor: 'AIPRO AI', actorRole: 'PO',
    description: 'Login Biometrik deferred',
    subDescription: 'Blocked by Identity Service v2',
    backlogId: 'login-biometric', backlogTitle: 'Login Biometrik', timestamp: new Date('2026-06-19T15:00:00'), productId: 'prod-001',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-pocket', type: 'ai_scored', title: 'Priority mismatch detected',
    body: 'Pocket BCA dinilai Must Have meskipun prioritas awal PO masih Low.',
    isRead: false, actionUrl: '/backlog/pocket-bca', timestamp: new Date('2026-06-20T10:00:00'),
  },
  {
    id: 'notif-login', type: 'dependency_conflict', title: 'Dependency needs attention',
    body: 'Login Biometrik masih bergantung pada Identity Service v2.',
    isRead: false, actionUrl: '/backlog/login-biometric', timestamp: new Date('2026-06-19T15:00:00'),
  },
];

export const MOCK_IMPACT_RESULTS: Record<string, ImpactAnalysisResult> = {
  'pocket-bca': {
    backlogId: 'pocket-bca',
    targetLane: 'Q3',
    roadmapImpacts: [
      { affectedBacklogId: 'dark-mode', affectedBacklogTitle: 'Dark Mode', description: 'Bergeser ke Later karena dampak bisnis langsung lebih rendah.', severity: 'low' },
    ],
    dependencyImpacts: [],
    kpiImpacts: [
      { kpi: 'Retained balance', description: 'Membuka opportunity Rp9,6-30 miliar berdasarkan skenario demo.', severity: 'high' },
      { kpi: 'Engagement', description: 'Menambah alasan pengguna mengelola uang tanpa berpindah aplikasi.', severity: 'medium' },
    ],
    estimatedDelayInSprints: 0,
    aiRecommendation: 'Promosikan Pocket BCA dari Q4 ke Q3. Trade-off utamanya adalah menunda Dark Mode, tetapi tidak ada blocker kritis.',
    recommendedAction: 'promote',
  },
  'qris-retry': {
    backlogId: 'qris-retry', targetLane: 'Q2', roadmapImpacts: [], dependencyImpacts: [],
    kpiImpacts: [{ kpi: 'Transaction success rate', description: 'Tetap menjadi komitmen aktif.', severity: 'high' }],
    estimatedDelayInSprints: 0, aiRecommendation: 'Pertahankan di Now.', recommendedAction: 'keep',
  },
  'login-biometric': {
    backlogId: 'login-biometric', targetLane: 'Q4', roadmapImpacts: [],
    dependencyImpacts: [{ dependencyId: 'identity-v2', dependencyTitle: 'Identity Service v2', description: 'Belum siap untuk delivery.', isBlocker: true }],
    kpiImpacts: [], estimatedDelayInSprints: 2, aiRecommendation: 'Tunda hingga Identity Service v2 siap.', recommendedAction: 'defer',
  },
  'dark-mode': {
    backlogId: 'dark-mode', targetLane: 'Q4', roadmapImpacts: [], dependencyImpacts: [], kpiImpacts: [],
    estimatedDelayInSprints: 0, aiRecommendation: 'Letakkan di Later setelah backlog berdampak langsung.', recommendedAction: 'defer',
  },
};

export const MOCK_IMPACT_RESULT = MOCK_IMPACT_RESULTS['pocket-bca'];

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getBacklogs(): Backlog[] { return [...MOCK_BACKLOGS]; }
  getUsers(): User[] { return [...MOCK_USERS]; }
  getProducts(): Product[] { return [...MOCK_PRODUCTS]; }
  getActivities(): Activity[] { return [...MOCK_ACTIVITIES]; }
  getNotifications(): Notification[] { return [...MOCK_NOTIFICATIONS]; }
  getCurrentUser(): User { return { ...MOCK_CURRENT_USER }; }
  getImpactResult(): ImpactAnalysisResult { return { ...MOCK_IMPACT_RESULT }; }
}
