# AIPRO — Interaction & Clickable Spec

## Mockup Interaksi per Halaman

-----

## PRINSIP INTERAKSI

```
Untuk demo ke juri:
→ Setiap klik harus terasa meaningful
→ AI harus terlihat "berpikir" — bukan instan
→ Transisi antar halaman harus smooth
→ Data harus terasa nyata, bukan placeholder
```

-----

## AI PROGRESS STATES (GLOBAL)

Ini yang membuat mockup terasa real. Gunakan di semua fitur AI.

### State 1 — Trigger (0 detik)

```
User klik [Analyze with AI →]

Tombol berubah:
[Analyzing...] ← disabled, spinner kecil di kiri
Warna: #3174b8 (lebih muted dari normal)
```

### State 2 — AI Thinking (0.5–2 detik)

```
Panel kanan muncul dengan loading state:

┌─────────────────────────────────────┐
│ 🤖 AIPRO AI                       │
│ ─────────────────────────────────── │
│ ⠋ Reading backlog context...        │
│                                     │
│ ░░░░░░░░░░░░░░░░░░░░  0%           │
└─────────────────────────────────────┘

Bar animasi mengisi dari kiri ke kanan
Teks berubah setiap 0.8 detik:
→ "Reading backlog context..."
→ "Analyzing historical Jira data..."
→ "Calculating RICE dimensions..."
→ "Classifying MoSCoW category..."
→ "Generating reasoning..."
→ "Finalizing score..."
```

### State 3 — Dimension Reveal (2–3 detik)

```
Score muncul satu per satu, bukan sekaligus:

RICE Score: [menghitung... 12.000... 13.500... 15.000] ✓
              ← animasi count-up

Reach      [bar mengisi pelan] → High ✓
Impact     [bar mengisi pelan] → Massive ✓  
Confidence [bar mengisi pelan] → 80% ✓
Effort     [bar mengisi pelan] → Medium ✓

Jeda 200ms antar dimensi
```

### State 4 — Complete (3 detik)

```
"✅ Analysis Complete — Scored in 3.2s"
Semua elemen muncul dengan fade-in

Konfeti kecil atau subtle success animation
(opsional — jangan terlalu berlebihan)
```

### State 5 — Error / Low Confidence

```
Jika completeness < 50%:

┌─────────────────────────────────────┐
│ ⚠️ Insufficient Data               │
│ ─────────────────────────────────── │
│ AI memerlukan lebih banyak          │
│ informasi untuk scoring yang akurat │
│                                     │
│ Missing:                            │
│ • Supporting evidence               │
│ • Target user segment               │
│ • Risk assessment                   │
│                                     │
│ [Complete Details →]                │
└─────────────────────────────────────┘
```

-----

## DEFINISI “READY FOR SUBMISSION”

Backlog dianggap **READY** jika memenuhi SEMUA kriteria berikut (Opsi A — implicit review):

```
✅ AI scored — RICE + MoSCoW sudah digenerate
✅ Assigned to quarter — targetQuarter bukan "Unplanned"
✅ Completeness score ≥ 75%
✅ Tidak ada unresolved dependency conflict

Jika salah satu belum terpenuhi → NOT READY
Tidak ada aksi review eksplisit dari PO yang diperlukan.
Review terjadi secara natural saat PO finalisasi submission.
```

Status yang valid di platform:

```
draft      → belum di-score AI
ai_scored  → sudah di-score, belum tentu ready
ready      → memenuhi semua 4 kriteria di atas
not_ready  → ada 1+ kriteria belum terpenuhi
submitted  → sudah masuk roadmap final & disubmit ke PMO
archived   → pernah disubmit tapi tidak direalisasikan
```

-----

## HALAMAN 1 — DASHBOARD

### Elemen yang Bisa Diklik

#### Sidebar Navigation

```
[Dashboard]        → Active (current page, no action)
[Backlog]          → Navigate to Backlog List page
[Roadmap]          → Navigate to Roadmap page
[Impact Analysis]  → Navigate to Impact Analysis page
[PRD Draft]        → Navigate to PRD Draft list
[Team & Members]   → Navigate to Team page
[Product Context]  → Navigate to Product Context page
[Audit Trail]      → Navigate to Audit Trail page
[PMO Submission]   → Navigate to Submission page

Product Switcher dropdown:
→ Click: dropdown membuka daftar produk
→ Pilih produk lain: seluruh dashboard refresh dengan data produk baru
```

#### Topbar

```
[🔔 Bell icon]     → Slide-in notification panel dari kanan
                     Tampilkan 5 notifikasi terbaru

[+ Input Backlog]  → Navigate to Backlog Input page (halaman 2)
```

#### Submission Banner

```
[Review Now →]     → Navigate to PMO Submission page (halaman 5)

Progress ring      → Tooltip: "8 of 12 backlogs ready for submission"
```

#### Stat Cards

```
Card "Total Active Backlog (24)"
→ Click: Navigate to Backlog List, filter: All

Card "AI Scored (8 of 24)"
→ Click: Navigate to Backlog List, filter: Status = AI Scored

Card "PRD Drafted (5)"
→ Click: Navigate to PRD Draft list

Card "Needs Attention (3)"
→ Click: Navigate to Backlog List, filter: Has conflicts/warnings
```

#### Top Backlog List

```
[View all →]       → Navigate to Backlog List page

Row klik (tiap backlog item):
→ Click row: Expand inline detail panel di bawah row
→ Double click: Navigate to Backlog Detail page

[Impact] button    → Navigate to Impact Analysis, pre-select backlog ini
[PRD] button       → Navigate to PRD Draft, pre-select backlog ini

Rank badge hover   → Tooltip: "RICE Score: 15,000 — Ranked #1 of 24"
```

#### AI Insights Panel

```
[Lihat Impact Analysis →]
→ Navigate to Impact Analysis page

[Lengkapi Sekarang →]
→ Navigate to Backlog Detail, scroll to missing fields

[Review Roadmap →]
→ Navigate to Roadmap page

"3 alerts" badge hover
→ Tooltip: "3 active insights need your attention"
→ Click: scroll to first unresolved insight card
```

#### Shadow Roadmap Preview

```
[Lihat detail →]   → Navigate to Roadmap page

Q row click        → Navigate to Roadmap page, scroll to Q tersebut

Roadmap chip click → Navigate to Backlog Detail untuk item tersebut
```

#### Activity Feed

```
[Audit trail →]    → Navigate to Audit Trail page

Activity item click → Expand detail inline
                    → Show: full reasoning, before/after, timestamp

[View backlog] link → Navigate to Backlog Detail
[View scoring]     → Navigate to Backlog Detail, tab Scoring
```

#### Notification Panel (slide-in)

```
Setiap notifikasi item:
→ Click: Navigate ke halaman relevan

[Mark all read]    → Semua notif jadi read, dot hilang dari bell

[✕ Close]          → Panel slide out
```

-----

## HALAMAN 2 — BACKLOG INPUT + AI SCORING

### Elemen yang Bisa Diklik

#### Form Input (Kiri)

