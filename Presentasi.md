# 🚀 Cheat Sheet Presentasi Demo AIPRO untuk Juri

Dokumen ini dirancang sebagai **panduan utama & amunisi teknis** dalam mempresentasikan demo aplikasi **AIPRO (AI Driven Backlog Prioritization & Recommendation)** kepada juri.

---

## 📌 Navigasi Slide & Executive Talk Track

| Slide # | Judul Slide | Pesan Utama yang Harus Disampaikan ke Juri |
| :---: | :--- | :--- |
| **Slide 1** | **SOLUSI: AIPRO** | AIPRO mengubah proses penyusunan backlog manual yang subjektif & *bias* menjadi proses yang **Data-Driven**, **Market-Aware**, dan **Feasible**. |
| **Slide 2** | **Penggabungan 3 Metode** | AIPRO tidak hanya memakai 1 logika, melainkan **Menggabungkan 3 Metode Industri**: RICE Scoring (Kuantifikasi), MoSCoW Method (Urgensi Waktu & Guardrails), dan Value-Effort Matrix (Pemetaan Strategis). |
| **Slide 3** | **Arsitektur Multi-Agen** | Dapur pacu AIPRO digerakkan oleh **Arsitektur Multi-Agen Paralel** yang terhubung dengan **Vector DB (Product Context DB, Scrum Team DB, & Compliance DB)**. |
| **Slide 4** | **Demo Mockup Aplikasi** | Demonstrasi *live streaming analysis* secara *real-time*, memperlihatkan transparansi *thinking log* AI hingga menghasilkan rekomendasi akhir. |

---

## 📄 Breakdown Detail Per Slide & Script Presentasi

```
                                  SLIDE 1
┌───────────────────────────────────────────────────────────────────────────┐
│                               SOLUSI: AIPRO                               │
│            AI Driven Backlog Prioritization & Recommendation             │
│                                                                           │
│   [ Data-Driven ]            [ Market-Aware ]           [ Feasible ]      │
│ Menghilangkan bias      Terkoneksi dengan        Menilai kapasitas dev   │
│ asumsi & intervensi     sentimen kompetitor      & regulasi OJK secara   │
│ subjektif.              & kebutuhan eksternal.   otomatis.               │
└───────────────────────────────────────────────────────────────────────────┘
```
> 🎤 **Talk Track Slide 1 (30 Detik)**:  
> *"Selamat pagi/siang Dewan Juri. Dalam pengembangan produk perbankan digital, Product Manager sering dihadapkan pada ratusan backlog dari berbagai stakeholder. Masalah utamanya adalah **prioritisasi yang subjektif, Loudest Voice in the Room, dan pengabaian kepatuhan regulasi**.  
> **AIPRO** hadir sebagai solusi berbasis AI yang menyaring ribuan ide menjadi keputusan strategis berdasar 3 pilar: **Data-Driven** (bebas bias), **Market-Aware** (sadar posisi kompetitor), dan **Feasible** (otomatisasi uji kepatuhan regulasi OJK & kapasitas tim)."*

---

```
                                  SLIDE 2
┌───────────────────────────────────────────────────────────────────────────┐
│                          PENGGABUNGAN 3 METODE                            │
│                                                                           │
│   ┌─────────────────┐                                                     │
│   │   Raw Backlog   │                                                     │
│   └────────┬────────┘                                                     │
│            ▼                                                              │
│   ┌─────────────────┐  ──►  1. RICE Scoring (Kuantifikasi Objektif)       │
│   │  RICE Scoring   │                                                     │
│   └────────┬────────┘                                                     │
│            ▼                                                              │
│   ┌─────────────────┐  ──►  2. MoSCoW Method (Urgensi & Guardrails)       │
│   │  MoSCoW Method  │                                                     │
│   └────────┬────────┘                                                     │
│            ▼                                                              │
│   ┌─────────────────┐  ──►  3. Value-Effort Matrix (Kuadran Eksekusi)     │
│   │  Value-Effort   │                                                     │
│   └────────┬────────┘                                                     │
│            ▼                                                              │
│   ( Final Priority )                                                      │
└───────────────────────────────────────────────────────────────────────────┘
```
> 🎤 **Talk Track Slide 2 (45 Detik)**:  
> *"Mengapa AIPRO berbeda? Kebanyakan tool prioritisasi hanya memakai satu rumus kaku. AIPRO **menggabungkan 3 metode sekaligus dalam satu pipeline**:  
> Pertama, **RICE Scoring** untuk menghitung skor efisiensi matematis secara objektif.  
> Kedua, **MoSCoW Method** yang tidak sekadar mengelompokkan angka, tetapi menerapkan **Deterministic Guardrails**—seperti eskalasi otomatis ke 'Must Have' jika terdeteksi risiko hukum ROPA/DPIA dan pasal regulasi OJK.  
> Ketiga, **Value-Effort Matrix** untuk memetakan eksekusi ke dalam kuadran strategis seperti Quick Wins atau Big Bets."*

