# 📑 AIPRO Technical Prototype Specification & Architecture Reference
> **Catatan Penggunaan NotebookLM**: Dokumen ini berisi **spesifikasi teknis 100% nyata (real codebase implementation)** dari prototipe aplikasi **AIPRO (AI Driven Backlog Prioritization & Recommendation)**. Gunakan dokumen ini sebagai sumber pengetahuan utama (*source document*) pada NotebookLM untuk menghasilkan bahan presentasi, audio overview, Q&A, maupun slide deck.

---

## 🏢 1. Metadata Ringkas Proyek Prototipe

* **Nama Sistem**: AIPRO (AI Driven Backlog Prioritization & Recommendation)
* **Framework Frontend**: Angular 21 (Standalone Components, Signals, Computed Properties, Tailwind CSS)
* **Sistem Sumber Data**: myService (Aplikasi Sistem Pengajuan Business Proposal / BPRO BCA)
* **Domain Aplikasi**: Perbankan Digital (misal: myBCA Mobile, KlikBCA Business, Wealth Management System)
* **Arsitektur Utama**: Multi-Agent Parallel Pipeline + Vector DB Integration + Hybrid Scoring Engine (RICE + MoSCoW + Value-Effort Matrix)

---

## 🏗️ 2. Arsitektur Multi-Agen & Pipeline Eksekusi Real

Prototipe AIPRO menggunakan arsitektur **Multi-Agent Parallel Processing** yang dibagi menjadi 3 Fase Utama:

```
[ Input Payload myService ] 
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 1: Orchestrator Agent (⚡)                                          │
│ • Menerima Backlog Data Payload                                          │
│ • Menghubungkan ke 3 Vector DB:                                         │
│   1. Product Context DB                                                 │
│   2. Scrum Team DB                                                      │
│   3. Compliance DB (Regulasi OJK, PBI, & UU PDP)                        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (Fan-out Paralel)
            ┌────────────────────────┼────────────────────────┐
            ▼                        ▼                        ▼
┌───────────────────────┐┌───────────────────────┐┌───────────────────────┐
│ Market Agent (◎)      ││ Value Agent (↗)       ││ Feasibility Agent (◇) │
│ • Skill:              ││ • Skill:              ││ • Skill:              │
│   - Trend Tracker     ││   - Context Matcher   ││   - Effort Estimator  │
│   - Context Adaptor   ││   - Goal Aligner      ││   - Dependency Mapper │
│   - Loss Predictor    ││   - Reach Estimator   ││   - Compliance Guard  │
│   - Schedule Guard    ││   - Bias Calibrator   ││ • DB: Compliance DB   │
└───────────┬───────────┘└───────────┬───────────┘└───────────┬───────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     │ (Fan-in Synthesis)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FASE 3: Central Decision Engine (❖)                                     │
│ • RICE Scoring Engine                                                   │
│ • Deterministic Guardrail Evaluator (Compliance & Opportunity Loss)     │
│ • MoSCoW Categorization Generator (Must, Should, Could, Won't Have)     │
│ • Value-Effort Matrix Mapper (Quick Win, Big Bet, Fill-in, Money Pit)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
                      [ Final Recommendations Output ]
```

---

## 🧮 3. Detail Formulasi Matematika & Aturan Kuantifikasi RICE

Rumus RICE yang diimplementasikan secara nyata di kode (`ai.service.ts`):

$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \left(\frac{\text{Confidence}}{100}\right)}{\text{Effort}}$$

### A. REACH (Skor 1 – 10: Skala Relatif Berbasis TAM)
Mengukur jangkauan pengguna terhadap Total Addressable Market (TAM).

1. **Jalur Form Manual PO (`targetCakupanAdopsi`)**:
   - `>50% TAM` $\rightarrow$ **Skor 10** (*Massive Reach* / *Enterprise Wide Impact*)
   - `20-50% TAM` $\rightarrow$ **Skor 5** (*High Reach* / *Departmental Reach*)
   - `5-20% TAM` $\rightarrow$ **Skor 2** (*Segmented Reach* / *Squad Specific*)
   - `<5% TAM` $\rightarrow$ **Skor 1** (*Niche Reach* / *Micro Internal*)

2. **Jalur Inferensi Otomatis AI (Value Agent)**:
   - Jika `userType = external` (Nasabah myBCA) $\rightarrow$ Diproyeksikan ke populasi nasabah aktif produk (Default: **10**, atau **5** untuk fitur dompet/pocket).
   - Jika `userType = internal` (Karyawan/Staf) $\rightarrow$ Diproyeksikan ke populasi staf unit target (Default: **5** - *Departmental Reach*).

### B. IMPACT (Pengali Dampak Bisnis: 0.5x, 1.5x, 2.0x, 3.0x)
Mengukur besarnya dampak fitur terhadap OKR Finansial & Retensi.