```
Step indicator:
[● Basic Info]     → Scroll to Basic Info section
[○ Evidence]       → Scroll to Evidence section
[○ Context]        → Scroll to Context section

Completeness bar:
→ Hover: tooltip per missing field
→ Click missing field tag: scroll & focus ke field tersebut

Impact Area chips (multi-select):
[Revenue] [CX] [Compliance] [Ops] [Retention] [Risk]
→ Click chip: toggle selected (filled color) / deselected
→ Min 1 required untuk scoring

Supporting Evidence chips:
[Analytics] [Complaint Data] [Survey] [Incident Report] [Business Request]
→ Click chip: toggle selected

Quarter selector:
[Q1] [Q2] [Q3] [Q4]
→ Click: select quarter, visual highlight

Emergency Flag toggle:
→ Toggle ON: yellow warning box muncul dengan animation slide-down
             "⚠️ Business emergency only. Requires PMO/CPO approval."
             Additional field muncul: "Emergency Reason (required)"
→ Toggle OFF: warning box slide-up dan hilang

Dependency field:
→ Click/focus: dropdown search muncul
→ Type: filter backlog yang ada
→ Click backlog item: tambah sebagai dependency chip
→ Click ✕ di chip: remove dependency

[Save Draft]       → Save tanpa scoring, toast: "Draft saved"
→ Tombol berubah jadi "Saved ✓" selama 2 detik

[Analyze with AI →] → TRIGGER AI PROGRESS STATES (lihat atas)
                    → Disabled jika completeness < 50%
                    → Hover jika disabled: tooltip "Complete required fields first"
```

#### AI Scoring Panel (Kanan)

Muncul setelah analisis selesai:

```
RICE Score number:
→ Hover: tooltip "RICE = (Reach × Impact × Confidence) / Effort"

Dimension bars:
→ Hover per bar: expanded tooltip dengan detail angka
  "Reach: High — Estimated 50,000 monthly active users
   based on QRIS transaction volume analytics"

[▼ Why this score?] toggle:
→ Click: expand reasoning section dengan animation
→ Content: bullet points per dimensi
→ Click lagi: collapse

MoSCoW badge:
→ Hover: tooltip definisi kategori

AI Confidence indicator:
→ Hover: "80% confidence based on: 3 supporting evidences,
          historical similar backlog, product context match"

[▼ Override AI Recommendation] toggle:
→ Click: expand override section
  - Priority dropdown: [High / Medium / Low / Critical]
  - Reason textarea (mandatory, min 20 chars)
  - Character counter: "0/20 minimum"
  - [Save Override] → disabled until reason filled
  - [Cancel] → collapse section tanpa save

[Save Override] (jika reason terisi):
→ Click: 
  1. Score card menampilkan badge "👤 Overridden"
  2. Original AI score tetap terlihat (strikethrough atau muted)
  3. Override reason muncul di bawah
  4. Toast: "Override saved to audit trail"

[Save to Shadow Roadmap]:
→ Click: 
  1. Button loading state: "Saving..."
  2. Success: "✅ Added to Shadow Roadmap — Q3"
  3. Button berubah: "View in Roadmap →"
  4. Navigation option muncul

[Generate PRD Draft →]:
→ Click: TRIGGER AI PROGRESS untuk PRD generation
  Loading states:
  → "Analyzing backlog context..."
  → "Reading Jira historical data..."
  → "Structuring PRD sections..."
  → "Generating acceptance criteria..."
  → "PRD Draft ready!"
  Kemudian navigate ke PRD Draft page
```

-----

## HALAMAN 3 — PRIORITY IMPACT ANALYSIS

### Elemen yang Bisa Diklik

```
← Back button        → Navigate back ke halaman sebelumnya

Backlog selector dropdown:
→ Click: dropdown dengan search
→ Pilih backlog: update nama di header

Quarter selector:
[Q1] [Q2] [Q3] [Q4]
→ Click: select target quarter untuk "what if"

[Run Analysis →]:
→ Click: TRIGGER AI PROGRESS khusus impact
  Loading states berbeda:
  → "Mapping dependency chain..."
  → "Analyzing roadmap consequences..."
  → "Checking dependency readiness..."
  → "Estimating KPI effects..."
  → "Generating recommendations..."
  
  Split view muncul dengan animation:
  - Left panel: fade in (current state)
  - Right panel: slide in dari kanan (what-if state)
  - Changed items: highlight dengan yellow pulse animation

Split View — Current State (Kiri):
→ Setiap backlog chip hover: tooltip dengan detail
→ Click chip: Navigate ke Backlog Detail

Split View — What-If State (Kanan):
→ ❌ item: tooltip "Moved to Q4"
→ ⚠️ item: tooltip "Affected by dependency change — click for detail"
→ Click ⚠️ item: scroll down ke Impact Detail card yang relevan

Impact Detail Cards (accordion):
[🔴 Roadmap Impact ▼]
→ Click header: expand/collapse dengan animation
→ Content: list item terdampak, klik item → navigate ke backlog tersebut

[🟡 Dependency Impact ▼]
→ Click header: expand/collapse
→ Content: dependency tree visual (simple, bukan kompleks)

[🔴 KPI Impact ▼]
→ Click header: expand/collapse
→ Content: KPI list, estimasi delay

AI Recommendation panel:
[Keep in Q3 — Recommended]:
→ Click: 
  1. Konfirmasi modal: "Keep QRIS Retry Flow in Q3?"
  2. [Yes, Keep] → toast "Priority maintained. Impact analysis saved to audit trail."
  3. Navigate back ke Roadmap

[Move to Q4 — Override]:
→ Click:
  1. Override modal muncul:
     "You're overriding AI recommendation"
     Reason field (mandatory)
     [Confirm Move] [Cancel]
  2. Confirm: toast "Moved to Q4. Override recorded."
  3. Roadmap di-update
  4. Notifikasi ke PO jika ada dependency yang terdampak
```

-----

## HALAMAN 4 — ROADMAP

### Elemen yang Bisa Diklik

```
Tab toggle:
[Shadow Roadmap]   → Switch ke shadow view (draft mode)
[Final Roadmap Q3] → Switch ke final view (locked mode)

Shadow Roadmap Mode:

Quarter column header (Q1, Q2, Q3, Q4):
→ Click: collapse/expand quarter lane

Backlog card dalam lane:
→ Hover: drag handle (⠿) muncul di kiri
→ Drag card ke lane lain:
  1. Ghost card muncul saat drag
  2. Target lane highlight dengan dashed border biru
  3. Drop: card pindah
  4. TRIGGER mini Impact Analysis otomatis:
     "⚡ Moving this to Q4 affects 2 items — View impact?"
     [View] [Dismiss]

→ Click card: expand detail inline
  Tampilkan: RICE, MoSCoW, reasoning summary, dependency

[⚡ Impact] button di card:
→ Navigate to Impact Analysis, pre-select backlog ini

[📄 PRD] button di card:
→ Navigate to PRD Draft untuk backlog ini

[+ Add Backlog] button (per quarter):
→ Navigate to Backlog Input page

Unplanned section:
→ Setiap card: sama dengan card di lane
→ [Assign to Q ▼] button: dropdown Q1-Q4
→ Pilih Q: card animasi pindah ke lane tersebut

[Finalize & Submit to PMO]:
→ Click: Navigate to PMO Submission page

Final Roadmap Mode:

Card (locked):
→ Hover: cursor berubah ke "not-allowed"
→ Tooltip: "Roadmap locked — submitted to PMO on 28 Mar 2025"
→ Click: expand detail (read-only)

[View Submission Details]:
→ Navigate to PMO Submission page, tab "Submitted"
```

-----

## HALAMAN 5 — PMO SUBMISSION

### Elemen yang Bisa Diklik

