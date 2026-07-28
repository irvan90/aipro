# 📐 Panduan Kalkulasi RICE Score, MoSCoW Categorization, & Value-Effort Matrix (AIPRO)

Dokumen ini menjelaskan secara menyeluruh tentang metode penilaian (*scoring*), kalkulasi matematis, aturan kategorisasi, serta *guardrails* yang digunakan oleh **AIPRO Multi-Agent Engine** dalam mengevaluasi backlog produk.

---

## 1. 🧮 RICE Score Calculation

### 1.1. Rumus Utama
RICE Score dihitung menggunakan formula standar:

$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

> **Catatan Penting:** RICE Score adalah **indeks rasio relatif** tanpa batas maksimum. Skor ini bukan nilai persentase atau ujian berbasis 1–10. Semakin tinggi nilainya, semakin tinggi urgensi dan prioritas backlog tersebut.

---

### 1.2. Komponen & Skala Parameter

| Parameter | Definisi | Skala & Nilai di AIPRO |
| :--- | :--- | :--- |
| **Reach (R)** | Proyeksi jangkauan pengguna / Total Addressable Market (TAM) | • **10** (*Massive Reach* / >50% TAM / Enterprise Wide)<br>• **5** (*High Reach* / 20-50% TAM / Departmental)<br>• **2** (*Segmented Reach* / 5-20% TAM)<br>• **1** (*Niche Reach* / <5% TAM) |
| **Impact (I)** | Multiplier dampak langsung terhadap OKR bisnis (Revenue/CASA) | • **3.0x** (*Massive Impact* — berdampak langsung pada CASA/Revenue)<br>• **2.0x** (*High Impact*)<br>• **1.5x** (*Medium Impact* — engagement standar)<br>• **0.5x** (*Low Impact*) |
| **Confidence (C)** | Tingkat kepastian & validasi teknis/regulasi (Persentase) | • **90%** (`0.90`) — Blueprint valid, compliance OJK/PBI/UU PDP terpenuhi.<br>• **80%** (`0.80`) — Standard validity.<br>• **50%** (`0.50`) — Terdeteksi risiko teknis / dokumen ROPA-DPIA belum lengkap.<br>*(Bisa disesuaikan manual 1–100%)* |
| **Effort (E)** | Estimasi beban usaha tim dalam *Story Points* | • Nilai riil *story points* (contoh: `1`, `4`, `6`, `7`, `8`, `10`, `11`, `12`, `13`, `20` pts).<br>• Default pemetaan Valuegraph: **Low = 4 pts**, **Medium = 8 pts**, **High = 13 pts**.<br>*(Minimal 1 pt, tidak boleh 0).* |

---

### 1.3. Batas Maksimum Nilai RICE

* **Secara Konsep RICE Standar**: Tidak ada batas atas (bisa mencapai puluhan, ratusan, atau ribuan tergantung angka *Reach* dan *Effort*).
* **Di Dalam Sistem AIPRO**:
  * Nilai **RICE Maksimal Teoritis**: $\frac{10 \times 3.0 \times 1.0}{1} = \mathbf{30.0}$
  * Nilai **RICE Maksimal Preset** (Low Effort 4 pts): $\frac{10 \times 3.0 \times 1.0}{4} = \mathbf{7.5}$

---

## 2. 🚦 MoSCoW Categorization & Guardrails

Central Decision Engine mengklasifikasikan backlog ke dalam 4 kategori **MoSCoW** berdasarkan gabungan nilai RICE Total dan *Guardrails* deterministik:

### 2.1. Ambang Batas RICE Total

```
RICE Total > 1.2   ──►  MUST HAVE   (Prioritas Tertinggi / Promote)
RICE Total 0.8–1.2 ──►  SHOULD HAVE (Penting / Kuartal Ini)
RICE Total 0.4–0.8 ──►  COULD HAVE  (Nice-to-have / Keep)
RICE Total < 0.4   ──►  WON'T HAVE  (Tunda / Defer)
```

