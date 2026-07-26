# RICE : 
## Reach (Jangkauan Pengguna: Skor 1 - 10)
AI akan menilai Reachnya berdasarkan input dari myservice lalu mengkategorikan ke skor Reach sesuai dengan TAM
TAM = Total Addressable Market -> total jumlah maksimal populasi pengguna yang BISA dijangkau oleh suatu produk atau fitur.

- >50% TAM → Skor 10 (Massive Reach)
- 20-50% TAM → Skor 5 (High Reach)
- 5-20% TAM → Skor 2 (Segmented Reach)
- <5% TAM → Skor 1 (Niche Reach)

## Impact (Pengali Dampak Bisnis: 0.5x, 1.5x/1.0x, 2.0x, 3.0x)
AI akan mengkategorian dari deskripsi input di myservice ke 3 kategori ini
input myservice : customerValue, description, dan businessObjective
- Massive → Pengali 3.0x (Dampak sangat besar / game changer)
- High → Pengali 2.0x (Dampak tinggi)
- Medium → Pengali 1.0x (Dampak sedang)
- Low → Pengali 0.5x (Dampak kecil)

## Confidence (Tingkat Kepercayaan Teknis & Regulatory: 0% - 100%)
akan cek dari hasil feasibility agent terkait resiko
- Vector Search ke Compliance DB: Memindai deskripsi backlog terhadap indeks pasal regulasi OJK, PBI, dan UU Protection Data Pribadi (UU PDP).
- Audit Kepatuhan Perlindungan Data: Memeriksa field personalDataAccess. Jika fitur mengakses data pribadi nasabah, AI memverifikasi ketersediaan link ropaDpiaLink.
- Audit Kelayakan Arsitektur Teknis: Memeriksa keberadaan dan validitas blueprintUrl sistem.

## Effort (Estimasi Beban Kerja: Story Points 4, 8, 13)
Story Point adalah satuan ukuran untuk menilai seberapa "berat" dan "rumit" pekerjaan tim developer untuk membuat suatu fitur.

# MosCow
## Aturan 1: Deterministic Guardrails (Eskalasi Prioritas Otomatis / Override)
Sebelum melihat angka RICE, AI mengecek 2 kondisi krusial ini terlebih dahulu. Jika salah satu terpenuhi, prioritas otomatis di-escalate menjadi MUST HAVE:

🛑 Legal & Compliance Guardrail:

Kondisi: Backlog mengakses data pribadi nasabah (personalDataAccess = true), tetapi link dokumen ropaDpiaLink belum diisi.
Keputusan: Otomatis dinaikkan ke MUST HAVE.
Rasional: Kepatuhan perlindungan data pribadi (UU PDP & OJK) bersifat non-negotiable.
📈 Market Urgency & Opportunity Loss Guardrail:

Kondisi: Terdeteksi keterlambatan fitur dibanding kompetitor utama (seperti Jenius/blu) DAN deadline peluncuran ketat (Strict).
Keputusan: Otomatis dinaikkan ke MUST HAVE.
Rasional: Mencegah churn (perpindahan) nasabah akibat keterlambatan rilis.
## Aturan 2: Threshold Skor RICE (Jika Tidak Ada Guardrail)
Jika backlog lolos dari kedua Guardrail di atas, kategori MoSCoW ditentukan murni berdasarkan Skor RICE:

Ambang Skor RICE	Kategori MoSCoW	Interpretasi Bisnis
> 1.20	🔥 Must Have	Nilai bisnis & jangkauan tinggi dibanding beban kerjanya.
0.81 – 1.20	⚡ Should Have	Nilai bisnis bagus, prioritas gelombang kedua.
0.41 – 0.80	💡 Could Have	Nilai bisnis moderat, eksekusi jika ada sisa sprint.
≤
≤ 0.40	❄️ Won't Have	Efisiensi rendah / beban kerja jauh lebih besar dari dampaknya.


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