```
Readiness checklist items:
→ Click item ⚠️: Navigate ke masalah yang dimaksud
  Contoh: "2 backlogs completeness < 75%"
  → Navigate ke Backlog List, filter: completeness < 75%

Backlog confirmation table:

Row hover: highlight

[Remove] per row:
→ Click:
  1. Modal: "Remove QRIS Retry from Q3 submission?"
     "You'll need to replace it with another backlog (PMO rule: same count)"
  2. [Select Replacement] → Slide-in panel dari kanan
     Search & pilih dari Shadow Roadmap
  3. Replacement dipilih: baris lama di-replace dengan yang baru
  4. Toast: "Backlog swapped. Change recorded in audit trail."

[+ Add from Shadow Roadmap]:
→ Click: Side panel muncul
  → List backlog di Shadow Roadmap yang belum masuk Q ini
  → Click backlog: tambah ke tabel

[Export Preview PDF]:
→ Click: Loading state "Generating PDF..."
  → PDF preview muncul di modal (read-only)
  → [Download] [Close]

[Submit to PMO →]:
→ Click:
  1. Konfirmasi modal:
     "Submit Q3 2025 Roadmap to PMO?"
     "4 backlogs · Must Have: 2 · Should Have: 2"
     [Submit] [Cancel]
  2. Loading: "Submitting..."
  3. Success animation (checkmark besar)
  4. Status berubah: "✅ SUBMITTED TO PMO"
  5. Timestamp muncul: "Submitted: today, 14:30 by [nama PO]"
  6. Tombol hilang, diganti [View PMO Thread]

PMO Comment Thread:
[Reply...] input:
→ Click: focus ke textarea
→ Type: character count muncul
→ [Send]: 
  1. Message muncul di thread (right-aligned, PO style)
  2. Input clear
  3. Toast: "Reply sent"

Thread messages:
→ Hover: timestamp muncul (relative time → absolute time)
```

-----

## HALAMAN 6 — AUDIT TRAIL

### Elemen yang Bisa Diklik

```
Filter bar:

[All Types ▼]:
→ Click: dropdown
  ○ All Types
  ○ AI Scoring
  ○ Human Override
  ○ Dependency Warning
  ○ Submission
  ○ New Backlog
→ Pilih: list di-filter dengan animation

[Date Range ▼]:
→ Click: date picker muncul
  Preset options: Today / This Week / This Quarter / Custom
→ Pilih: list di-filter

[All Actors ▼]:
→ Click: dropdown list member tim
→ Pilih: filter by person

[Search...]:
→ Type: real-time filter (fuzzy search)
→ Matching text di-highlight dalam results

Timeline entries:

Entry card:
→ Click: expand detail panel
  Tampilkan:
  - Full context before/after
  - Prompt version (untuk AI actions)
  - Related backlog link
  - Full timestamp

[View backlog →] link:
→ Navigate ke Backlog Detail

[View scoring detail]:
→ Expand inline scoring card dengan semua dimensi

Date header (sticky):
→ Click: collapse semua entries untuk tanggal tersebut

[Export Audit Log]:
→ Click: modal pilihan format
  [Download CSV] [Download PDF]
  Loading → Download
```

-----

## HALAMAN 7 — TEAM & MEMBERS

### Elemen yang Bisa Diklik

```
[+ Add Member]:
→ Click: slide-in panel
  - Search by name (dari SSO/ADFS directory)
  - Select role: Dev / BA / QA / APO
  - Assign track (jika multi-track)
  - [Add] button

Member card/row:
→ Click: expand detail
  Tampilkan:
  - Role & track
  - "Also in other products" info
  - Backlog assigned Q ini (count only)

[Edit] per member:
→ Click: inline edit mode
  - Ubah role (jika authorized)
  - Ubah track assignment
  - [Save] [Cancel]

[Remove] per member:
→ Click: konfirmasi modal
  "Remove [nama] from this product?"
  [Remove] [Cancel]

Track management (multi-track produk):
[+ Add Track]:
→ Click: inline form
  - Track name input
  - [Create Track]

Track header:
→ Click: collapse/expand anggota track tersebut
```

-----

## HALAMAN 8 — PRODUCT CONTEXT

### Elemen yang Bisa Diklik

```
Semua field:
→ Click: masuk edit mode
→ [Save Changes]: save + toast
→ [Discard]: revert ke nilai sebelumnya

[Pull from Jira →]:
→ Click: TRIGGER AI PROGRESS
  Loading states:
  → "Connecting to Jira..."
  → "Reading sprint history..."
  → "Analyzing epic structure..."
  → "Extracting product context..."
  → "Context updated!"
  
  Fields yang ter-update highlight dengan warna kuning fade-in → normal

[View Jira History]:
→ Click: modal dengan timeline historis Jira
  List epics, sprints, delivered features
  (read-only, untuk referensi)
```

-----

## FLOW DEMO YANG DIREKOMENDASIKAN

Untuk presentasi 5–7 menit kepada juri:

### Skenario: “Dari Backlog Baru hingga Submission PMO”

```
START: Dashboard
  ↓ [klik] "+ Input Backlog"
  
HALAMAN 2: Backlog Input
  ↓ Isi form (nama, impact area, evidence)
  ↓ [klik] "Analyze with AI →"
  ↓ [TUNGGU] AI progress animation (3 detik)
  ↓ Score muncul satu per satu
  ↓ [klik] "▼ Why this score?" → reasoning muncul
  ↓ [klik] "Save to Shadow Roadmap"
  ↓ [klik] "⚡ Impact" atau navigate ke Impact Analysis

HALAMAN 3: Impact Analysis
  ↓ Pilih backlog, pilih "Move to Q4"
  ↓ [klik] "Run Analysis →"
  ↓ [TUNGGU] AI progress (3 detik)
  ↓ Split view muncul — tunjukkan perbedaan
  ↓ Expand impact cards satu per satu
  ↓ [klik] "Keep in Q3 — Recommended"

HALAMAN 4: Roadmap
  ↓ Tunjukkan Shadow Roadmap
  ↓ Drag satu card ke Q lain → mini impact alert
  ↓ Drag kembali
  ↓ [klik] "Finalize & Submit to PMO"

HALAMAN 5: PMO Submission
  ↓ Tunjukkan readiness checklist
  ↓ Tunjukkan backlog list
  ↓ [klik] "Submit to PMO →"
  ↓ Konfirmasi → success animation
  ↓ Tunjukkan status "✅ SUBMITTED"

OPTIONAL: Audit Trail
  ↓ [klik] "Audit Trail" di sidebar
  ↓ Tunjukkan semua aksi tercatat
  ↓ Klik entry untuk expand detail

END
```

-----

## ANIMASI & TIMING

```
Page transition        : fade (150ms)
Panel slide-in         : 250ms ease-out
Card expand            : 200ms
AI loading bar         : 800ms per step (ease-in-out)
Score count-up         : 1000ms (easing: ease-out)
Dimension bar fill     : 600ms per bar, 200ms delay antar bar
Toast notification     : slide-in 200ms, visible 3s, slide-out 200ms
Modal                  : fade + scale (200ms)
Drag ghost             : opacity 0.7, slight rotation 2deg
Drop success           : bounce (150ms)
Success checkmark      : draw animation (500ms)
Override badge         : fade-in (300ms)
Highlight fade         : yellow → transparent (1500ms)
```

-----

## TOAST NOTIFICATIONS (GLOBAL)

```
Success (green):
"✅ [action] — saved to audit trail"

Warning (orange):
"⚠️ [action] — review recommended"

Info (blue):
"ℹ️ [context info]"

Error (red):
"❌ [action] failed — [reason]"

Position: bottom-right corner
Duration: 3 detik
Stack: maksimal 3 toast sekaligus
```

-----

## MODAL PATTERNS

```
Konfirmasi aksi penting:
→ Overlay gelap semi-transparent
→ Card putih center
→ Icon relevant (⚠️ atau ✅)
→ Title + description
→ 2 buttons: [Primary Action] [Cancel]
→ Close dengan ESC atau click overlay

Override modal (khusus):
→ Lebih besar (ada textarea)
→ Tidak bisa di-dismiss tanpa isi reason
→ Character counter pada textarea
```