---

```
                                  SLIDE 3
┌───────────────────────────────────────────────────────────────────────────┐
│               ARSITEKTUR MULTI-AGEN: OTAK DI BALIK AIPRO                  │
│                                                                           │
│    myService Input                                 ┌──────────────────┐   │
│   (Backlog Payload)                                │ Product Context  │   │
│           │                                        │ DB (Vector DB)   │   │
│           ▼                                        ├──────────────────┤   │
│   ┌───────────────┐     Vector Search Pipeline     │ Scrum Team DB    │   │
│   │ Orchestrator  │ ─────────────────────────────► ├──────────────────┤   │
│   │ Agent (⚡)    │                                │ Compliance DB    │   │
│   └───────┬───────┘                                │ (Aturan OJK/PBI) │   │
│           │                                        └──────────────────┘   │
│           ├──────────────────────────┬──────────────────────────┐         │
│           ▼                          ▼                          ▼         │
│   ┌───────────────┐          ┌───────────────┐          ┌───────────────┐ │
│   │ Market Agent  │          │ Value Agent   │          │ Feasibility   │ │
│   │ (◎)           │          │ (↗)           │          │ Agent (◇)     │ │
│   └───────┬───────┘          └───────┬───────┘          └───────┬───────┘ │
│           │                          │                          │         │
│           └──────────────────────────┼──────────────────────────┘         │
│                                      ▼                                    │
│                         ┌──────────────────────────┐                      │
│                         │ Central Decision Engine  │                      │
│                         │ (❖ RICE, MoSCoW, Matrix) │                      │
│                         └──────────────────────────┘                      │
└───────────────────────────────────────────────────────────────────────────┘
```
> 🎤 **Talk Track Slide 3 (60 Detik)**:  
> *"Di balik layar, AIPRO bekerja menggunakan **Arsitektur Multi-Agen Paralel** yang terintegrasi dengan **Vector DB**.  
> Saat backlog masuk dari myService, **Orchestrator Agent** melakukan *fan-out* ke 3 AI Agent spesialis:  
> 1. **Market Agent** mengevaluasi tren pasar dan keterlambatan dibanding kompetitor (seperti Jenius atau blu).  
> 2. **Value Agent** terhubung dengan **Product Context DB** untuk menghitung *Reach* (TAM) dan *Impact*.  
> 3. **Feasibility Agent** mengevaluasi data dari **Scrum Team DB** (kapasitas dev) serta melakukan **Vector Search ke Compliance DB** yang berisi aturan-aturan kepatuhan OJK, Surat Edaran PBI, dan UU PDP.  
> Hasil analisis dari ketiga agent disintesis oleh **Central Decision Engine** secara transparan."*

---

## 🎯 Rahasia Dapur Teknis (Senjata Menjawab Pertanyaan Juri)

---

### 1️⃣ Bagaimana AI Agent & Compliance DB (Vector DB) Menghitung Parameter RICE?

Rumus RICE di AIPRO:
$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \left(\frac{\text{Confidence}}{100}\right)}{\text{Effort}}$$

#### A. **CONFIDENCE & EVALUASI COMPLIANCE DB (50% – 100%)**
* **Peran Compliance DB (Vector DB)**:
  - **Compliance DB** menyimpan *embeddings* berisi pasal & aturan regulasi perbankan: **PBI, Regulasi OJK (misal: Keamanan Siber & Layanan Perbankan Digital), dan UU Protection Data Pribadi (UU PDP)**.
  - **Cara Kerja Feasibility Agent via Vector Search (RAG)**:
    1. Feasibility Agent mengambil deskripsi backlog & fitur teknis dari myService, lalu melakukan **Semantic Similarity Search** ke Compliance DB.
    2. AI mencocokkan apakah fitur tersebut menyentuh pasal regulasi ketat (misal: *Akses Data Pribadi*, *Autentikasi Biometrik*, *Koneksi API Pihak Ketiga*).
    3. Jika fitur menyentuh aturan regulasi, AI mengecek kelengkapan mitigasinya: **Apakah `blueprintUrl` valid DAN dokumen `ropaDpiaLink` sudah diisi?**
    4. **Hasil Penilaian Confidence**:
       - *Kondisi Ideal*: Lolos pencocokan Compliance DB + Dokumen ROPA/DPIA & Blueprint lengkap $\rightarrow$ **Confidence = 90% – 100%** (*Risiko Rendah*).
       - *Kondisi Isu Compliance*: Menyentuh aturan regulasi OJK/PDP tetapi dokumen ROPA/DPIA atau Blueprint belum diisi $\rightarrow$ **Confidence diturunkan ke 50%** (*Risiko Ketidakpastian & Kepatuhan Tinggi*).