1. **Jalur Form Manual PO (`skalaDampakBisnis`)**:
   - `Massive` $\rightarrow$ Pengali **3.0x**
   - `High` $\rightarrow$ Pengali **2.0x**
   - `Medium` $\rightarrow$ Pengali **1.0x**
   - `Low` $\rightarrow$ Pengali **0.5x**

2. **Jalur Analisis Semantik NLP (Value Agent)**:
   - AI memindai kata kunci pada narasi `customerValue`, `description`, & `businessObjective`:
   - **Indikator Finansial / Retensi** (*"CASA"*, *"outflow"*, *"retensi"*, *"saldo"*, *"revenue"*, *"fee-based"*, *"income"*) $\rightarrow$ **3.0x** (*Massive Impact*).
   - **Benefit Engagement Standar** $\rightarrow$ **1.5x** (*Medium Impact*).

### C. CONFIDENCE (Tingkat Kepercayaan & Kepatuhan: 50% – 100%)
Mengukur kepastian teknis dan kepatuhan regulasi.

1. **Jalur Form Manual PO (`estimasiKepercayaan`)** $\rightarrow$ Menggunakan persentase PO (misal: `85%`).
2. **Jalur Audit Otomatis (Feasibility Agent + Compliance DB)**:
   - Feasibility Agent melakukan **Vector Search (RAG)** ke **Compliance DB** (berisi indeks aturan OJK, PBI, & UU PDP).
   - **High Confidence (90%)**: Vector search tidak menemukan pelanggaran regulasi, `blueprintUrl` valid ($\ge 10$ karakter/URL), DAN `ropaDpiaLink` lengkap jika ada akses data pribadi (`personalDataAccess = true`).
   - **Low Confidence (50%)**: Vector search menemukan potensi isu data pribadi tetapi `ropaDpiaLink` kosong **ATAU** `blueprintUrl` kosong/invalid.

### D. EFFORT (Beban Kerja: 4, 8, 13 Story Points)
Diukur dalam satuan Story Points dari field `valuegraphEffort` myService (dicocokkan dengan **Scrum Team DB**):
- `Low` Effort $\rightarrow$ **4** Story Points *(Fitur Ringan / Efisien)*
- `Medium` Effort $\rightarrow$ **8** Story Points *(Fitur Sedang - Default)*
- `High` Effort $\rightarrow$ **13** Story Points *(Fitur Berat / Kompleksitas Tinggi)*

> 📐 **Rentang Skor RICE Nyata di Sistem**:
> - **Minimal**: $\frac{1 \times 0.5 \times 0.50}{13} = \mathbf{0.02}$
> - **Maksimal**: $\frac{10 \times 3.0 \times 1.00}{4} = \mathbf{7.50}$

---

## 🎯 4. Logika Evaluasi MoSCoW & Guardrail Hybrid

Central Decision Engine menentukan kategori **MoSCoW** menggunakan kombinasi **Aturan Guardrail (Override Wajib)** dan **Threshold Skor RICE**:

```
                       [ Evaluasi MoSCoW Engine ]
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
[ 1. Cek Deterministic Guardrails ]                [ 2. Evaluasi Threshold RICE ]
 (Jika Terpemicu ➔ Override MUST HAVE)               (Jika Lolos Guardrails)
                                                         • RICE > 1.20   ➔ MUST HAVE
 🛑 Compliance Guardrail:                                • 0.81 - 1.20   ➔ SHOULD HAVE
    personalDataAccess = true                            • 0.41 - 0.80   ➔ COULD HAVE
    DAN ropaDpiaLink = KOSONG                            • RICE ≤ 0.40   ➔ WON'T HAVE

 📈 Market Urgency Guardrail:
    Ketinggalan kompetitor besar
    DAN fleksibilitasPeluncuran = Strict
```

---

## 📊 5. Aturan Pemetaan Value-Effort Matrix

Memetakan backlog ke dalam 4 Kuadran Strategis:

```
                          HIGH VALUE (Impact ≥ 2.0x)
                                      ▲
                                      │   ┌──────────────────────┬──────────────────────┐
                                      │   │      QUICK WIN       │       BIG BET        │
                                      │   │ (High Val, Low Eff)  │ (High Val, High Eff) │
                                      │   ├──────────────────────┼──────────────────────┤
                                      │   │       FILL-IN        │      MONEY PIT       │
                                      │   │ (Low Val, Low Eff)   │ (Low Val, High Eff)  │
                                      │   └──────────────────────┴──────────────────────┘
                                      └───────────────────────────────────────────────► HIGH EFFORT (Effort ≥ 10 SP)
```