-----

*Dokumen ini untuk keperluan spesifikasi interaksi mockup AIPRO.*
*Setiap halaman dirancang untuk demo 5–7 menit kepada juri.*
*AI progress animation adalah elemen kunci yang membuat demo terasa real.*

-----

## HALAMAN 9 — BACKLOG LIST

### Tujuan

Menampilkan semua backlog aktif dalam satu produk, bisa difilter, diurutkan, dan diakses detailnya.

### Layout

```
Topbar: "Backlog — myBCA Mobile" + [+ Input Backlog] button
  ↓
Filter & Search bar
  ↓
Backlog table/list (scrollable)
  ↓
Pagination atau infinite scroll
```

### Filter & Search Bar

```
[🔍 Search...] (fuzzy search — PostgreSQL + Fuse.js)
→ Type: real-time filter, highlight matching text
→ Clear ✕: reset search

[Status ▼]:
○ All Status
○ Draft (belum di-score)
○ AI Scored (sudah di-score)
○ Ready (memenuhi semua kriteria submission)
○ Not Ready (ada kriteria belum terpenuhi)
○ Submitted
○ Archived
→ Pilih: filter list

[MoSCoW ▼]:
○ All
○ Must Have
○ Should Have
○ Could Have
○ Won't Have
→ Pilih: filter list

[Quarter ▼]:
○ All Quarters
○ Q1 / Q2 / Q3 / Q4
○ Unplanned
→ Pilih: filter list

[Impact Area ▼]:
○ All
○ Revenue / CX / Compliance / Ops / Retention / Risk
→ Pilih: filter list

[Sort: RICE Score ▼]:
○ RICE Score (High → Low)
○ RICE Score (Low → High)
○ Date Added (Newest)
○ Date Added (Oldest)
○ Completeness Score
→ Pilih: re-sort list

[Clear All Filters] button (muncul jika ada filter aktif):
→ Click: reset semua filter, toast "Filters cleared"
```

### Backlog List Rows

```
Kolom: # | Title | MoSCoW | Impact | RICE | Status | Quarter | Actions

Setiap row:
→ Click row: Navigate ke Backlog Detail (halaman 10)
→ Hover row: background #F8FAFC + action buttons muncul

Action buttons (muncul saat hover):
[⚡ Impact]  → Navigate ke Impact Analysis, pre-select backlog ini
[📄 PRD]    → Navigate ke PRD Draft, pre-select backlog ini
[✏️ Edit]   → Navigate ke Backlog Input dalam edit mode
[⋮ More]    → Dropdown:
               - "Move to Archive" → konfirmasi modal
               - "Duplicate" → buat copy draft
               - "View Audit Trail" → Audit Trail filtered by backlog ini

Rank column:
→ Hover: tooltip "Ranked #1 by RICE Score among 24 active backlogs"

Status badge:
→ Hover: tooltip detail status + last updated

RICE score:
→ Hover: tooltip breakdown RICE dimensions

MoSCoW badge:
→ Hover: tooltip definisi + AI reasoning singkat

Quarter chip:
→ Click: Navigate ke Roadmap, scroll ke quarter tersebut

Emergency badge 🚨 (jika ada):
→ Hover: tooltip "Business emergency — pending PMO/CPO approval"
```

### Empty States

```
Jika tidak ada backlog sama sekali:
📋 "No backlogs yet"
"Start by adding your first backlog item"
[+ Input Backlog]

Jika filter tidak menghasilkan hasil:
🔍 "No backlogs match your filters"
"Try adjusting or clearing your filters"
[Clear All Filters]
```

### Navigation dari Halaman Ini

```
[+ Input Backlog]  → Backlog Input (halaman 2)
Row click          → Backlog Detail (halaman 10)
[⚡ Impact]        → Impact Analysis (halaman 3)
[📄 PRD]           → PRD Draft (halaman 11)
[✏️ Edit]          → Backlog Input dalam edit mode
Sidebar navigation → Halaman lain sesuai menu
← Back (topbar)    → Dashboard
```

-----

## HALAMAN 10 — BACKLOG DETAIL

### Tujuan

Halaman penuh detail satu backlog — scoring, reasoning, history, dependency, dan semua aksi yang tersedia.

### Layout

```
Topbar: breadcrumb "Backlog / QRIS Retry Flow" + action buttons
  ↓
Header card (title, status, MoSCoW, RICE)
  ↓
Tab navigation:
[Overview] [AI Scoring] [Impact Analysis] [PRD Draft] [Audit Trail]
  ↓
Tab content (berganti sesuai tab aktif)
```

### Topbar Actions

```
[✏️ Edit Backlog]  → Masuk edit mode (field jadi editable)
[⚡ Impact]        → Switch ke tab Impact Analysis
[📄 PRD Draft]     → Switch ke tab PRD Draft
[⋮ More]:
  - "Move to Archive" → konfirmasi modal
  - "Duplicate" → buat copy draft
  - "Re-analyze with AI" → trigger AI scoring ulang
  - "Share link" → copy URL to clipboard

← Back breadcrumb:
→ Click "Backlog": Navigate ke Backlog List
→ Click "QRIS Retry Flow": Stay (current page, no action)
```

### Header Card

```
Title: "QRIS Retry Flow" (editable jika edit mode)
Status badge: "AI Scored" (colored)
MoSCoW badge: "Must Have"
RICE Score: "15,000" (large, bold)

Quarter chip: "Q3 2025"
→ Click: dropdown pilih quarter (move to different Q)
→ Konfirmasi: mini impact check

Emergency flag (jika aktif): 🚨 banner merah
→ "Pending PMO/CPO Approval"
→ [View Approval Status]

Completeness bar: ████████░░ 80%
→ Hover: tooltip missing fields
```

### Tab: Overview

```
Semua field backlog dalam tampilan read-only:
- Description
- Business Objective
- Target Users
- Impact Area chips
- Supporting Evidence chips
- Estimated Business Impact
- Risk if Not Implemented
- Dependency list (linkable ke backlog lain)
- Strategic Initiative Tag
- Target Quarter

[Edit Backlog] button di bawah:
→ Semua field jadi editable inline
→ [Save Changes] [Discard Changes] muncul di topbar

Dependency items:
→ Click dependency chip: Navigate ke Backlog Detail dependency tersebut
→ Dependency dengan ⚠️: tooltip "Conflict detected — view impact"
```

### Tab: AI Scoring

```
RICE Score card (sama dengan panel di Backlog Input)
4 dimension bars dengan reasoning

[▼ Full Reasoning]:
→ Click: expand full AI reasoning per dimensi
→ Setiap dimensi: quote dari supporting evidence

AI Confidence: indicator + penjelasan

Scoring history (jika pernah di-score ulang):
Timeline kecil:
"v2 — today, 14:30 — RICE: 15,000"
"v1 — 3 days ago — RICE: 12,800"
→ Click versi lama: tampilkan score lama dalam modal (read-only)

Override section:
Jika belum di-override:
[Override AI Recommendation] button
→ Click: expand form override

Jika sudah di-override:
Badge "👤 Overridden by Budi Santoso"
"Medium → High — Strategic initiative Q4"
[View Override Details] → expand
[Revert to AI Recommendation] → konfirmasi modal
```

### Tab: Impact Analysis

```
Mini version dari halaman Impact Analysis (halaman 3)

What-If selector:
"Move to [Q4 ▼]"
[Run Analysis] → AI progress → hasil

Hasil: tampilan compact dari split view & impact cards

[View Full Impact Analysis →]:
→ Navigate ke halaman 3, pre-select backlog ini
```