#### B. **REACH (Skor 1 – 10: Skala Relatif Berbasis TAM)**
* **Jika PO mengisi Form Manual (`targetCakupanAdopsi`)**:
  - `>50% TAM` $\rightarrow$ **Skor 10** (*Massive Reach* / *Enterprise Wide*)
  - `20-50% TAM` $\rightarrow$ **Skor 5** (*High Reach* / *Departmental*)
  - `5-20% TAM` $\rightarrow$ **Skor 2** (*Segmented Reach*)
  - `<5% TAM` $\rightarrow$ **Skor 1** (*Niche Reach*)
* **Jika Kosong (Auto AI Inference oleh Value Agent)**:
  - AI membaca `userType` (`external` vs `internal`) & `product` (`myBCA Mobile`, `KlikBCA`, dll) dari **Product Context DB**.
  - **External Nasabah**: Diproyeksikan menjangkau total populasi nasabah aktif produk (Default: **10**, atau **5** untuk segmen menengah).
  - **Internal Karyawan**: Diproyeksikan berdasarkan populasi staf/unit target (Default: **5** - *Departmental Reach*).

#### C. **IMPACT (Pengali Dampak Bisnis: 0.5x, 1.5x, 2.0x, 3.0x)**
* **Jika PO mengisi Form Manual (`skalaDampakBisnis`)**:
  - `Massive` = **3.0x** | `High` = **2.0x** | `Medium` = **1.0x** | `Low` = **0.5x**
* **Jika Kosong (NLP / Semantic Analysis oleh Value Agent)**:
  - AI memindai narasi pada `customerValue`, `description`, dan `businessObjective`.
  - Terdeteksi indikator finansial/retensi kunci (*"CASA"*, *"outflow"*, *"retensi"*, *"revenue"*, *"fee-based"*) $\rightarrow$ **3.0x** (*Massive Impact*).
  - Terdeteksi benefit digital engagement standar $\rightarrow$ **1.5x** (*Medium Impact*).

#### D. **EFFORT (Beban Kerja: Story Points 4, 8, 13)**
* Dibaca dari field `valuegraphEffort` myService dan dicocokkan dengan **Scrum Team DB**:
  - `Low` Effort $\rightarrow$ **4** Story Points
  - `Medium` Effort $\rightarrow$ **8** Story Points
  - `High` Effort $\rightarrow$ **13** Story Points

---

### 2️⃣ Bagaimana Penilaian & Kategori MoSCoW Diperoleh?

Penilaian MoSCoW menggabungkan **RICE Thresholds + Deterministic Guardrails**:

#### A. Threshold RICE Dasar:
- $\text{RICE} > 1.20 \rightarrow$ **Must Have**
- $0.81 \le \text{RICE} \le 1.20 \rightarrow$ **Should Have**
- $0.41 \le \text{RICE} \le 0.80 \rightarrow$ **Could Have**
- $\text{RICE} \le 0.40 \rightarrow$ **Won't Have**

#### B. Deterministic Guardrails (Override Prioritas Otomatis):
1. **Legal & Compliance Guardrail (Integrasi Compliance DB)**:
   - *Kondisi*: Vector search Compliance DB mengidentifikasi fitur menyentuh aturan data pribadi (UU PDP / OJK), tetapi field `ropaDpiaLink` di myService kosong.
   - *Aksi AI*: Otomatis dinaikkan ke **MUST HAVE** tanpa peduli skor RICE mentah.
   - *Rasional*: Kepatuhan regulasi perlindungan data pribadi bersifat *mandatory/non-negotiable*.
2. **Market Urgency & Opportunity Loss Guardrail**:
   - *Kondisi*: Terdapat gap keterlambatan kompetitor besar (misal fitur Pocket tertinggal 6-9 tahun dari Jenius/blu) **DAN** `fleksibilitasPeluncuran = Strict`.
   - *Aksi AI*: Otomatis dinaikkan ke **MUST HAVE**.

---

### 3️⃣ Penilaian Value-Effort Matrix

#### Aturan Pemetaan Kuadran:
- **Tingkat Value**: `High` jika Impact $\ge 2.0x$, sebaliknya `Low`.
- **Tingkat Effort**: `High` jika Story Points $\ge 10$, `Medium` jika $6 - 9$, `Low` jika $< 6$.