| Kuadran | Kriteria Nilai & Effort | Kelas Warna UI | Rekomendasi Tindakan |
| :--- | :--- | :--- | :--- |
| **Quick Win** | Impact $\ge 2.0x$ & Effort $< 10$ SP (4-8 SP) | `bg-success/10 text-success` (Hijau) | **Eksekusi Segera**: Efisiensi tinggi, dampak bisnis cepat. |
| **Big Bet** | Impact $\ge 2.0x$ & Effort $\ge 10$ SP (13 SP) | `bg-bca-accent text-bca-primary` (Biru BCA) | **Investasi Strategis**: Butuh alokasi resource & sprint khusus. |
| **Fill-in** | Impact $< 2.0x$ & Effort $< 10$ SP (4-8 SP) | `bg-gray-100 text-gray-600` (Abu-abu) | **Pengisi Waktu**: Dikerjakan jika ada sisa kapasitas squad. |
| **Money Pit** | Impact $< 2.0x$ & Effort $\ge 10$ SP (13 SP) | `bg-danger/10 text-danger` (Merah) | **Hindari / Defer**: Effort besar tetapi dampak bisnis minim. |

---

## 💾 6. Struktur Schema Data TypeScript Real (Data Models)

Berikut adalah struktur antarmuka (*TypeScript Interfaces*) persis seperti pada berkas `backlog.model.ts`:

```typescript
export type AgentId = 'market-agent' | 'value-agent' | 'feasibility-agent';
export type MoSCoW = 'Must Have' | 'Should Have' | 'Could Have' | "Won't Have";
export type ValueEffortLevel = 'Low' | 'Medium' | 'High';
export type ValueEffortQuadrant = 'Quick Win' | 'Big Bet' | 'Fill-in' | 'Money Pit';

export interface MyServiceData {
  myServiceId: string;        // Ex: BPRO110026050
  projectName?: string;
  product?: string;            // Ex: myBCA Mobile
  userType?: 'internal' | 'external';
  valuegraphValue: ValueEffortLevel;
  valuegraphEffort: ValueEffortLevel;
  pmoSubmission?: 'adhoc' | 'planned';
  personalDataAccess?: boolean;
  ropaDpiaLink?: string;       // Link ROPA DPIA
  blueprintUrl?: string;       // URL Blueprint Architecture
}

export interface RICEScore {
  reach: number;       // 1 - 10
  impact: number;      // 0.5 - 3.0
  confidence: number;  // 50 - 100 (%)
  effort: number;      // 4, 8, 13 (Story Points)
  total: number;       // (Reach × Impact × Confidence%) / Effort
  reachLabel?: string;
}

export interface AIResult {
  moscow: MoSCoW;
  confidenceLevel: number;
  promptVersion: string;
  scoredAt: Date;
  riceScore: RICEScore;
  valueEffort: {
    value: ValueEffortLevel;
    effort: ValueEffortLevel;
  };
  reasoning: {
    summary: string;
    evidenceRefs: string[];
  };
}
```

---

## 🔎 7. Studi Kasus Nyata di Prototipe: Backlog "Pocket Rupiah"

* **Judul Backlog**: *Pocket Rupiah (Sub-rekening Tabungan Sesuai Goal)*
* **Input myService**:
  - `product`: myBCA Mobile
  - `userType`: external
  - `personalDataAccess`: true
  - `ropaDpiaLink`: "http://ropa.bca.co.id/doc/pocket-001" (Valid)
  - `blueprintUrl`: "http://blueprint.bca.co.id/pocket-arch" (Valid)
  - `customerValue`: "Mencegah perpindahan dana (CASA outflow) nasabah ke aplikasi kompetitor"
  - `valuegraphEffort`: Medium (8 Story Points)
* **Keluaran Hasil AI Engine**:
  - **Reach**: `5` *(High Reach — 20-50% TAM nasabah)*
  - **Impact**: `3.0x` *(Massive Impact — Terdeteksi kata kunci CASA Outflow)*
  - **Confidence**: `90%` *(Vector Search Compliance DB pass & dokumen ROPA/DPIA valid)*
  - **Effort**: `8` Story Points *(Medium)*
  - **Raw RICE Score**: $\frac{5 \times 3.0 \times 0.90}{8} = \mathbf{1.69}$
  - **Guardrail Check**: Ketinggalan kompetitor besar (Jenius sejak 2017 & blu sejak 2020) + Strict Launch $\rightarrow$ *Opportunity Loss Guardrail Triggered*.
  - **Kategori MoSCoW**: 🔥 **Must Have**
  - **Matriks Value-Effort**: 🟦 **Big Bet / Quick Win** (High Value $3.0x$, Medium Effort $8$ SP).

---

## 🧠 8. Rangkuman Poin Kunci untuk NotebookLM Prompts

Jika Anda ingin bertanya/generate konten dari NotebookLM menggunakan dokumen ini, gunakan prompt contoh berikut:

1. *"Buatkan naskah presentasi 3 menit berdasarkan spesifikasi teknis AIPRO ini."*
2. *"Jelaskan bagaimana Feasibility Agent menggunakan Vector Search ke Compliance DB untuk mengevaluasi regulasi OJK dan UU PDP."*
3. *"Buatkan 5 pertanyaan tersulit yang mungkin ditanyakan juri beserta jawaban tepatnya berdasarkan dokumen ini."*
4. *"Bandingkan bagaimana skor RICE dan MoSCoW dihitung pada produk eksternal vs produk internal."*