### Tab: PRD Draft

```
Jika PRD belum di-generate:
🤖 "No PRD draft yet"
[Generate PRD Draft →]
→ Click: AI progress → PRD muncul

Jika PRD sudah ada:
Split editor (compact):
AI draft kiri | Editable kanan
(sama dengan halaman PRD Draft tapi embedded)

[Open Full PRD Editor →]:
→ Navigate ke halaman PRD Draft
```

### Tab: Audit Trail

```
Activity timeline filtered untuk backlog ini saja

Sama dengan halaman Audit Trail (halaman 6)
tapi pre-filtered by backlog ini

[View in Audit Trail →]:
→ Navigate ke Audit Trail, filter by backlog ini
```

### Navigation dari Halaman Ini

```
← Breadcrumb "Backlog"  → Backlog List
[⚡ Impact] / tab       → Impact Analysis (halaman 3)
[📄 PRD Draft] / tab    → PRD Draft (halaman 11)
Dependency chip click   → Backlog Detail lain
[View in Audit Trail]   → Audit Trail (halaman 6)
Sidebar navigation      → Halaman lain sesuai menu
```

-----

## HALAMAN 11 — PRD DRAFT

### Tujuan

Editor PRD berbasis AI — AI generate draft, PO review dan edit per section.

### Layout

```
Topbar: "PRD Draft — QRIS Retry Flow" + action buttons
  ↓
Status bar (draft / reviewed / finalized)
  ↓
Split editor:
  Left (40%): AI Draft (read-only reference)
  Right (60%): Editable version
  ↓
Section navigator (sidebar kiri dalam editor)
```

### Topbar Actions

```
[← Back]            → Backlog Detail (tab PRD) atau Backlog List
[Generate New Draft] → konfirmasi modal (override draft lama?)
                       → AI progress → draft baru
[Export PDF]        → loading → download PDF
[Export to Word]    → loading → download DOCX
[Mark as Final]     → konfirmasi modal
                       → status berubah "Finalized"
                       → timestamp + nama PO
```

### Status Bar

```
Draft status chips:
[AI Generated] → [In Review] → [Finalized]

Current status di-highlight (#0d5cab)

Timestamp: "Generated: today, 14:30"
           "Last edited: 5 min ago by Budi Santoso"
```

### Section Navigator (sidebar kiri)

```
List section PRD:
● Problem Statement
● Business Objective
● User Stories
● Scope & Features
● Acceptance Criteria
● Non-Functional Requirements
● Dependencies
● Open Questions

→ Click section: scroll & highlight section tersebut
→ Section dengan ⚠️: ada conflict atau kosong
→ Check ✓ per section: tandai section sudah di-review
```

### Split Editor

**Panel Kiri — AI Draft (reference)**

```
Read-only, tidak bisa diedit

Setiap section:
- Header section (bold)
- Content dari AI
- Sumber referensi kecil: "Based on: Jira history · Supporting evidence"

Hover text di AI draft:
→ Tooltip: "Click [Accept] to copy this to editor"

[Accept Section] button per section:
→ Click: copy AI content ke panel kanan (section yang sama)
→ Animasi: text flows dari kiri ke kanan
```

**Panel Kanan — Editable**

```
Rich text editor per section:
- Bold, italic, bullet list
- Inline comment (highlight text → [+ Comment])

Setiap section header:
[✓ Mark Reviewed] checkbox
→ Check: section header berubah warna (green left border)

Comment button (muncul saat text di-highlight):
→ Click: note input muncul di margin kanan
→ Type personal note → [Save Note]
→ Muncul sebagai sticky note (hanya visible ke PO)
→ [Mark Done ✓]: note resolved, strikethrough + muted
→ [Delete]: hapus note

Auto-save:
→ Setiap 30 detik atau setelah stop typing 2 detik
→ "Saved ✓" indicator di topbar
→ Jika error: "⚠️ Save failed — retry?"
```

### Accept All / Accept Section

```
Di atas split editor:
[Accept All AI Suggestions] button:
→ Click: konfirmasi modal
  "Copy all AI draft content to editor?"
  "This will replace any existing edits."
  [Accept All] [Cancel]
→ Semua section ter-copy dengan animasi
```

### Open Questions Section (khusus)

```
AI generate daftar pertanyaan yang perlu dijawab PO:
"1. What is the fallback if retry fails 3 times?"
"2. Is there a notification needed for each retry?"

Setiap question:
[Mark Resolved] toggle
[Add Answer] → inline textarea
→ Save: question ter-strikethrough, answer muncul di bawah

[+ Add Question] button:
→ Inline form: ketik question → [Add]
```

### Navigation dari Halaman Ini

```
← Back (topbar)     → Backlog Detail (tab PRD) atau Backlog List
[Export PDF/Word]   → Download file
[Mark as Final]     → Status update, stay di halaman
Sidebar navigation  → Halaman lain sesuai menu
```

-----

## KOMPONEN — NOTIFICATION PANEL

### Trigger

```
Click bell icon 🔔 di topbar:
→ Panel slide-in dari kanan (width: 360px)
→ Overlay gelap semi-transparent di belakang panel
→ Click overlay atau ✕: panel slide-out
```

### Layout Panel

```
Header: "Notifications" + [Mark all read] + [✕]
  ↓
Filter tabs: [All] [Unread] [AI] [Action Required]
  ↓
Notification list (scrollable)
  ↓
Footer: [View all in Audit Trail →]
```

### Tipe Notifikasi & Interaksi

```
🤖 AI Scoring Complete
"QRIS Retry Flow scored — RICE: 15,000"
Timestamp: "2 minutes ago"
→ Click: Navigate ke Backlog Detail, tab AI Scoring
→ [View Score] button inline

⏰ Submission Deadline
"Q3 submission due in 18 days — 4 backlogs pending"
Timestamp: "Today"
→ Click: Navigate ke PMO Submission
→ [Review Now] button inline
Background: #FEF3C7 (warning yellow)

💬 PMO Comment
"PMO commented on your Q3 submission"
"Please coordinate Biometrik with Security team"
Timestamp: "1 hour ago"
→ Click: Navigate ke PMO Submission, scroll ke thread
→ [Reply] button inline

⚠️ Dependency Conflict
"Conflict detected: Biometrik ↔ Identity Service v2"
Timestamp: "3 hours ago"
→ Click: Navigate ke Impact Analysis, pre-select backlog
→ [View Impact] button inline
Background: #FEE2E2 (danger red, subtle)

🚨 Emergency Approval
"Emergency flag requires PMO/CPO approval"
"OTP Compliance Update — submitted by Sari (APO)"
Timestamp: "Yesterday"
→ Click: Navigate ke Backlog Detail
→ [Approve] [Reject] buttons inline (jika user adalah PMO/CPO)

✅ Submission Confirmed
"Q2 2025 roadmap submission acknowledged by PMO"
Timestamp: "2 days ago"
→ Click: Navigate ke PMO Submission
```

### Interaksi per Item

```
Hover item:
→ Background berubah #F8FAFC
→ [Mark read] button muncul di kanan (✓)

Click item:
→ Navigate ke halaman relevan
→ Item otomatis marked as read
→ Panel slide-out

[Mark read] button:
→ Click: item opacity turun (muted), unread dot hilang
→ Bell counter berkurang

[Mark all read]:
→ Semua items muted
→ Bell dot hilang
→ Toast: "All notifications marked as read"

Filter tabs:
[All]              → Semua notifikasi
[Unread]           → Hanya yang belum dibaca
[AI]               → Filter hanya notif dari AI
[Action Required]  → Yang butuh aksi (deadline, approval, conflict)
→ Click tab: list di-filter dengan animation

[View all in Audit Trail →]:
→ Navigate ke Audit Trail
→ Panel slide-out
```