| Kuadran | Kombinasi Value & Effort | Status Strategis & Warna | Rekomendasi Eksekusi |
| :--- | :--- | :--- | :--- |
| **Quick Win** | High Value + Low/Medium Effort | 🟩 *Success / Green* | **Eksekusi Segera**: Dampak besar dengan effort efisien. |
| **Big Bet** | High Value + High Effort | 🟦 *BCA Primary / Blue* | **Investasi Strategis**: Proyek skala besar butuh alokasi resource. |
| **Fill-in** | Low Value + Low/Medium Effort | ⬜ *Gray* | **Pengisi Waktu**: Dikerjakan jika ada sisa kapasitas squad. |
| **Money Pit** | Low Value + High Effort | 🟥 *Danger / Red* | **Hindari / Defer**: Effort besar namun dampak bisnis minim. |

---

## 🛡️ Defensive Q&A Cheat Sheet (Pertanyaan Sulit Juri & Jawaban Tepat)

### ❓ Q1: "Bagaimana cara Compliance DB (Vector DB) menilai kepatuhan terhadap regulasi OJK & PBI?"
> **Jawaban Teknis**:  
> *"Compliance DB kami menggunakan **Vector Store / Retrieval-Augmented Generation (RAG)** yang menyimpan indeks *embeddings* aturan regulasi OJK, Surat Edaran PBI, dan UU PDP.  
> Feasibility Agent membandingkan deskripsi fitur backlog dengan Compliance DB secara semantik. Jika fitur terdeteksi wajib memenuhi regulasi tertentu (misal: otentikasi data sensitif), AI memeriksa keberadaan dokumen mitigasi (ROPA/DPIA & Blueprint). Jika tidak lengkap, skor **Confidence otomatis diturunkan ke 50%** dan memicu **Compliance Guardrail** untuk eskalasi prioritas."*

### ❓ Q2: "Mengapa menggunakan Arsitektur Multi-Agen ketimbang 1 Prompt besar ke ChatGPT?"
> **Jawaban Teknis**:  
> *"Menggunakan 1 prompt besar (Monolithic Prompt) rentan terhadap **halusinasi AI, bias konteks, dan latency tinggi**.  
> Dengan **Multi-Agen (Separation of Concerns)**:  
> 1. Setiap agent menjadi **spesialis** pada domainnya (Market, Value, Feasibility).  
> 2. Eksekusi berjalan secara **paralel (Fan-out/Fan-in)** sehingga menghemat waktu komputasi hingga 60%.  
> 3. Auditability: Kami bisa mentracing agent mana yang memberikan temuan tertentu di *thinking log* secara transparan."*

### ❓ Q3: "Bagaimana cara Anda menjamin AI tidak memberikan hasil yang berubah-ubah (fluktuatif) untuk data yang sama?"
> **Jawaban Teknis**:  
> *"Kami menerapkan pendekatan **Hybrid: AI Analysis + Deterministic Guardrails**.  
> Ekstraksi narasi menggunakan NLP semantik, tetapi kalkulasi RICE, aturan MoSCoW, dan Guardrail Compliance dijalankan oleh **Engine Rules berbasis kode terstruktur (Deterministic Code)** dengan parameter suhu (temperature) AI yang diatur ke 0. Ini menjamin hasil scoring bersifat *reproducible* dan konsisten."*

### ❓ Q4: "Bagaimana AIPRO membedakan perhitungan untuk Produk Eksternal (Nasabah) vs Produk Internal (Karyawan)?"
> **Jawaban Teknis**:  
> *"Pada parameter **Reach**, kami menerapkan **Segmen TAM Proporsional**:  
> - Untuk **Produk Eksternal**, TAM diukur dari populasi nasabah aktif (misal 10 Juta nasabah myBCA).  
> - Untuk **Produk Internal**, TAM disesuaikan ke populasi staf/unit kerja target. Jangkauan >50% staf berarti *Enterprise-Wide Impact* (Skor 10), sedangkan jangkauan 20-50% staf adalah *Departmental Reach* (Skor 5). Sehingga perbandingan antar backlog tetap *apples-to-apples*."*

---

## 🎬 Tips Sukses Demo Mockup Aplikasi (Slide 4)

1. **Buka halaman Detail Backlog (misal: *Pocket Rupiah*)**:
   - Tunjukkan bagian **3 AI Agents Running Parallel**.
   - Sorot *Thinking Log* dari **Orchestrator Agent** saat menghubungkan ke `Compliance Vector DB (Aturan OJK, PBI, & UU PDP)`.
   - Sorot *Thinking Log* dari **Feasibility Agent** saat mendeteksi `Vector Search Compliance DB` & kelengkapan dokumen *ROPA/DPIA*.
2. **Sorot Kartu Rekomendasi Akhir**:
   - Tunjukkan skor RICE (misal: `1.69`), Kategori MoSCoW (`Must Have`), dan Kuadran Matriks (`Big Bet / Quick Win`).
   - Tunjukkan bagian **Reasoning Summary** sebagai bukti transparansi AI.

---
*Created for AIPRO Jury Pitch Presentation — Confidential Internal Use.*