---

### 2.2. Guardrails Khusus (Override Deterministik)

Meskipun RICE Score awal rendah/sedang, AI memiliki **Guardrails** otomatis untuk menaikkan kategori ke **MUST HAVE**:

1. **Compliance & Legal Guardrail**:
   * *Kondisi:* `personalDataAccess = true` (mengakses data pribadi), tetapi `ropaDpiaLink` kosong.
   * *Tindakan:* Otomatis dinaikkan ke **MUST HAVE** demi mencegah pelanggaran regulasi UU PDP & OJK.

2. **Competitor Gap & Market Opportunity Guardrail**:
   * *Kondisi:* Terdeteksi gap fitur kritis terhadap kompetitor utama (contoh: *Pocket Rupiah* di mana kompetitor seperti Jenius/blu sudah meluncurkan 6–9 tahun lalu) dan `launchFlexibility = Strict`.
   * *Tindakan:* Otomatis dinaikkan ke **MUST HAVE** untuk mencegah risiko *customer churn*.

---

## 3. 🗺️ Value-Effort Matrix Mapping

Setiap backlog dipetakan ke dalam salah satu dari 4 kuadran **Value-Effort Matrix**:

```
                 HIGH VALUE
                      │
     ┌────────────────┼────────────────┐
     │                │                │
     │   QUICK WIN    │    BIG BET     │
     │  (High Value,  │  (High Value,  │
     │   Low Effort)  │   High Effort) │
     │                │                │
LOW ─┼────────────────┼────────────────┼─ HIGH
EFFORT│                │                │  EFFORT
     │    FILL-IN     │   MONEY PIT    │
     │  (Low Value,   │  (Low Value,   │
     │   Low Effort)  │   High Effort) │
     │                │                │
     └────────────────┼────────────────┘
                      │
                  LOW VALUE
```

### Rekomendasi Tindakan per Kuadran:
* 🟢 **Quick Win** *(High Value, Low Effort)*: **Prioritas Utama** — Langsung masukkan ke sprint mendatang karena memberikan *impact* besar dengan effort minim.
* 🔵 **Big Bet** *(High Value, High Effort)*: **Perencanaan Matang** — Bernilai strategis tinggi, tetapi membutuhkan alokasi *resource* dan sprint yang signifikan.
* 🟡 **Fill-in** *(Low Value, Low Effort)*: **Pengisi Kapasitas** — Dikerjakan saat tim memiliki kapasitas sisa/idle.
* 🔴 **Money Pit** *(Low Value, High Effort)*: **Evaluasi / Defer** — Tidak disarankan untuk dieksekusi karena menyedot *resource* besar dengan hasil yang minim (contoh: *Dark Mode* di 40+ layar).

---

## 4. ⏱️ Mode Presentasi (Presentation Auto-Pause 60 Menit)

Saat tombol **"Jalankan Analisis AI"** ditekan pada halaman detail backlog:

1. **Multi-Agent Simulation**: Agent Orchestrator, Market, Value, Feasibility, dan Decision Engine mengeksekusi analisis secara paralel dan menampilkan log secara *real-time*.
2. **Auto-Pause 60 Menit**: Setelah seluruh log agent selesai ditampilkan, sistem akan **bertahan selama 60 menit** pada layar log analisis (`Analisis Selesai · Mode Presentasi`).
3. **Fleksibilitas Presenter**: Halaman tidak akan berpindah secara otomatis, sehingga presenter dapat menjelaskan hasil temuan setiap agent kepada audiens dengan fleksibel.
4. **Tombol "Lihat Hasil Analisis &rarr;"**: Kapan pun presenter siap, cukup mengeklik tombol ini (atau klik di mana saja pada kotak analisis) untuk berpindah ke tampilan **Rekomendasi Final (Hero Card)**.

---

*Dokumen ini dibuat otomatis oleh AIPRO System — Update Terakhir: Juli 2026.*