-----

## DEAD ENDS — RESOLUSI LENGKAP

### Setelah Submit PMO (halaman 5)

```
Setelah submit sukses:
1. Success animation (3 detik)
2. Status: "✅ SUBMITTED TO PMO — Today, 14:30"
3. Muncul options:

[Go to Dashboard]   → Dashboard
[View Roadmap]      → Roadmap (Final mode)
[Submit Another Q]  → Reset form untuk Q lain (jarang dipakai)

Halaman tetap terbuka dengan PMO thread aktif
→ PO bisa langsung lihat & reply comment PMO
```

### Back Button — Semua Halaman

```
Dashboard           → tidak ada back (home page)
Backlog List        → Dashboard
Backlog Input (baru)→ Backlog List
Backlog Input (edit)→ Backlog Detail
Backlog Detail      → Backlog List
Impact Analysis     → halaman sebelumnya (bisa dari mana saja)
Roadmap             → Dashboard
PRD Draft           → Backlog Detail (tab PRD)
PMO Submission      → Dashboard
Audit Trail         → Dashboard
Team & Members      → Dashboard
Product Context     → Dashboard
Notification Panel  → tidak navigasi, panel close saja
```

### Semua Entry Points ke Backlog Detail

```
Dari Dashboard:
→ Activity feed item click → Backlog Detail

Dari Backlog List:
→ Row click → Backlog Detail

Dari Roadmap:
→ Card expand → inline detail
→ Double click card → Backlog Detail

Dari Impact Analysis:
→ Affected backlog click → Backlog Detail

Dari Audit Trail:
→ [View backlog] link → Backlog Detail

Dari Notification Panel:
→ Notif click → Backlog Detail (jika relevan)
```

-----

## NAVIGATION MAP LENGKAP

```
                    ┌─────────────────────────────────────────────────────┐
                    │                    SIDEBAR                          │
                    │  (tersedia di semua halaman kecuali modal)          │
                    └─────────────────────────────────────────────────────┘
                                            │
        ┌──────────────────┬───────────────┼───────────────┬──────────────────┐
        ▼                  ▼               ▼               ▼                  ▼
   [Dashboard]      [Backlog]       [Roadmap]      [Impact]          [PMO Submit]
        │                │               │               │                  │
        │           [Backlog List]        │               │                  │
        │                │               │               │                  │
        │           [Backlog Detail]──────┼───────────────┘                  │
        │                │               │                                   │
        │           [Backlog Input]  [PRD Draft]                             │
        │                │                                                   │
        └────────────────┴───────────────────────────────────────────────────┘
                                          │
              ┌───────────┬───────────────┼───────────────────┐
              ▼           ▼               ▼                   ▼
        [Audit Trail] [Team &       [Product            [Notification
                       Members]      Context]             Panel]
```

-----

## CHECKLIST KONEKTIVITAS FINAL

```
✅ Dashboard → semua halaman utama (via sidebar + card clicks)
✅ Backlog List → Backlog Detail, Backlog Input, Impact Analysis, PRD Draft
✅ Backlog Input → Backlog Detail (setelah save), Backlog List (back)
✅ Backlog Detail → semua tab internal, Impact Analysis, PRD Draft, Audit Trail
✅ Impact Analysis → Roadmap, Backlog Detail, Dashboard
✅ Roadmap → PMO Submission, Backlog Detail, Impact Analysis
✅ PMO Submission → Dashboard, Roadmap (setelah submit)
✅ PRD Draft → Backlog Detail (back), Download
✅ Audit Trail → Backlog Detail (via links)
✅ Team & Members → Dashboard (back)
✅ Product Context → Dashboard (back)
✅ Notification Panel → semua halaman relevan (via notif click)
✅ Back button → semua halaman punya destinasi back yang jelas
✅ Semua dead ends sudah di-resolve
```

*Dokumen interaction spec AIPRO — updated dengan halaman lengkap dan resolusi dead ends.*

-----

## LEVEL 2 ADDITIONS — Full Prototype Spec

-----

## DRAG & DROP — ROADMAP

### Rules

```
Shadow Roadmap:
→ Drag bebas antar quarter (Q1-Q4)
→ Drag ke "Unplanned" pool
→ Drag dari "Unplanned" ke quarter manapun
→ Reorder dalam quarter yang sama

Final Roadmap (sebelum submit):
→ Drag antar quarter BISA
   tapi trigger warning dulu
→ Tidak bisa drag ke Unplanned
   (sudah ada komitmen ke PMO)
→ Reorder dalam quarter: BISA bebas
```

-----

### Drag States

**State 1 — Idle (Default)**

```
Card normal
Drag handle (⠿) hanya muncul saat hover
Cursor: default
```

**State 2 — Pickup (Saat mulai drag)**

```
Card terangkat:
→ scale(1.02)
→ shadow membesar
→ opacity: 0.95
→ Cursor: grabbing

Lane lain highlight:
→ Background: #e7eff7 (blue accent)
→ Border: 2px dashed #0d5cab
→ Label: "Drop here"

Quarter yang tidak valid:
→ Background: #fee4e2 (danger bg)
→ Label: "Not allowed"
   (hanya di Final Roadmap untuk Unplanned)
```

**State 3 — Hovering Over Target Lane**

```
Target lane:
→ Background: #dbeafe (lebih gelap)
→ Border: 2px solid #0d5cab
→ Animated pulse subtle

Card ghost:
→ Muncul di target lane (opacity 0.4)
→ Menunjukkan preview posisi jika di-drop
```

**State 4 — Drop (Same Quarter)**

```
Tidak ada impact analysis
Card langsung pindah posisi
Animasi: spring bounce 200ms
Toast: "Reordered in Q3"
Audit trail: dicatat
```

**State 5 — Drop (Different Quarter)**

```
Card kembali ke posisi semula dulu
Mini Impact Analysis panel muncul:

┌─────────────────────────────────────────┐
│ ⚡ Moving to Q4 — Impact Check         │
│ ─────────────────────────────────────── │
│ QRIS Retry Flow → Q3 to Q4            │
│                                         │
│ Detected:                               │
│ 🔴 2 backlog depend on this item       │
│ 🟡 Q3 deadline at risk                 │
│ 📅 Estimated delay: 2 sprints          │
│                                         │
│ [Cancel — Keep in Q3] [Confirm Move →] │
└─────────────────────────────────────────┘

Cancel → card kembali ke posisi semula
         dengan animation spring
Confirm → card pindah ke Q4
          toast: "Moved to Q4 — recorded in audit trail"
          audit trail: catat siapa, dari mana, ke mana
```

**State 6 — Drop (Final Roadmap)**

```
Muncul warning lebih kuat:

┌─────────────────────────────────────────┐
│ ⚠️ Modifying Submitted Roadmap         │
│ ─────────────────────────────────────── │
│ This roadmap has been submitted to PMO. │
│ Moving items will require re-submission.│
│                                         │
│ [Cancel] [Move & Re-submit to PMO]     │
└─────────────────────────────────────────┘

Confirm → card pindah
          status roadmap kembali ke DRAFT
          banner muncul: "Roadmap modified —
          re-submission to PMO required"
          notifikasi ke PMO
```

**State 7 — Drop (Unplanned Pool)**

```
Shadow Roadmap:
→ Card masuk Unplanned pool
→ Quarter assignment dihapus
→ Toast: "Moved to Unplanned"

Final Roadmap:
→ Tidak bisa → target invalid
→ Card kembali ke posisi semula
→ Toast: "Cannot remove from 
   submitted roadmap"
```

