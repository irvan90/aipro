import { Injectable } from '@angular/core';
import { Activity } from '../models/activity.model';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AgentId, AgentFinding, AIResult, Backlog, Quarter, RoadmapLane } from '../models/backlog.model';
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
    id: 'identity-v2',
    title: 'Identity Service v2',
    description: 'Core backend service untuk Identity Management terpusat, menggantikan sistem identity yang terfragmentasi antar produk BCA.',
    businessObjective: 'Menyediakan layer identitas terpusat yang menjadi fondasi semua fitur keamanan seperti biometric login, SSO, dan verifikasi KYC digital.',
    targetUsers: 'Semua sistem internal dan aplikasi BCA (myBCA Mobile, BCA Mobile Bisnis, KlikBCA).',
    impactArea: ['Risk', 'Compliance'],
    supportingEvidence: ['Business Request'],
    estimatedImpact: 'Fondasi wajib untuk 3 backlog downstream: Login Biometrik, KYC Digital, dan SSO Multi-produk.',
    riskIfNotImplemented: 'Login Biometrik tidak dapat diluncurkan. Debt teknis identity terus meningkat.',
    effortEstimation: '20 story points',
    targetQuarter: 'Q4',
    dependency: [],
    completenessScore: 80,
    status: 'not_ready',
    isEmergency: false,
    createdBy: 'user-po-001',
    createdAt: new Date('2026-06-15T10:00:00'),
    updatedAt: new Date('2026-06-15T10:00:00'),
    productId: 'prod-001',
  },
  {
    id: 'qris-retry',
    title: 'Improve QRIS Retry Flow',
    description: 'Retry otomatis dan recovery flow untuk transaksi QRIS yang gagal, mencakup fallback ke metode pembayaran alternatif dan notifikasi status real-time.',
    businessObjective: 'Meningkatkan transaction success rate QRIS dan mengurangi komplain nasabah terkait transaksi gagal.',
    targetUsers: 'Pengguna aktif QRIS myBCA — estimasi 2,1 juta transaksi QRIS/bulan.',
    impactArea: ['Revenue', 'CX'],
    supportingEvidence: ['Analytics', 'Complaint Data'],
    estimatedImpact: 'Mengurangi transaksi QRIS gagal sebesar 30% (±63.000 transaksi/bulan berhasil diselamatkan).',
    riskIfNotImplemented: 'Lost transaction senilai Rp4-8 miliar/bulan dan peningkatan tiket komplain call center.',
    effortEstimation: '10 story points',
    targetQuarter: 'Q2',
    dependency: [],
    completenessScore: 95,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Must Have',
      reasoning: { summary: 'Transaction success rate adalah KPI utama QRIS. Setiap transaksi gagal berdampak langsung pada revenue dan kepuasan pengguna.', evidenceRefs: ['QRIS failure rate analytics Juni 2026', 'Call center complaint data Q2 2026'] },
      confidenceLevel: 85,
      riceScore: { reach: 5, impact: 2, confidence: 85, effort: 10, total: 0.85, reachLabel: 'High Reach' },
      valueEffort: { value: 'High', effort: 'Medium' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'High',
    recommendation: 'keep',
    priorityChangeReason: 'Prioritas PO selaras dengan data analytics dan volume komplain transaksi gagal.',
    roadmapLane: 'Now',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-10'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 4_000_000_000,
      max: 8_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp4-8 miliar lost transaction per bulan',
      formula: '2,1 juta transaksi/bulan × gagal 3% × rata-rata Rp65.000/transaksi',
      assumptions: [
        '2,1 juta transaksi QRIS aktif per bulan (data internal)',
        'Failure rate 3% berdasarkan QRIS analytics Juni 2026',
        'Rata-rata nilai transaksi QRIS Rp65.000',
      ],
    },
    evidenceSignals: [
      { type: 'business', label: 'QRIS failure rate 3%', detail: 'Analytics internal mencatat 63.000 transaksi QRIS gagal per bulan dari total 2,1 juta transaksi. Mayoritas kegagalan terjadi karena timeout koneksi dan tidak ada mekanisme retry otomatis.', source: 'QRIS Analytics Dashboard — Juni 2026', observedAt: 'Juni 2026' },
      { type: 'customer', label: 'Volume komplain transaksi gagal tinggi', detail: 'Tiket call center terkait QRIS gagal mencapai 4.200/bulan (urutan #2 terbanyak). Pengguna melaporkan kebingungan karena tidak ada notifikasi status yang jelas setelah kegagalan.', source: 'Call Center Complaint Report Q2 2026', observedAt: 'April–Juni 2026' },
      { type: 'competitive', label: 'GoPay & OVO sudah memiliki retry otomatis', detail: 'GoPay dan OVO telah mengimplementasi auto-retry dan fallback payment sejak 2022. Pengguna yang terbiasa dengan flow ini merasa pengalaman QRIS myBCA kalah smooth.', source: 'Competitor UX Benchmarking Q1 2026', observedAt: 'Maret 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'login-biometric',
    title: 'Login Biometrik',
    description: 'Login menggunakan face recognition dan fingerprint native device, menggantikan PIN 6 digit sebagai metode autentikasi utama.',
    businessObjective: 'Mengurangi login friction dan meningkatkan security posture dengan autentikasi biometrik yang tidak bisa di-phish.',
    targetUsers: 'Seluruh pengguna aktif myBCA — estimasi 8 juta pengguna eligible (perangkat support biometric).',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Mengurangi waktu login 60%, mengurangi lupa-PIN call center 35%, meningkatkan retensi pengguna aktif harian.',
    riskIfNotImplemented: 'Pengalaman autentikasi tertinggal dari GoPay, OVO, dan Jenius yang sudah full biometric.',
    effortEstimation: '13 story points',
    targetQuarter: 'Q3',
    dependency: ['identity-v2'],
    completenessScore: 88,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Should Have',
      reasoning: { summary: 'Nilai tinggi dan demand pengguna besar, tetapi blocker teknis (Identity Service v2 belum siap) mencegah eksekusi di kuartal ini.', evidenceRefs: ['User survey Q1 2026 — 74% responden inginkan biometric', 'Identity Service v2 dependency'] },
      confidenceLevel: 80,
      riceScore: { reach: 10, impact: 2, confidence: 80, effort: 13, total: 1.23, reachLabel: 'Massive Reach' },
      valueEffort: { value: 'High', effort: 'High' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Medium',
    recommendation: 'defer',
    priorityChangeReason: 'Nilai strategis tinggi, tetapi tertahan oleh dependency Identity Service v2 yang belum selesai di Q3.',
    roadmapLane: 'Next',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-15'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 2_000_000_000,
      max: 5_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp2-5 miliar potensi churn akibat friction login',
      formula: '8 juta pengguna × churn login friction 0,5-1% × saldo rata-rata Rp500 ribu',
      assumptions: [
        '8 juta pengguna eligible device biometric',
        'Estimasi churn akibat login friction 0,5-1% per tahun',
        'Rata-rata saldo tabungan Rp500 ribu per user aktif',
      ],
    },
    evidenceSignals: [
      { type: 'customer', label: '74% pengguna menginginkan biometric login', detail: 'Survey Q1 2026 kepada 3.200 pengguna aktif myBCA: 74% menyatakan biometric login adalah fitur yang paling diharapkan. 38% mengaku pernah mengalami kendala login karena lupa PIN.', source: 'User Survey Q1 2026 — 3.200 responden', observedAt: 'Januari–Maret 2026' },
      { type: 'competitive', label: 'Kompetitor sudah full biometric sejak 2021', detail: 'GoPay, OVO, Jenius, dan blu sudah mengimplementasi login biometrik penuh sejak 2021-2022. Beberapa sudah menghapus PIN sama sekali. BCA masih mewajibkan PIN sebagai primary auth.', source: 'Competitor Feature Benchmarking 2026', observedAt: 'Februari 2026' },
      { type: 'delivery', label: 'Blocker: Identity Service v2 belum siap', detail: 'Biometric login membutuhkan token management dan session handling dari Identity Service v2. Tanpa dependency ini, implementasi tidak dapat dilakukan secara aman dan terstandardisasi.', source: 'Engineering Assessment — April 2026', observedAt: 'April 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    description: 'Dukungan dark mode di seluruh layar myBCA mengikuti preferensi sistem perangkat, dengan toggle manual di pengaturan aplikasi.',
    businessObjective: 'Meningkatkan kenyamanan visual terutama untuk pengguna yang aktif di malam hari dan mengurangi konsumsi baterai pada perangkat OLED.',
    targetUsers: 'Seluruh pengguna aktif myBCA — terutama 40% pengguna yang aktif di atas jam 21.00.',
    impactArea: ['CX'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Peningkatan kepuasan visual pengguna malam hari. Tidak berdampak langsung pada revenue atau retensi.',
    riskIfNotImplemented: 'Dampak bisnis langsung sangat rendah. Pengguna tidak akan churn hanya karena tidak ada dark mode.',
    effortEstimation: '13 story points',
    targetQuarter: 'Q4',
    dependency: [],
    completenessScore: 80,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Could Have',
      reasoning: { summary: 'Dark mode adalah nice-to-have yang meningkatkan kenyamanan visual, namun tidak mempengaruhi retensi, revenue, atau keamanan. Effort-nya besar karena perlu refactoring tema di 40+ layar.', evidenceRefs: ['User preference survey Q1 2026', 'Engineering scope assessment'] },
      confidenceLevel: 70,
      riceScore: { reach: 10, impact: 0.5, confidence: 70, effort: 13, total: 0.27, reachLabel: 'Massive Reach' },
      valueEffort: { value: 'Low', effort: 'High' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Low',
    recommendation: 'defer',
    priorityChangeReason: 'Effort refactoring 40+ layar terlalu besar dibanding dampak bisnis langsung yang sangat rendah.',
    roadmapLane: 'Later',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-20'),
    updatedAt: scoredAt,
    evidenceSignals: [
      { type: 'customer', label: '62% pengguna menginginkan dark mode', detail: 'Survey internal menunjukkan 62% pengguna menginginkan dark mode, namun ketika ditanya apakah ini alasan untuk berpindah aplikasi, hanya 4% yang menjawab ya. Ini mengindikasikan preferensi visual, bukan kebutuhan fungsional kritis.', source: 'User Survey Q1 2026', observedAt: 'Maret 2026' },
      { type: 'delivery', label: 'Effort implementasi besar — 40+ layar perlu di-refactor', detail: 'Engineering assessment menunjukkan dark mode memerlukan refactoring sistem tema di 40+ layar, termasuk komponen shared, ikon, dan aset gambar. Total estimasi 13 story points menjadikan ini kandidat Money Pit (low value, high effort) dalam kuadran Value-Effort.', source: 'Engineering Scope Assessment — April 2026', observedAt: 'April 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'pocket-rupiah',
    title: 'Pocket Rupiah',
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
    status: 'new',
    isEmergency: false,
    initialPriority: 'Low',
    recommendation: 'promote',
    priorityChangeReason: 'Fitur budgeting dan alokasi saldo ke beberapa kantong — diajukan dengan prioritas awal PO: Low.',
    roadmapLane: 'Later',
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 9_600_000_000,
      max: 30_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp9,6-30 miliar retained balance',
      formula: '80.000 pengguna × adopsi 8-15% × saldo rata-rata Rp1,5-2,5 juta',
      assumptions: [
        '80.000 pengguna aktif eligible',
        'Adopsi konservatif 8-15%',
        'Saldo rata-rata per pocket Rp1,5-2,5 juta',
      ],
    },
    evidenceSignals: [
      {
        type: 'competitive',
        label: '⚠️ Feature gap kritis - sudah ada sejak lama',
        detail: 'Jenius meluncurkan Kantong pada 2017 (9 tahun lalu), blu meluncurkan Tabungan Tujuan pada 2020 (6 tahun lalu). BCA sangat tertinggal dalam kapabilitas money management.',
        source: 'Jenius official release 2017, blu official release 2020',
        observedAt: '2017-2020',
      },
      {
        type: 'customer',
        label: 'Customer behavior',
        detail: 'Pengguna membutuhkan pemisahan saldo tanpa berpindah aplikasi. Ekspektasi ini sudah terbentuk sejak 2017.',
        source: 'Market research dan competitor analysis',
        observedAt: '2017-sekarang',
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
      myServiceId: 'BPRO110026050',
      projectName: 'Pocket Rupiah',
      description: 'Membagi saldo ke beberapa kantong untuk budgeting harian dan tujuan menabung dalam satu aplikasi.',
      product: 'myBCA Mobile',
      businessProposalType: 'Feature',
      featureInitiator: 'Divisi Digital Banking',
      status: 'Approved',
      category: 'Project',
      projectNumber: 'PRO25103234',
      epic: 'Money Management Experience',
      timeToMarket: 'November-2026',
      timeToMarketMonths: 3,
      existingCondition: 'Saldo tabungan belum dapat dipisahkan berdasarkan tujuan atau kategori anggaran.',
      customerValue: 'Nasabah dapat mengatur budgeting dan tujuan menabung tanpa berpindah aplikasi.',
      functionalRequirement: 'Membuat, memberi nama, memindahkan saldo, dan memantau beberapa pocket.',
      concern: 'Perlu definisi perlakuan saldo dan mutasi antar-pocket.',
      newActivityOrFeature: true,
      testingMethodKLA: 'UAT, Integration Test, & Security Vulnerability Assessment by KLA',
      pmoSubmission: 'planned',
      picIT: 'Hendra Wijaya (S5) & Team',
      ebiCode: 'R.200004',
      userType: 'external',
      valuegraphValue: 'High',
      valuegraphEffort: 'Medium',
      involvementDWH: false,
      involvementRPA: false,
      networkIntranet: false,
      networkInternet: true,
      networkVsat: false,
      networkVpnInternet: false,
      networkVpnIpSec: false,
      networkMpls: false,
      personalDataAccess: false,
      ropaDpiaLink: '',
      blueprintUrl: 'https://blueprint.internal.bca.co.id/docs/pocket-rupiah',
      picBA: 'Eka Rahayu (S6)',
      picBAManager: 'Sari Dewi (S3)',
      picGSIT: 'Citra Dewi (S4)',
      createdBy: 'u066684',
      createdOn: new Date('2026-05-12T09:00:00'),
    },
    createdBy: 'user-po-001',
    createdAt: new Date('2026-05-12T09:00:00'),
    updatedAt: scoredAt,
    productId: 'prod-001',
  },
  {
    id: 'recurring-transfer',
    title: 'Recurring Transfer',
    description: 'Jadwal transfer rutin otomatis untuk pembayaran tagihan, tabungan tujuan, atau kirim uang berkala — dengan konfigurasi frekuensi (harian, mingguan, bulanan).',
    businessObjective: 'Meningkatkan retensi nasabah dan frekuensi transaksi digital melalui otomasi keuangan rutin.',
    targetUsers: 'Pengguna aktif myBCA yang melakukan transfer berulang setiap bulan — estimasi 1,8 juta pengguna.',
    impactArea: ['Retention', 'Revenue'],
    supportingEvidence: ['Analytics', 'Survey'],
    estimatedImpact: 'Meningkatkan frekuensi transaksi 15% dan mengurangi drop-off transfer rutin ke platform lain.',
    riskIfNotImplemented: 'Nasabah beralih ke fitur autopay kompetitor (GoPay, OVO, SeaBank) atau menggunakan standing instruction via Halo BCA.',
    effortEstimation: '7 story points',
    targetQuarter: 'Q2',
    dependency: [],
    completenessScore: 92,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Must Have',
      reasoning: { summary: 'Fitur ekspektasi pasar yang langsung memengaruhi retensi transaksi. Kompetitor fintech sudah punya fitur ini, dan pengguna yang transfer rutin adalah segmen bernilai tinggi.', evidenceRefs: ['Competitor autopay analysis 2025', 'Internal transfer frequency analytics Q1 2026'] },
      confidenceLevel: 82,
      riceScore: { reach: 5, impact: 2, confidence: 82, effort: 7, total: 1.17, reachLabel: 'High Reach' },
      valueEffort: { value: 'High', effort: 'Low' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'High',
    recommendation: 'keep',
    priorityChangeReason: 'Prioritas PO sudah selaras dengan dampak retensi dan frekuensi transaksi.',
    roadmapLane: 'Now',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-03-15'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 15_000_000_000,
      max: 40_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp15-40 miliar potensi dana rutin yang keluar ke platform lain',
      formula: '1,8 juta pengguna rutin × migrasi 2-5% × rata-rata transfer rutin Rp1-2 juta/bulan',
      assumptions: [
        '1,8 juta pengguna dengan pola transfer berulang (analytics internal)',
        'Estimasi 2-5% beralih ke platform lain jika fitur tidak tersedia',
        'Rata-rata nilai transfer rutin Rp1-2 juta per transaksi',
      ],
    },
    evidenceSignals: [
      { type: 'business', label: '1,8 juta pengguna pola transfer rutin teridentifikasi', detail: 'Analytics internal Q1 2026 mengidentifikasi 1,8 juta pengguna yang melakukan transfer dengan pola berulang (frekuensi ≥ 2x ke penerima yang sama dalam 30 hari). Segmen ini memiliki saldo rata-rata 2,3x lebih tinggi dari rata-rata pengguna.', source: 'Product Analytics Dashboard Q1 2026', observedAt: 'Januari–Maret 2026' },
      { type: 'competitive', label: 'GoPay, OVO, SeaBank sudah punya autopay', detail: 'Tiga platform fintech utama (GoPay Tabungan, OVO PayLater, SeaBank) sudah memiliki fitur jadwal transfer otomatis sejak 2023. Beberapa pengguna melaporkan menggunakan GoPay untuk tagihan rutin meski rekening utama di BCA.', source: 'Competitor Feature Analysis & User Interview', observedAt: 'Februari 2026' },
      { type: 'customer', label: 'Standing instruction via Halo BCA masih tinggi', detail: 'Volume permintaan standing instruction via Halo BCA mencapai 28.000/bulan — mengindikasikan demand yang besar namun dipenuhi melalui channel offline yang mahal dan tidak efisien.', source: 'Halo BCA Call Center Report Q4 2025', observedAt: 'Oktober–Desember 2025' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'spending-analytics-v2',
    title: 'Spending Analytics v2',
    description: 'Laporan pengeluaran lebih detail dengan kategorisasi otomatis berbasis AI, tren pengeluaran bulanan, dan insight personalisasi untuk membantu pengguna memahami pola keuangan mereka.',
    businessObjective: 'Meningkatkan engagement pengguna dan menjadikan myBCA sebagai hub keuangan personal, bukan sekadar aplikasi transfer.',
    targetUsers: 'Seluruh pengguna aktif myBCA — 8 juta MAU yang melakukan minimal 3 transaksi/bulan.',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Analytics', 'Survey'],
    estimatedImpact: 'Peningkatan session duration 25% dan frekuensi buka aplikasi 20% berdasarkan benchmark fitur serupa di bank digital.',
    riskIfNotImplemented: 'Pengguna bergantung pada aplikasi pihak ketiga (Money Manager, Mint) untuk insight keuangan, mengurangi stickiness myBCA.',
    effortEstimation: '11 story points',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 89,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Must Have',
      reasoning: { summary: 'Fitur analytics adalah komplemen strategis untuk ekosistem money management. Tanpa insight pengeluaran, fitur Pocket Rupiah tidak akan optimal karena pengguna tidak tahu ke mana uang mereka pergi.', evidenceRefs: ['Session analytics Q1 2026', 'Spending feature benchmark — Jenius, Flip, Pluang'] },
      confidenceLevel: 78,
      riceScore: { reach: 10, impact: 2, confidence: 78, effort: 11, total: 1.42, reachLabel: 'Massive Reach' },
      valueEffort: { value: 'High', effort: 'Medium' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'High',
    recommendation: 'keep',
    priorityChangeReason: 'Komplemen strategis untuk pengalaman money management — sinergis dengan Pocket Rupiah di Q3.',
    roadmapLane: 'Next',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-01'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 5_000_000_000,
      max: 12_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp5-12 miliar potensi kehilangan engagement & saldo aktif',
      formula: '8 juta MAU × 1-2% churn ke platform dengan insight lebih baik × saldo rata-rata Rp600 ribu',
      assumptions: [
        '8 juta Monthly Active Users berdasarkan data internal',
        '1-2% churn ke aplikasi fintech yang punya spending analytics lebih baik',
        'Rata-rata saldo aktif Rp600 ribu per pengguna',
      ],
    },
    evidenceSignals: [
      { type: 'customer', label: 'Session duration rendah — pengguna tidak explore fitur', detail: 'Rata-rata session duration myBCA hanya 2,1 menit, jauh di bawah Jenius (4,8 menit) dan blu (3,6 menit). Analisis funnel menunjukkan 78% pengguna hanya buka aplikasi untuk transfer, lalu langsung tutup — tidak ada alasan untuk explore.', source: 'Product Analytics Q1 2026 — Session Tracking', observedAt: 'Januari–Maret 2026' },
      { type: 'competitive', label: 'Jenius & Flip sudah punya spending analytics canggih', detail: 'Jenius telah memiliki spending analytics dengan auto-kategorisasi sejak 2019. Flip meluncurkan "Laporan Keuangan" pada 2023. Pengguna dual-app (myBCA + Jenius) cenderung menggunakan Jenius untuk manajemen keuangan dan myBCA hanya untuk transaksi.', source: 'Competitor UX Audit Q1 2026', observedAt: 'Februari 2026' },
      { type: 'business', label: 'Sinergi tinggi dengan Pocket Rupiah', detail: 'Spending Analytics v2 adalah komplemen wajib Pocket Rupiah — pengguna perlu tahu pola pengeluaran mereka sebelum memutuskan cara mengisi pocket. Implementasi bersamaan di Q3 akan memaksimalkan adoption kedua fitur.', source: 'Product Strategy Review Mei 2026', observedAt: 'Mei 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'split-bill',
    title: 'Split Bill',
    description: 'Membagi tagihan grup dan mengirimkan payment request ke teman dalam aplikasi myBCA, dengan rekap otomatis siapa yang sudah bayar.',
    businessObjective: 'Mendorong peer-to-peer engagement, meningkatkan penggunaan QRIS untuk transaksi antar-pengguna, dan mengurangi perpindahan ke e-wallet.',
    targetUsers: 'Pengguna myBCA usia 18-35 yang sering berbagi pengeluaran (makan bersama, liburan, kos bersama) — estimasi 2,5 juta pengguna.',
    impactArea: ['CX', 'Revenue'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Adopsi 12.000 pengguna dalam 6 bulan, meningkatkan frekuensi QRIS P2P 15%.',
    riskIfNotImplemented: 'Pengguna menggunakan GoPay atau OVO untuk split bill karena lebih mudah, membawa transaksi ke ekosistem kompetitor.',
    effortEstimation: '9 story points',
    targetQuarter: 'Q3',
    dependency: [],
    completenessScore: 84,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Should Have',
      reasoning: { summary: 'Fitur sosial yang mendukung engagement kelompok usia 18-35 dan mengurangi kebocoran ke e-wallet. Bukan gap kritis seperti Pocket Rupiah, namun memberikan nilai kompetitif yang jelas.', evidenceRefs: ['Market survey Gen-Z banking habits 2025', 'QRIS P2P transaction analytics Q1 2026'] },
      confidenceLevel: 72,
      riceScore: { reach: 5, impact: 1, confidence: 72, effort: 9, total: 0.4, reachLabel: 'High Reach' },
      valueEffort: { value: 'Medium', effort: 'Medium' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Medium',
    recommendation: 'keep',
    priorityChangeReason: 'Nilai engagement tinggi untuk segmen muda, namun Q3 padat dengan Pocket Rupiah dan Spending Analytics. Bisa digeser ke Q4 jika kapasitas terbatas.',
    roadmapLane: 'Next',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-08'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 3_000_000_000,
      max: 8_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp3-8 miliar transaksi P2P yang bocor ke GoPay & OVO',
      formula: '2,5 juta pengguna 18-35 × 15% aktif split bill × rata-rata transaksi Rp80-200 ribu × 12 kali/tahun',
      assumptions: [
        '2,5 juta pengguna usia 18-35 aktif di myBCA',
        '15% aktif melakukan split bill minimal sekali sebulan',
        'Rata-rata nilai split bill Rp80-200 ribu per orang',
      ],
    },
    evidenceSignals: [
      { type: 'customer', label: '68% pengguna muda menggunakan GoPay untuk split bill', detail: 'Survey kepada 1.500 pengguna myBCA usia 18-35: 68% menggunakan GoPay atau OVO saat perlu split bill karena myBCA tidak punya fitur ini. 45% menyatakan "terpaksa" pindah ke e-wallet hanya untuk kebutuhan ini.', source: 'Gen-Z Banking Survey Q4 2025 — 1.500 responden', observedAt: 'Oktober–Desember 2025' },
      { type: 'competitive', label: 'GoPay, OVO, DANA sudah punya split bill', detail: 'GoPay memperkenalkan "Tagih Teman" pada 2021, OVO memiliki "OVO PayLater Group" pada 2022, dan DANA memiliki fitur "Patungan" sejak 2023. Split bill sudah menjadi fitur standar e-wallet, namun belum ada di bank konvensional digital.', source: 'E-wallet Feature Tracker Q1 2026', observedAt: 'Januari 2026' },
      { type: 'business', label: 'Kebocoran transaksi QRIS ke ekosistem e-wallet', detail: 'Data internal menunjukkan pengguna yang menggunakan GoPay untuk split bill memiliki volume transaksi QRIS myBCA 23% lebih rendah dibanding pengguna yang tidak. Ini mengindikasikan substitusi langsung pada use case sosial.', source: 'QRIS Transaction Segmentation Analysis Q1 2026', observedAt: 'Maret 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'virtual-card-control',
    title: 'Virtual Card Control',
    description: 'Kontrol mandiri kartu virtual: aktifkan/nonaktifkan instan, atur batas transaksi per merchant/kategori, dan notifikasi realtime setiap transaksi.',
    businessObjective: 'Meningkatkan keamanan transaksi digital dan kepercayaan nasabah, sekaligus mengurangi volume klaim fraud ke call center.',
    targetUsers: 'Pengguna kartu virtual myBCA — estimasi 1,2 juta pengguna aktif kartu virtual.',
    impactArea: ['Risk', 'CX'],
    supportingEvidence: ['Complaint Data'],
    estimatedImpact: 'Mengurangi klaim fraud kartu virtual 25%, menghemat biaya penyelesaian klaim Rp3-6 miliar/tahun.',
    riskIfNotImplemented: 'Risiko fraud kartu virtual terus meningkat. Volume klaim call center membebani operasional.',
    effortEstimation: '8 story points',
    targetQuarter: 'Q4',
    dependency: [],
    completenessScore: 81,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Could Have',
      reasoning: { summary: 'Penting untuk keamanan dan mengurangi biaya operasional, namun dampaknya tidak langsung ke revenue atau retensi growth. Bisa dieksekusi setelah backlog money management selesai.', evidenceRefs: ['Virtual card fraud complaint trend Q1 2026', 'Call center cost analysis 2025'] },
      confidenceLevel: 68,
      riceScore: { reach: 5, impact: 1, confidence: 68, effort: 8, total: 0.43, reachLabel: 'High Reach' },
      valueEffort: { value: 'Medium', effort: 'Medium' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Medium',
    recommendation: 'defer',
    priorityChangeReason: 'Bernilai dari sisi risk reduction, namun tidak mendorong growth langsung. Defer ke Q4 setelah money management cluster selesai.',
    roadmapLane: 'Later',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-12'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 3_000_000_000,
      max: 6_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp3-6 miliar biaya klaim fraud per tahun yang bisa dihemat',
      formula: '1,2 juta pengguna × klaim fraud 0,5% × rata-rata kerugian per klaim Rp500 ribu + biaya operasional call center',
      assumptions: [
        '1,2 juta pengguna aktif kartu virtual myBCA',
        'Fraud rate kartu virtual 0,5% berdasarkan complaint data',
        'Rata-rata kerugian per klaim Rp500 ribu (termasuk kompensasi + biaya investigasi)',
      ],
    },
    evidenceSignals: [
      { type: 'business', label: 'Volume klaim fraud kartu virtual meningkat 40% YoY', detail: 'Data call center menunjukkan klaim fraud kartu virtual meningkat 40% dalam 12 bulan terakhir, dari 3.200 klaim (Q1 2025) menjadi 4.500 klaim (Q1 2026). Mayoritas kasus bisa dicegah jika pengguna dapat langsung memblokir kartu dari aplikasi.', source: 'Call Center Fraud Claim Report Q1 2026', observedAt: 'Januari–Maret 2026' },
      { type: 'competitive', label: 'Kontrol kartu instan sudah jadi standar industri', detail: 'Semua bank digital (Jenius, blu, Sea Bank, Bank Jago) sudah memiliki fitur toggle kartu instan sejak 2021. Beberapa pengguna myBCA mengeluh di App Store/Play Store bahwa tidak bisa memblokir kartu sendiri saat mencurigai fraud — harus antri Halo BCA.', source: 'App Store Review Analysis & Competitor Benchmarking', observedAt: 'April 2026' },
      { type: 'customer', label: 'NPS turun akibat pengalaman penanganan fraud lambat', detail: 'Survei post-complaint menunjukkan NPS pengguna yang mengalami fraud kartu virtual hanya -12 (sangat rendah). Keluhan utama: tidak bisa blokir kartu sendiri dan harus menunggu 2-3 hari untuk resolusi via call center.', source: 'Post-Complaint NPS Survey Q1 2026', observedAt: 'Februari–Maret 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'loyalty-dashboard',
    title: 'Loyalty Points Dashboard',
    description: 'Dashboard terpadu untuk melihat saldo poin BCA Rewards, riwayat perolehan dan penukaran, serta rekomendasi reward yang bisa ditukar berdasarkan poin aktif.',
    businessObjective: 'Meningkatkan redemption rate program loyalitas dan mengurangi poin yang kadaluarsa (expired tanpa ditukar).',
    targetUsers: 'Pengguna program BCA Rewards — estimasi 3,5 juta pemegang kartu kredit BCA aktif.',
    impactArea: ['CX'],
    supportingEvidence: ['Survey'],
    estimatedImpact: 'Meningkatkan redemption rate dari 12% ke 20%, mengurangi biaya liabilitas poin kadaluarsa.',
    riskIfNotImplemented: 'Poin tidak termanfaatkan, engagement program loyalitas rendah, nasabah tidak sadar nilai reward yang mereka miliki.',
    effortEstimation: '10 story points',
    targetQuarter: 'Q4',
    dependency: [],
    completenessScore: 77,
    status: 'ai_scored',
    isEmergency: false,
    aiResult: {
      moscow: 'Could Have',
      reasoning: { summary: 'Enhancement program loyalitas yang meningkatkan experience, namun bukan driver utama retensi atau revenue baru. Redemption rate yang rendah lebih disebabkan oleh program reward yang kurang menarik, bukan karena tidak ada dashboard.', evidenceRefs: ['BCA Rewards redemption analytics 2025', 'Loyalty program benchmark perbankan'] },
      confidenceLevel: 65,
      riceScore: { reach: 5, impact: 0.5, confidence: 65, effort: 10, total: 0.16, reachLabel: 'High Reach' },
      valueEffort: { value: 'Low', effort: 'Medium' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Low',
    recommendation: 'defer',
    priorityChangeReason: 'Redemption rate rendah lebih disebabkan kurangnya daya tarik reward, bukan visibilitas. Dashboard saja tidak cukup tanpa perbaikan katalog reward.',
    roadmapLane: 'Later',
    createdBy: 'user-po-001',
    createdAt: new Date('2026-04-18'),
    updatedAt: scoredAt,
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 1_500_000_000,
      max: 4_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp1,5-4 miliar liabilitas poin kadaluarsa per tahun',
      formula: '3,5 juta pemegang × 88% tidak redeem × rata-rata poin aktif Rp50-100 ribu equivalent',
      assumptions: [
        '3,5 juta pemegang kartu kredit BCA aktif',
        'Redemption rate saat ini 12% (88% tidak pernah redeem)',
        'Rata-rata nilai poin aktif Rp50-100 ribu per pemegang',
      ],
    },
    evidenceSignals: [
      { type: 'customer', label: 'Redemption rate hanya 12% — 88% poin tidak pernah ditukar', detail: 'Data internal BCA Rewards 2025 menunjukkan hanya 12% pemegang kartu yang pernah menukar poin. Survei kepada non-redeemer: 55% tidak tahu poin mereka sudah cukup untuk ditukar, 30% tidak tahu cara menukar, dan 15% tidak tahu poin mereka hampir kadaluarsa.', source: 'BCA Rewards Redemption Analytics 2025', observedAt: 'Desember 2025' },
      { type: 'business', label: 'Dashboard saja tidak cukup — akar masalah ada di katalog reward', detail: 'Studi internal menunjukkan bahwa bank dengan redemption rate tinggi (>30%) bukan karena dashboard yang lebih baik, melainkan karena reward yang lebih relevan (cashback, voucher makan, diskon e-commerce). BCA Rewards masih didominasi reward perjalanan yang hanya menarik untuk segmen tertentu.', source: 'Loyalty Program Benchmark Study Q1 2026', observedAt: 'Februari 2026' },
      { type: 'delivery', label: 'Integrasi kompleks dengan sistem BCA Rewards legacy', detail: 'Sistem BCA Rewards berjalan di platform terpisah dengan API yang sudah berumur 8 tahun. Integrasi dashboard memerlukan koordinasi dengan tim BCA Rewards untuk membuka API baru, estimasi tambahan 3 SP di luar scope awal.', source: 'Engineering Dependency Assessment April 2026', observedAt: 'April 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'onboarding-redesign',
    title: 'Onboarding Redesign',
    description: 'Redesign alur onboarding myBCA untuk meningkatkan completion rate dengan pendekatan progressive disclosure, onboarding kontekstual, dan pengurangan step registrasi.',
    businessObjective: 'Meningkatkan activation rate pengguna baru dan mengurangi waktu untuk first transaction.',
    targetUsers: 'Pengguna baru myBCA — rata-rata 150.000 registrasi baru per bulan.',
    impactArea: ['CX', 'Retention'],
    supportingEvidence: ['Analytics', 'Survey'],
    estimatedImpact: 'Meningkatkan onboarding completion rate dari 62% ke 87%, menambah ~37.500 pengguna aktif baru per bulan.',
    riskIfNotImplemented: 'Drop-off onboarding tinggi terus berlanjut, menghilangkan 38% potensi pengguna baru setiap bulan.',
    effortEstimation: '12 story points',
    targetQuarter: 'Q1',
    dependency: [],
    completenessScore: 98,
    status: 'delivered',
    isEmergency: false,
    aiResult: {
      moscow: 'Must Have',
      reasoning: { summary: 'Onboarding adalah top-of-funnel yang menentukan segalanya. Drop-off 38% berarti BCA kehilangan hampir setengah potensi pengguna baru setiap bulan sebelum mereka pernah bertransaksi.', evidenceRefs: ['Onboarding funnel analytics Q4 2025', 'Competitor onboarding benchmarking'] },
      confidenceLevel: 88,
      riceScore: { reach: 5, impact: 3, confidence: 88, effort: 12, total: 1.1, reachLabel: 'High Reach' },
      valueEffort: { value: 'High', effort: 'High' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'High',
    recommendation: 'keep',
    priorityChangeReason: '✅ Delivered Q1 2026. Completion rate meningkat dari 62% ke 89%, melampaui target 87%.',
    roadmapLane: 'Now',
    createdBy: 'user-po-001',
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2026-03-30'),
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 22_000_000_000,
      max: 56_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp22-56 miliar/bulan opportunity dari pengguna yang drop-off onboarding',
      formula: '150.000 registrasi/bulan × 38% drop-off × first-year LTV Rp400-1.000 ribu',
      assumptions: [
        '150.000 registrasi baru rata-rata per bulan',
        'Drop-off rate onboarding 38% sebelum redesign',
        'Estimasi lifetime value tahun pertama pengguna aktif Rp400 ribu–1 juta',
      ],
    },
    evidenceSignals: [
      { type: 'business', label: 'Drop-off onboarding 38% — 57.000 user hilang per bulan', detail: 'Sebelum redesign, funnel analytics menunjukkan 38% pengguna yang memulai registrasi tidak menyelesaikan onboarding. Bottleneck utama ada di step verifikasi KTP (drop 22%) dan step setting PIN (drop 16%). Setelah delivery Q1, drop-off turun ke 11%.', source: 'Onboarding Funnel Analytics Q4 2025 vs Q1 2026', observedAt: 'Desember 2025 – Maret 2026' },
      { type: 'customer', label: 'Time-to-first-transaction turun dari 4,2 hari ke 1,1 hari', detail: 'Salah satu metrik utama redesign adalah mempercepat waktu dari registrasi ke transaksi pertama. Setelah delivery, rata-rata turun dari 4,2 hari menjadi 1,1 hari — pengguna lebih cepat merasakan value aplikasi dan lebih sedikit yang churn di fase awal.', source: 'Post-Launch Analytics Report Maret 2026', observedAt: 'Maret 2026' },
      { type: 'delivery', label: '✅ Delivered Q1 2026 — Completion rate 89% (target 87%)', detail: 'Fitur berhasil diluncurkan pada Februari 2026. Completion rate onboarding meningkat dari 62% ke 89%, melampaui target 87%. A/B testing menunjukkan kelompok onboarding baru memiliki 30-day retention 18% lebih tinggi dari kelompok kontrol.', source: 'Q1 2026 Delivery Report & A/B Test Results', observedAt: 'Maret 2026' },
    ],
    productId: 'prod-001',
  },
  {
    id: 'statement-download',
    title: 'Statement Download PDF',
    description: 'Unduh e-statement rekening dalam format PDF langsung dari aplikasi myBCA, dengan filter periode fleksibel (harian, bulanan, custom range).',
    businessObjective: 'Mengurangi volume kontak call center terkait permintaan statement dan meningkatkan kepuasan nasabah yang butuh dokumen keuangan untuk keperluan administrasi.',
    targetUsers: 'Seluruh pengguna myBCA yang perlu dokumen statement — terutama pengguna yang butuh untuk visa, KPR, atau laporan pajak.',
    impactArea: ['Ops', 'CX'],
    supportingEvidence: ['Complaint Data'],
    estimatedImpact: 'Mengurangi volume tiket call center terkait statement 40%, menghemat biaya operasional Rp2-4 miliar/tahun.',
    riskIfNotImplemented: 'Beban call center tetap tinggi. Pengguna frustrated harus antri call hanya untuk download statement.',
    effortEstimation: '6 story points',
    targetQuarter: 'Q1',
    dependency: [],
    completenessScore: 95,
    status: 'delivered',
    isEmergency: false,
    aiResult: {
      moscow: 'Should Have',
      reasoning: { summary: 'Efisiensi operasional yang berdampak langsung pada biaya layanan dan kepuasan nasabah. Volume tiket yang tinggi mengindikasikan kebutuhan nyata dan mendesak.', evidenceRefs: ['Statement request complaint data Q3 2025', 'Call center operational cost report 2025'] },
      confidenceLevel: 80,
      riceScore: { reach: 10, impact: 1, confidence: 80, effort: 6, total: 1.33, reachLabel: 'Massive Reach' },
      valueEffort: { value: 'Medium', effort: 'Low' },
      promptVersion: 'demo-v3.0',
      scoredAt,
    },
    initialPriority: 'Medium',
    recommendation: 'keep',
    priorityChangeReason: '✅ Delivered Q1 2026. Volume tiket statement di call center turun 43%, melampaui target 40%.',
    roadmapLane: 'Next',
    createdBy: 'user-po-001',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2026-02-28'),
    opportunityAtRisk: {
      metric: 'retained_balance',
      min: 2_000_000_000,
      max: 4_000_000_000,
      currency: 'IDR',
      isDemoEstimate: true,
      label: 'Rp2-4 miliar biaya operasional call center per tahun',
      formula: '32.000 tiket statement/bulan × biaya handling Rp5-10 ribu/tiket × 12 bulan',
      assumptions: [
        '32.000 tiket permintaan statement via call center per bulan (sebelum fitur)',
        'Rata-rata biaya handling call center Rp5.000-10.000 per tiket',
        'Asumsi 40-50% tiket bisa dialihkan ke self-service setelah fitur diluncurkan',
      ],
    },
    evidenceSignals: [
      { type: 'business', label: '32.000 tiket statement per bulan ke call center', detail: 'Sebelum fitur diluncurkan, rata-rata 32.000 tiket per bulan masuk ke call center khusus untuk permintaan statement. Ini adalah kategori tiket #3 terbanyak setelah lupa PIN dan transaksi gagal. Setelah delivery, volume turun ke 18.000 tiket (-43%).', source: 'Call Center Ticket Classification Report Q3 2025 vs Q1 2026', observedAt: 'September 2025 – Maret 2026' },
      { type: 'customer', label: 'Dokumen statement sering dibutuhkan untuk administrasi', detail: 'Survey menunjukkan 71% permintaan statement untuk keperluan: pengajuan KPR (35%), permohonan visa (22%), dan laporan pajak pribadi (14%). Ketiganya memiliki deadline ketat — membuat pengguna frustrated jika harus antri call center 20-30 menit.', source: 'Customer Request Survey Q3 2025', observedAt: 'Agustus–September 2025' },
      { type: 'delivery', label: '✅ Delivered Q1 2026 — Operasional call center lebih efisien', detail: 'Fitur diluncurkan Januari 2026. Dalam 2 bulan pertama, 14.000 statement berhasil diunduh mandiri oleh pengguna per bulan. Volume tiket call center turun 43%. Kepuasan (CSAT) pengguna yang menggunakan fitur ini: 4,7/5.', source: 'Post-Launch Report & CSAT Survey Maret 2026', observedAt: 'Februari–Maret 2026' },
    ],
    productId: 'prod-001',
  },
];

export const MOCK_POCKET_RUPIAH_AI_RESULT: AIResult = {
  moscow: 'Must Have',
  reasoning: {
    summary: '⚠️ DETEKSI KOMPETITOR: Fitur pocket/kantong telah ada di Jenius (sejak 2017) dan blu (sejak 2020). Urgensi perlu dinaikkan dari Q4 ke Q3 untuk mencegah churn nasabah ke kompetitor yang sudah memiliki fitur ini lebih dulu.',
    evidenceRefs: ['Jenius - Kantong (rilis 2017)', 'blu by BCA Digital - Tabungan Tujuan (rilis 2020)', 'Demo eligible-user assumption'],
  },
  confidenceLevel: 75,
  riceScore: { reach: 5, impact: 3, confidence: 75, effort: 8, total: 1.41, reachLabel: 'High Reach' },
  valueEffort: { value: 'High', effort: 'Medium' },
  promptVersion: 'demo-v3.0',
  scoredAt,
  agentFindings: [
    {
      agentId: 'market-agent',
      agentName: 'Market Agent',
      role: 'Trend Tracker · Context Adaptor · Loss Predictor · Schedule Guard',
      icon: '◎',
      summary: '⚠️ FITUR SUDAH ADA DI KOMPETITOR SEJAK LAMA: Jenius meluncurkan "Kantong" pada 2017 (9 tahun lalu), blu meluncurkan "Tabungan Tujuan" pada 2020 (6 tahun lalu). BCA tertinggal signifikan dalam kapabilitas money management.',
      contributesTo: ['Market Urgency Score', 'Delay Risk', 'Timeline Flag'],
      evidence: ['Jenius Kantong - launched 2017', 'blu Tabungan Tujuan - launched 2020', 'Public competitor references'],
    },
    {
      agentId: 'value-agent',
      agentName: 'Value Agent',
      role: 'Context Matcher · Goal Aligner · Reach Estimator · Bias Calibrator',
      icon: '↗',
      summary: 'Dengan asumsi konservatif, 6.400-12.000 pengguna dapat mempertahankan Rp9,6-30 miliar saldo. Risiko churn meningkat karena kompetitor sudah memiliki fitur ini bertahun-tahun.',
      contributesTo: ['Reach Score', 'Impact Score', 'Alignment Product Rating'],
      evidence: ['Demo adoption and balance assumptions', 'Competitor feature maturity analysis'],
    },
    {
      agentId: 'feasibility-agent',
      agentName: 'Feasibility Agent',
      role: 'Effort Estimator · Dependency Mapper · Compliance Guard',
      icon: '◇',
      summary: 'Effort moderat dan tidak memiliki blocker kritis; risiko terbesar adalah terlambat mengejar ekspektasi pasar yang sudah terbentuk sejak 2017.',
      contributesTo: ['Effort Score', 'Compliance Rating', 'Dependency Map'],
      evidence: ['Existing transfer and account capabilities', 'Market expectation established since 2017'],
    },
  ],
};

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  icon: string;
  steps: string[];
}

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  { id: 'market-agent', name: 'Market Agent', role: 'Trend Tracker · Context Adaptor · Loss Predictor · Schedule Guard', icon: '◎', steps: ['Mengekstrak Time to Market & PMO Status...', 'Menganalisis tren pasar & kompetitor...', 'Mengkalkulasi Market Urgency Score & Delay Risk...'] },
  { id: 'value-agent', name: 'Value Agent', role: 'Context Matcher · Goal Aligner · Reach Estimator · Bias Calibrator', icon: '↗', steps: ['Menganalisis Function Req & User Type...', 'Mengekstrak Product Context...', 'Mengkalkulasi Reach, Impact & Alignment Score...'] },
  { id: 'feasibility-agent', name: 'Feasibility Agent', role: 'Effort Estimator · Dependency Mapper · Compliance Guard', icon: '◇', steps: ['Memetakan Existing Condition & Concern...', 'Menganalisis Network & Scrum Team profile...', 'Mengkalkulasi Effort, Compliance & Dependency...'] },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-qris-001', type: 'ai_scored', actor: 'AIPRO AI', actorRole: 'PO',
    description: 'AI scoring completed: Improve QRIS Retry Flow',
    subDescription: 'confidence 85% · Must Have',
    backlogId: 'qris-retry', backlogTitle: 'Improve QRIS Retry Flow', timestamp: new Date('2026-06-18T09:00:00'), productId: 'prod-001',
  },
  {
    id: 'act-login-001', type: 'ai_scored', actor: 'AIPRO AI', actorRole: 'PO',
    description: 'AI scoring completed: Login Biometrik',
    subDescription: 'confidence 80% · Should Have',
    backlogId: 'login-biometric', backlogTitle: 'Login Biometrik', timestamp: new Date('2026-06-19T10:00:00'), productId: 'prod-001',
  },
  {
    id: 'act-darkmode-001', type: 'ai_scored', actor: 'AIPRO AI', actorRole: 'PO',
    description: 'AI scoring completed: Dark Mode',
    subDescription: 'confidence 70% · Could Have',
    backlogId: 'dark-mode', backlogTitle: 'Dark Mode', timestamp: new Date('2026-06-19T14:00:00'), productId: 'prod-001',
  },
  {
    id: 'act-pocket-001', type: 'ai_scored', actor: 'AIPRO AI', actorRole: 'PO',
    description: '⚠️ Priority mismatch detected: Pocket Rupiah',
    subDescription: 'PO Low → AI Must Have · confidence 75%',
    backlogId: 'pocket-rupiah', backlogTitle: 'Pocket Rupiah', timestamp: new Date('2026-06-20T10:00:00'), productId: 'prod-001',
  },
  {
    id: 'act-pocket-002', type: 'warning', actor: 'AIPRO AI', actorRole: 'PO',
    description: '⚠️ DETEKSI KOMPETITOR: Fitur pocket sudah ada di Jenius (2017) dan blu (2020)',
    subDescription: 'BCA tertinggal 6-9 tahun · Urgensi perlu dinaikkan dari Q4 ke Q3',
    backlogId: 'pocket-rupiah', backlogTitle: 'Pocket Rupiah', timestamp: new Date('2026-06-20T10:05:00'), productId: 'prod-001',
  },
  {
    id: 'act-pocket-003', type: 'human_override', actor: 'Budi Santoso', actorRole: 'PO',
    description: 'Reviewed AIPRO recommendation for Pocket Rupiah',
    subDescription: 'Human decision required before roadmap change',
    backlogId: 'pocket-rupiah', backlogTitle: 'Pocket Rupiah', timestamp: new Date('2026-06-20T10:10:00'), productId: 'prod-001',
  },
  {
    id: 'act-onboarding-001', type: 'backlog_delivered', actor: 'Citra Dewi', actorRole: 'Dev',
    description: 'Onboarding Redesign delivered',
    subDescription: 'Completion rate onboarding naik 25%',
    backlogId: 'onboarding-redesign', backlogTitle: 'Onboarding Redesign', timestamp: new Date('2026-03-30T09:00:00'), productId: 'prod-001',
  },
  {
    id: 'act-statement-001', type: 'backlog_delivered', actor: 'Fajar Maulana', actorRole: 'QA',
    description: 'Statement Download PDF delivered',
    subDescription: 'Komplain statement turun 40%',
    backlogId: 'statement-download', backlogTitle: 'Statement Download PDF', timestamp: new Date('2026-02-28T09:00:00'), productId: 'prod-001',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-qris', type: 'ai_scored', title: 'AI scoring completed',
    body: 'Improve QRIS Retry Flow telah di-score (confidence 85%).',
    isRead: true, actionUrl: '/backlog/qris-retry', timestamp: new Date('2026-06-18T09:00:00'),
  },
  {
    id: 'notif-login', type: 'ai_scored', title: 'AI scoring completed',
    body: 'Login Biometrik telah di-score (confidence 80%).',
    isRead: true, actionUrl: '/backlog/login-biometric', timestamp: new Date('2026-06-19T10:00:00'),
  },
  {
    id: 'notif-darkmode', type: 'ai_scored', title: 'AI scoring completed',
    body: 'Dark Mode telah di-score (confidence 70%).',
    isRead: true, actionUrl: '/backlog/dark-mode', timestamp: new Date('2026-06-19T14:00:00'),
  },
  {
    id: 'notif-pocket', type: 'ai_scored', title: '⚠️ Priority mismatch detected',
    body: 'Pocket Rupiah dinilai Must Have meskipun prioritas awal PO masih Low.',
    isRead: false, actionUrl: '/backlog/pocket-rupiah', timestamp: new Date('2026-06-20T10:00:00'),
  },
  {
    id: 'notif-pocket-competitor', type: 'myservice_new', title: '⚠️ DETEKSI KOMPETITOR - Fitur sudah ada sejak lama',
    body: 'Fitur pocket/kantong sudah ada di Jenius (2017) dan blu (2020). BCA tertinggal 6-9 tahun. Urgensi perlu dinaikkan dari Q4 ke Q3.',
    isRead: false, actionUrl: '/backlog/pocket-rupiah', timestamp: new Date('2026-06-20T10:05:00'),
  },
];

export function getDetailedImpactResult(backlogId: string, targetLane: RoadmapLane | Quarter, item?: Backlog): ImpactAnalysisResult {
  const laneStr = String(targetLane);

  switch (backlogId) {
    case 'pocket-rupiah':
      if (laneStr === 'Q3') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'split-bill', affectedBacklogTitle: 'Split Bill', description: 'Bergeser dari Q3 ke Q4 untuk membebaskan 9 story points.', severity: 'medium' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Retained Balance', description: 'Mempertahankan potensi saldo Rp9,6-30 miliar dari risiko churn ke kompetitor.', severity: 'high' },
            { kpi: 'Competitive Gap', description: '⚠️ Menutup ketertinggalan 6-9 tahun dari Jenius Kantong (2017) & blu Tabungan Tujuan (2020).', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '⚠️ PROMOSIKAN SEGERA KE Q3: Memindahkan Pocket Rupiah ke Q3 sangat direkomendasikan. Ini menutup gap kompetitor kritis 6-9 tahun dan mempertahankan estimasi Rp9,6-30 miliar retained balance nasabah. Trade-off: Split Bill digeser ke Q4.',
          recommendedAction: 'promote',
        };
      } else if (laneStr === 'Q2') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'qris-retry', affectedBacklogTitle: 'QRIS Auto Retry', description: 'Terancam bergeser dari Q2 karena overcapacity tim.', severity: 'high' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Capacity Overload', description: 'Beban sprint Q2 melonjak hingga 160%, berisiko menyebabkan bug rilis.', severity: 'high' },
          ],
          estimatedDelayInSprints: 1,
          aiRecommendation: '⛔ TIDAK DIREKOMENDASIKAN KE Q2: Q2 sudah mencapai batas kapasitas maksimum (15 story points dari QRIS Retry & Recurring Transfer). Rekomendasi terbaik adalah Q3.',
          recommendedAction: 'reject',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Market Opportunity Loss', description: 'Risiko nasabah memindahkan aktivitas budgeting & saldo simpanan ke aplikasi kompetitor.', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '⚠️ PENUNDAAN BERISIKO CHURN: Menahan Pocket Rupiah tetap di Q4 memperlebar risiko kehilangan nasabah muda yang membutuhkan fitur budgeting ke Jenius dan blu. Disarankan dipromosikan ke Q3.',
          recommendedAction: 'defer',
        };
      }

    case 'qris-retry':
      if (laneStr === 'Q2') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Transaction Success Rate', description: 'Memulihkan 8.500+ transaksi QRIS gagal bulanan (potensi nilai Rp1,2 miliar/bulan).', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ PERTAHANKAN DI Q2: QRIS Auto Retry memiliki dampak langsung pada perbaikan transaksi gagal bulanan. Pertahankan rilis di Q2.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'recurring-transfer', affectedBacklogTitle: 'Recurring Transfer', description: 'Kapasitas Q3/Q4 menjadi padat dengan akumulasi backlog transaksi.', severity: 'medium' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Transaction Failure Loss', description: 'Kerugian Rp1,2 miliar/bulan dari transaksi QRIS gagal akan terus berlanjut hingga kuartal berikutnya.', severity: 'high' },
            { kpi: 'Call Center Volume', description: 'Komplain transaksi menggantung di Halo BCA tidak dapat diredam di Q2.', severity: 'high' },
          ],
          estimatedDelayInSprints: 2,
          aiRecommendation: `⚠️ PENUNDAAN BERISIKO HIGH: Memindahkan QRIS Auto Retry dari Q2 ke ${laneStr} menunda pemulihan 8.500+ transaksi gagal bulanan. Disarankan tetap dieksekusi di Q2.`,
          recommendedAction: 'defer',
        };
      }

    case 'recurring-transfer':
      if (laneStr === 'Q2') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Routine Transaction Volume', description: 'Mendorong retensi transaksi rutin untuk 1,8 juta nasabah eligible.', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ PERTAHANKAN DI Q2: Recurring Transfer adalah komitmen retensi transaksi digital penting. Tetap jalankan di Q2.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'spending-analytics-v2', affectedBacklogTitle: 'Spending Analytics v2', description: 'Menambah beban sprint di kuartal target.', severity: 'medium' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Digital Retention Rate', description: 'Penundaan 3 bulan adopsi transaksi rutin berkala nasabah payroll/investasi.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 1,
          aiRecommendation: `⚠️ PENUNDAAN RETENSI: Memindahkan Recurring Transfer ke ${laneStr} membebaskan 7 pts di Q2, namun menunda otomasi transaksi rutin nasabah. Evaluasi kapasitas tim.`,
          recommendedAction: 'defer',
        };
      }

    case 'login-biometric':
      if (laneStr === 'Q2') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [
            { dependencyId: 'identity-v2', dependencyTitle: 'Identity Service v2', description: 'BLOCKER KRITIS: Core API Auth v2 belum rilis di Q2. Integrasi biometrik akan gagal build.', isBlocker: true },
          ],
          kpiImpacts: [
            { kpi: 'System Stability', description: 'Risiko kegagalan integrasi gateway autentikasi.', severity: 'high' },
          ],
          estimatedDelayInSprints: 2,
          aiRecommendation: '⛔ TERHALANG DEPENDENCY KRITIS: Biometric Login v2 TIDAK BISA dipindahkan ke Q2 karena core service "Identity Service v2" belum siap dan baru dijadwalkan selesai di akhir Q3.',
          recommendedAction: 'reject',
        };
      } else if (laneStr === 'Q3') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [
            { dependencyId: 'identity-v2', dependencyTitle: 'Identity Service v2', description: 'Dependency aktif: Perlu koordinasi rilis paralel dengan Tim Core Platform di akhir Q3.', isBlocker: false },
          ],
          kpiImpacts: [
            { kpi: 'Login Friction Reduction', description: 'Mengurangi waktu login nasabah dari 8 detik ke 1,2 detik.', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '⚠️ RISIKO DEPENDENCY SLIP: Rilis di Q3 dapat dilakukan jika Identity Service v2 tepat waktu di akhir Q3. Jika ada keterlambatan 1 sprint, fitur ini berisiko bergeser ke Q4.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [
            { dependencyId: 'identity-v2', dependencyTitle: 'Identity Service v2', description: 'Identity Service v2 diprediksi sudah 100% stable di Q3.', isBlocker: false },
          ],
          kpiImpacts: [
            { kpi: 'Authentication Security', description: 'Peningkatan keamanan login tanpa menambah kecemasan lupa PIN.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ TIMING PALING AMAN (Q4): Identity Service v2 diprediksi rampung penuh di Q3, menjadikan Q4 timing paling stabil dan bebas risiko untuk rilis Biometric Login.',
          recommendedAction: 'keep',
        };
      }

    case 'spending-analytics-v2':
      if (laneStr === 'Q3') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Money Management Synergy', description: 'Memberikan kategorisasi pengeluaran otomatis untuk mendukung Pocket Rupiah.', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ SANGAT DIREKOMENDASIKAN DI Q3: Peluncuran bersamaan dengan Pocket Rupiah di Q3 menciptakan ekosistem Money Management yang lengkap dan solid.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'loyalty-dashboard', affectedBacklogTitle: 'Loyalty Points Dashboard', description: 'Menambah kepadatan rilis fitur analitik di Q4.', severity: 'low' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Ecosystem Synergy Loss', description: 'Nasabah Pocket Rupiah di Q3 tidak mendapatkan insight pengeluaran otomatis untuk budgeting.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 1,
          aiRecommendation: `⚠️ MENGERUS SINERGI MONEY MANAGEMENT: Spending Analytics v2 adalah komplemen wajib Pocket Rupiah (Q3). Memindahkannya ke ${laneStr} menghilangkan sinergi pengeluaran & budgeting saat launching.`,
          recommendedAction: 'defer',
        };
      }

    case 'split-bill':
      if (laneStr === 'Q4') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'pocket-rupiah', affectedBacklogTitle: 'Pocket Rupiah', description: 'Memberikan ruang kapasitas penuh 9 pts bagi Pocket Rupiah di Q3.', severity: 'high' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Capacity Optimization Q3', description: 'Membebaskan 9 story points di Q3 tanpa mengganggu target KPI keamanan & retensi.', severity: 'high' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ REKOMENDASI TRADE-OFF OPTIMAL: Memindahkan Split Bill dari Q3 ke Q4 membebaskan 9 story points di Q3, memberikan ruang bagi peluncuran Pocket Rupiah tanpa risiko rilis.',
          recommendedAction: 'defer',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'pocket-rupiah', affectedBacklogTitle: 'Pocket Rupiah', description: 'Perebutan 9 pts kapasitas sprint dengan Pocket Rupiah.', severity: 'medium' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Gen-Z P2P Engagement', description: 'Mempercepat fitur berbagi tagihan sosial untuk segmen nasabah muda.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: `⚠️ MEMBEBANI SPRINT Q3: Menempatkan Split Bill di Q3 bersamaan dengan Pocket Rupiah & Spending Analytics akan melampaui batas velocity tim. Pertimbangkan Q4.`,
          recommendedAction: 'keep',
        };
      }

    case 'virtual-card-control':
      if (laneStr === 'Q4') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Card Security Management', description: 'Memberikan kontrol limit & toggle kartu mandiri nasabah di Q4.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ TEPAT DI Q4: Eksekusi di Q4 memungkinkan fokus penuh pada kontrol kartu setelah pengerjaan fitur konsumen di Q3 rampung.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'spending-analytics-v2', affectedBacklogTitle: 'Spending Analytics v2', description: 'Beban sprint Q3 meningkat 8 story points.', severity: 'medium' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Security CX Acceleration', description: 'Mempercepat ketersediaan kontrol kartu mandiri nasabah di Q3.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: `⚠️ KAPASITAS KETAT: Memindahkan Virtual Card Control ke ${laneStr} menambah 8 story points di kuartal tersebut yang sudah padat. Pastikan ketersediaan resource dev.`,
          recommendedAction: 'defer',
        };
      }

    case 'loyalty-dashboard':
      if (laneStr === 'Q4') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Voucher Redemption Rate', description: 'Potensi kenaikan redemption rate voucher promo (+2%).', severity: 'low' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ PILIHAN TEPAT DI Q4: Tetap di Q4 sebagai backlog opsional (Fill-in) saat ada kapasitas lebih.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'pocket-rupiah', affectedBacklogTitle: 'Pocket Rupiah', description: 'Mengambil 10 pts kapasitas yang seharusnya untuk fitur core.', severity: 'high' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Low Business ROI', description: 'Effort 10 pts tidak sebanding dengan dampak revenue/retensi langsung.', severity: 'low' },
          ],
          estimatedDelayInSprints: 1,
          aiRecommendation: `⛔ LOW BUSINESS IMPACT (RICE 0.16): Loyalty Points Dashboard memiliki nilai RICE paling rendah (0.16). Memindahkannya ke ${laneStr} akan mengorbankan fitur berorientasi growth.`,
          recommendedAction: 'reject',
        };
      }

    case 'dark-mode':
      if (laneStr === 'Q4') {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'UX Satisfaction', description: 'Peningkatan kepuasan estetika dan hemat daya layar OLED.', severity: 'low' },
          ],
          estimatedDelayInSprints: 0,
          aiRecommendation: '✅ TEPAT DITUNDA KE Q4: Dikerjakan di Q4 sebagai penyempurnaan UI/UX setelah fitur-fitur transaksi utama selesai.',
          recommendedAction: 'keep',
        };
      } else {
        return {
          backlogId,
          targetLane,
          roadmapImpacts: [
            { affectedBacklogId: 'qris-retry', affectedBacklogTitle: 'QRIS Auto Retry', description: 'Refactoring 40+ layar menyita waktu dev hingga 13 story points.', severity: 'high' },
          ],
          dependencyImpacts: [],
          kpiImpacts: [
            { kpi: 'Resource Opportunity Cost', description: 'Mengalokasikan 13 pts dev pada perbaikan kosmetik dibanding fitur transaksi inti.', severity: 'medium' },
          ],
          estimatedDelayInSprints: 2,
          aiRecommendation: `⚠️ EFFORT BESAR REFACTORING: Dark Mode memerlukan refactoring 40+ layar UI (13 pts). Memindahkannya ke ${laneStr} menyita kapasitas besar tanpa dampak revenue/retensi langsung.`,
          recommendedAction: 'defer',
        };
      }

    default:
      const title = item?.title || 'Backlog item';
      const effort = item?.effortEstimation || '8 pts';
      const moscow = item?.aiResult?.moscow || 'Should Have';
      return {
        backlogId,
        targetLane,
        roadmapImpacts: [],
        dependencyImpacts: [],
        kpiImpacts: [
          { kpi: 'Sprint Capacity Alignment', description: `Evaluasi alokasi ${effort} pada roadmap ${laneStr}.`, severity: 'medium' },
        ],
        estimatedDelayInSprints: 0,
        aiRecommendation: `Analisis dampak perpindahan ${title} (${moscow}, ${effort}) ke ${laneStr}: Pastikan alokasi resource tim dan dependency antar-squad telah selaras sebelum persetujuan final PO.`,
        recommendedAction: 'keep',
      };
  }
}

export const MOCK_IMPACT_RESULTS: Record<string, ImpactAnalysisResult> = {
  'pocket-rupiah': getDetailedImpactResult('pocket-rupiah', 'Q3'),
};

export const MOCK_IMPACT_RESULT = MOCK_IMPACT_RESULTS['pocket-rupiah'];

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