-----

## AI LOADING STATES

Digunakan di: Backlog Input, Impact Analysis, PRD Draft, Product Context

### Frame Set per Fitur yang Ada AI

Setiap fitur AI butuh 4 frame terpisah di Figma:

-----

### AI Scoring (Backlog Input)

**Frame A — Pre-Analysis**

```
Panel kanan: kosong / placeholder
Button: [Analyze with AI →] — enabled
Completeness bar: terisi
```

**Frame B — Loading**

```
Panel kanan muncul dengan skeleton:

┌─────────────────────────────────────┐
│ 🤖 AIPRO AI                      │
│ ─────────────────────────────────── │
│ ◌ Reading backlog context...        │
│                                     │
│ [████░░░░░░░░░░░░░░░] 25%          │
│                                     │
│ ░░░░░░░░░░  ← skeleton RICE        │
│ ░░░░░░  ░░░░░  ← skeleton bars    │
└─────────────────────────────────────┘

Button: [Analyzing...] — disabled, spinner
Loading text rotates:
→ "Reading backlog context..."
→ "Analyzing Jira history..."
→ "Calculating RICE dimensions..."
→ "Classifying MoSCoW..."
→ "Generating reasoning..."
```

**Frame C — Revealing**

```
RICE Score muncul dengan count-up:
"15,000" (bold, large)

Bars muncul satu per satu:
Reach      [████████░░] High
Impact     [░░░░░░░░░░] (loading...)
Confidence [░░░░░░░░░░] (loading...)
Effort     [░░░░░░░░░░] (loading...)
```

**Frame D — Complete**

```
Semua elemen muncul:
RICE: 15,000 ✓
MoSCoW: Must Have ✓
4 dimension bars terisi ✓
Reasoning toggle tersedia ✓
Action buttons enabled ✓

Subtle success indicator:
"✅ Analysis complete — 3.2s"
```

-----

### Impact Analysis Loading

**Frame A — Pre-Run**

```
What-if selector: terisi
Button: [Run Analysis →] — enabled
Split view: kosong / placeholder
```

**Frame B — Loading**

```
Button: [Analyzing impact...] — disabled

Loading sequence:
→ "Mapping dependency chain..."
→ "Analyzing roadmap consequences..."
→ "Calculating KPI effects..."
→ "Generating recommendations..."

Split view: skeleton shimmer
```

**Frame C — Revealed**

```
Split view muncul dengan animation
Impact cards accordion muncul satu per satu
AI Recommendation panel muncul terakhir
```

-----

### PRD Generation Loading

**Frame A — Pre-Generate**

```
Editor kanan: kosong
Button: [Generate PRD Draft →] — enabled
```

**Frame B — Loading**

```
Loading sequence:
→ "Analyzing backlog context..."
→ "Reading Jira history..."
→ "Structuring PRD sections..."
→ "Generating acceptance criteria..."

Editor kanan: skeleton per section
```

**Frame C — Complete**

```
Semua section muncul di AI draft (kiri)
Editor kanan: pre-filled dari AI
Section navigator: semua section listed
Toast: "PRD Draft generated — review and edit"
```

-----

## MODAL SCREENS

### Modal 1 — Konfirmasi Submit ke PMO

```
Trigger: klik [Submit to PMO →]

┌─────────────────────────────────────────┐
│              📤 Submit Q3               │
│                                         │
│  Submit Q3 2025 Roadmap to PMO?        │
│                                         │
│  4 backlogs                            │
│  Must Have: 2 · Should Have: 2         │
│                                         │
│  This action will lock your Q3         │
│  roadmap and notify PMO.               │
│                                         │
│  [Cancel]        [Submit to PMO →]     │
└─────────────────────────────────────────┘

Cancel → modal close, stay di halaman
Submit → loading state → success state
```

-----

### Modal 2 — Override AI Recommendation

```
Trigger: klik [Override AI Recommendation]

┌─────────────────────────────────────────┐
│         👤 Override Recommendation      │
│                                         │
│  AI Recommendation: Medium              │
│                                         │
│  Override to: [High ▼]                 │
│                                         │
│  Reason (required):                     │
│  ┌─────────────────────────────────┐   │
│  │ Strategic initiative Q4...      │   │
│  └─────────────────────────────────┘   │
│  Min. 20 characters · 0/20             │
│                                         │
│  [Cancel]         [Save Override]      │
│                   ← disabled until     │
│                     reason filled      │
└─────────────────────────────────────────┘
```

-----

### Modal 3 — Backlog Swap

```
Trigger: klik [Remove] di PMO Submission table

┌─────────────────────────────────────────┐
│         🔄 Replace Backlog              │
│                                         │
│  Removing: QRIS Retry Flow             │
│                                         │
│  PMO rule: total backlog count         │
│  must remain the same.                 │
│  Select a replacement:                 │
│                                         │
│  🔍 Search shadow roadmap...           │
│  ┌─────────────────────────────────┐   │
│  │ ○ Onboarding Digital  10,400   │   │
│  │ ○ Auto-login Feature   9,800   │   │
│  │ ○ Verifikasi Wajah     8,900   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel]      [Confirm Replacement]   │
└─────────────────────────────────────────┘
```

-----

### Modal 4 — Emergency Flag Warning

```
Trigger: toggle Emergency Flag ON

┌─────────────────────────────────────────┐
│         🚨 Business Emergency Flag      │
│                                         │
│  This flag is for business             │
│  emergencies only:                     │
│  · Regulatory deadline                 │
│  · Sudden strategic directive          │
│                                         │
│  NOT for bugs or incidents —           │
│  those are handled directly by IT.     │
│                                         │
│  Requires PMO or CPO approval          │
│  before priority is elevated.          │
│                                         │
│  Emergency Reason (required):          │
│  ┌─────────────────────────────────┐   │
│  │ [type reason here...]           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel]       [Enable Emergency]     │
└─────────────────────────────────────────┘
```

-----

### Modal 5 — Konfirmasi Re-Analysis

```
Trigger: klik [Re-analyze with AI]

┌─────────────────────────────────────────┐
│         🔄 Re-analyze Backlog           │
│                                         │
│  This will generate a new AI score     │
│  and may change the current result:    │
│                                         │
│  Current RICE: 15,000                  │
│  Current MoSCoW: Must Have             │
│                                         │
│  Previous scores will be preserved    │
│  in the audit trail.                   │
│                                         │
│  [Cancel]       [Re-analyze →]         │
└─────────────────────────────────────────┘
```

-----

### Modal 6 — Export PDF Preview

```
Trigger: klik [Export Preview PDF]

Full-screen overlay:
┌─────────────────────────────────────────┐
│ Q3 2025 Submission — Preview    [✕]    │
│ ─────────────────────────────────────── │
│                                         │
│ [PDF preview area — read only]         │
│                                         │
│ Header: AIPRO · myBCA Mobile         │
│ Q3 2025 Roadmap Submission             │
│ Submitted by: Budi Santoso (PO)        │
│                                         │
│ Backlog list table...                  │
│                                         │
│ ─────────────────────────────────────── │
│ [Close]              [Download PDF]    │
└─────────────────────────────────────────┘
```

-----

### Modal 7 — Product Switcher Dropdown

```
Trigger: klik product switcher di sidebar

Muncul sebagai dropdown dari switcher:
┌─────────────────────────────┐
│ Switch Product              │
│ ─────────────────────────── │
│ ✓ myBCA Mobile    (active) │
│ ○ BCA Mobile Bisnis        │
│ ○ Klik BCA                 │
│ ─────────────────────────── │
│ + Add Product              │
└─────────────────────────────┘

Pilih produk → seluruh page refresh
dengan data produk yang dipilih
```

-----

### Modal 8 — Konfirmasi Revert Override

```
Trigger: klik [Revert to AI Recommendation]

┌─────────────────────────────────────────┐
│       ↩ Revert to AI Recommendation    │
│                                         │
│  Current: High (manually overridden)   │
│  Revert to: Medium (AI recommended)    │
│                                         │
│  This action will be recorded          │
│  in the audit trail.                   │
│                                         │
│  [Cancel]        [Confirm Revert]      │
└─────────────────────────────────────────┘
```

-----

## EMPTY STATES

### Empty State 1 — Dashboard (Produk Baru)

```
Sidebar: normal
Topbar: normal
Content area:

        🧭
   Welcome to AIPRO
   
   Start by setting up your
   product context so AI can
   give you accurate insights.
   
   [Set Up Product Context →]
   
   Or add your first backlog:
   [+ Input First Backlog →]
```

-----

### Empty State 2 — Backlog List

```
        📋
   No backlogs yet
   
   Start adding backlog items
   to get AI-powered prioritization
   and scoring.
   
   [+ Input Backlog →]
```

-----

### Empty State 3 — Roadmap

```
        🗺️
   Shadow roadmap is empty
   
   Add backlogs and assign them
   to quarters to build your roadmap.
   
   [Go to Backlog →]
```

-----

### Empty State 4 — PRD Draft List

```
        📄
   No PRD drafts yet
   
   Select a scored backlog and
   let AI generate a PRD draft
   as your starting point.
   
   [Go to Backlog →]
```

-----

### Empty State 5 — Audit Trail

```
        🕐
   No activity yet
   
   Actions, AI decisions, and
   overrides will appear here.
```

-----

## SUCCESS STATES

### Success 1 — PMO Submission Complete

```
Replaces submit button area:

┌─────────────────────────────────────────┐
│         ✅ Successfully Submitted        │
│                                         │
│  Q3 2025 roadmap submitted to PMO      │
│  Today, 14:30 · Budi Santoso (PO)     │
│                                         │
│  PMO has been notified.                │
│  You'll receive a notification when   │
│  PMO adds comments.                    │
│                                         │
│  [Go to Dashboard]  [View Roadmap]    │
└─────────────────────────────────────────┘
```

-----

### Success 2 — AI Scoring Complete

```
Muncul di panel kanan Backlog Input:

Subtle top banner (green):
"✅ Analysis complete — scored in 3.2s
 Prompt version: v1.2.3"

Lalu panel scoring muncul normal
```

-----

### Success 3 — PRD Draft Generated

```
Toast (bottom right):
"✅ PRD Draft generated
 Review and edit in the editor →"

Editor split view muncul dengan content
```

-----

### Success 4 — Override Saved

```
Toast:
"✅ Override saved · Recorded in audit trail"

Card menampilkan badge:
"👤 Overridden · Medium → High"
```

-----

### Success 5 — Backlog Swap Complete

```
Toast:
"✅ Backlog replaced · Audit trail updated"

Table row berubah ke backlog pengganti
dengan subtle highlight animation
(yellow fade → normal)
```

-----

## ERROR / WARNING STATES

### Error 1 — AI Confidence Rendah

```
Muncul di panel scoring sebagai pengganti
score normal:

┌─────────────────────────────────────────┐
│ ⚠️ Low Confidence Score                 │
│ ─────────────────────────────────────── │
│ AI cannot produce a reliable score     │
│ with the current information.          │
│                                         │
│ Completeness: 45%                      │
│                                         │
│ Missing:                               │
│ · Supporting evidence                  │
│ · Target user segment                  │
│ · Risk assessment                      │
│                                         │
│ [Complete Details →]                   │
└─────────────────────────────────────────┘
```

-----

### Error 2 — Dependency Conflict Detected

```
Banner merah di atas Backlog Detail:

┌─────────────────────────────────────────┐
│ 🔴 Dependency Conflict Detected         │
│ This backlog conflicts with:           │
│ → Identity Service v2 (not ready Q3)  │
│ [View Impact Analysis →]               │
└─────────────────────────────────────────┘
```

-----

### Error 3 — Roadmap Final Modified

```
Banner orange di Roadmap setelah drag
di Final mode:

┌─────────────────────────────────────────┐
│ ⚠️ Roadmap Modified                     │
│ Your submitted Q3 roadmap has been     │
│ changed. Re-submission to PMO          │
│ is required.                           │
│ [Re-submit to PMO →]  [Undo Change]   │
└─────────────────────────────────────────┘
```

-----

### Warning 1 — Submission Deadline Approaching

```
Banner kuning di Dashboard (< 7 hari):

┌─────────────────────────────────────────┐
│ ⏰ Submission deadline in 3 days        │
│ 4 backlogs still not ready.            │
│ [Review Now →]                         │
└─────────────────────────────────────────┘
```

-----

### Warning 2 — Context Window Panjang

```
Muncul di top conversation saat thread
sudah sangat panjang (informational only,
tidak block action):

"ℹ️ This conversation is getting long.
 Starting a new chat may improve 
 AI response quality."
```

-----

## FRAME LIST LENGKAP untuk Claude Design

Total frame yang perlu dibuat:

```
MAIN SCREENS (11):
01. Dashboard
02. Backlog List
03. Backlog Input — Pre Analysis
04. Backlog Input — AI Loading
05. Backlog Input — AI Revealing
06. Backlog Input — AI Complete
07. Backlog Detail — Tab Overview
08. Backlog Detail — Tab AI Scoring
09. Backlog Detail — Tab Impact
10. Backlog Detail — Tab PRD Draft
11. Backlog Detail — Tab Audit Trail
12. Impact Analysis — Pre Run
13. Impact Analysis — Loading
14. Impact Analysis — Results
15. Roadmap — Shadow Mode
16. Roadmap — Final Mode
17. PRD Draft — Empty
18. PRD Draft — Loading
19. PRD Draft — Complete
20. PMO Submission — Draft
21. PMO Submission — Success
22. Audit Trail
23. Team & Members
24. Product Context

DRAG & DROP STATES (7):
25. Roadmap — Drag Pickup
26. Roadmap — Drag Hovering Same Q
27. Roadmap — Drag Hovering Diff Q
28. Roadmap — Drop Confirm Modal (Diff Q)
29. Roadmap — Drop Final Warning
30. Roadmap — Drop Success
31. Roadmap — Drop Cancelled

MODALS (8):
32. Modal — Submit PMO
33. Modal — Override AI
34. Modal — Backlog Swap
35. Modal — Emergency Flag
36. Modal — Re-analyze
37. Modal — Export PDF Preview
38. Modal — Product Switcher
39. Modal — Revert Override

EMPTY STATES (5):
40. Empty — Dashboard
41. Empty — Backlog List
42. Empty — Roadmap
43. Empty — PRD Draft
44. Empty — Audit Trail

SUCCESS STATES (5):
45. Success — PMO Submitted
46. Success — AI Scored
47. Success — PRD Generated
48. Success — Override Saved
49. Success — Backlog Swapped

ERROR & WARNING STATES (5):
50. Error — Low AI Confidence
51. Error — Dependency Conflict
52. Error — Roadmap Modified
53. Warning — Deadline Approaching
54. Warning — Long Conversation

NOTIFICATION PANEL (1):
55. Notification Panel — Open

TOTAL: 55 frames
```

-----

*Level 2 Full Prototype Spec — AIPRO*
*Includes drag & drop, all modals, empty/success/error states*
*Ready for Claude Design handoff*