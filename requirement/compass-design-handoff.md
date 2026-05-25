# COMPASS — Design Handoff Document

## For UI/UX Mockup Creation

-----

## 1. PLATFORM OVERVIEW

**Name:** COMPASS
**Full Name:** Cognitive Orchestration & Management for Product Agile Scoring System
**Tagline:** *“Navigate your product priorities with confidence.”*
**Type:** Enterprise Internal SaaS — AI-Assisted Product Planning & Prioritization Platform
**Owner:** PMO (Project Management Office) — Bank Central Asia (BCA)
**Primary User:** Product Owner (PO)

-----

## 2. DESIGN DIRECTION

### Style Reference

- **Linear.app** — clean layout, sidebar navigation, minimal
- **Notion AI** — inline AI insights, toggle sections
- **Jira Product Discovery** — enterprise feel, structured
- **Vercel Dashboard** — modern, data-forward
- **Productboard** — roadmap visualization

### Overall Feel

```
Enterprise Modern SaaS
→ Professional but not boring
→ Data-forward but not overwhelming
→ AI-powered but human-centered
→ Clean, structured, trustworthy
```

-----

## 3. COLOR SYSTEM

### Primary Colors (BCA Brand)

```
BCA Blue (Primary)  : #0d5cab  ← Main brand color, buttons, active states
BCA Navy (Dark)     : #083767  ← Sidebar, headers, dark surfaces
BCA Blue (Hover)    : #3174b8  ← Hover states, secondary actions
BCA Blue (Light)    : #4a85c0  ← Secondary elements, icons
BCA Accent          : #e7eff7  ← Light blue backgrounds, highlights, tags
```

### Semantic Colors

```
Success             : #10B981  ← Delivered, completed, healthy
Warning             : #F59E0B  ← Pending, needs attention
Danger              : #EF4444  ← Conflict, overload, critical
Gold Accent         : #F5A623  ← Badges, notifications, highlights
```

### Neutral Colors

```
Gray 50             : #F8FAFC  ← Page background
Gray 100            : #F1F5F9  ← Card backgrounds, dividers
Gray 200            : #E2E8F0  ← Borders, separators
Gray 400            : #94A3B8  ← Placeholder text, icons
Gray 500            : #64748B  ← Secondary text
Gray 700            : #334155  ← Body text
Gray 900            : #0F172A  ← Headings, primary text
White               : #FFFFFF  ← Cards, panels
```

### Color Usage Guide

```
Sidebar background      : #083767 (BCA Navy)
Sidebar active item     : #0d5cab (BCA Blue)
Sidebar text            : rgba(255,255,255,0.65)
Sidebar active text     : #FFFFFF

Primary button          : #0d5cab background, #FFFFFF text
Primary button hover    : #3174b8
Outline button          : transparent bg, #0d5cab border & text

Page background         : #F8FAFC
Card background         : #FFFFFF
Card border             : #E2E8F0

Heading text            : #0F172A
Body text               : #334155
Secondary text          : #64748B
Muted text              : #94A3B8

AI elements             : gradient #083767 → #0d5cab
AI accent background    : #e7eff7
Links                   : #0d5cab
```

-----

## 4. TYPOGRAPHY

### Font Family

```
Primary: [To be determined by designer]
Note: Use a clean, modern sans-serif
Suggestions: Inter, Roboto, or Plus Jakarta Sans
All available on Google Fonts
```

### Type Scale

```
Hero Title    : 32px, weight 800
Page Title    : 20px, weight 700
Card Title    : 15px, weight 700
Section Label : 13px, weight 600
Body          : 13px, weight 400
Small         : 11px, weight 400
Micro         : 10px, weight 500
```

-----

## 5. LAYOUT SYSTEM

### Page Structure

```
┌─────────────────────────────────────────┐
│ SIDEBAR (240px fixed)  │  MAIN CONTENT  │
│                        │                │
│ Logo                   │  TOPBAR (56px) │
│ Navigation             │  ─────────────│
│ Product Switcher       │               │
│ User Profile           │  PAGE CONTENT  │
│                        │  (padding 24px)│
└─────────────────────────────────────────┘
```

### Sidebar Structure

```
Top:
→ Logo: BCA icon (36px, white bg, #083767 text) 
        + "COMPASS" text (white, bold)
        + "Product Planning Platform" subtitle (muted)

Navigation Sections:
MAIN MENU:
→ Dashboard (active: #0d5cab background, white text)
→ Backlog (with badge for pending items)
→ Roadmap
→ Impact Analysis
→ PRD Draft

MANAGEMENT:
→ Team & Members
→ Product Context
→ Audit Trail
→ PMO Submission (with ! badge when deadline approaching)

Bottom:
→ Active Product Selector (dropdown, dark glass effect)
→ User Profile (avatar + name + role)
```

### Topbar Structure

```
Left:   Page title (bold, 15px) + subtitle (muted, 12px)
Middle: Status badges (Q Planning badge, Deadline countdown)
Right:  Notification bell (red dot) + Primary CTA button
Height: 56px, white background, bottom border #E2E8F0
```

-----

## 6. COMPONENT LIBRARY

### Cards

```
Border radius : 12px
Border        : 1px solid #E2E8F0
Background    : #FFFFFF
Shadow        : none (border only)
Top accent    : 3px colored top border bar
Padding       : 16px
```

### Buttons

```
Primary  : #0d5cab bg, white text, 8px radius
Hover    : #3174b8 bg
Outline  : transparent bg, #0d5cab border & text, 8px radius
Small    : 11px font, 6px 12px padding
Medium   : 12px font, 8px 14px padding
Large    : 13px font, 10px 20px padding
White    : white bg, #083767 text (used on dark surfaces)
```

### Tags / Badges

```
Must Have    : #DBEAFE background, #1D4ED8 text
Should Have  : #D1FAE5 background, #065F46 text
Could Have   : #FEF9C3 background, #713F12 text
Won't Have   : #F3F4F6 background, #6B7280 text

Revenue      : #EDE9FE background, #5B21B6 text
CX           : #FCE7F3 background, #9D174D text
Compliance   : #FEF3C7 background, #92400E text
Operational  : #ECFDF5 background, #047857 text

AI Badge     : gradient #083767→#0d5cab, white text, 9px font
Q Badge      : #e7eff7 background, #0d5cab text, bold
```

### Status Indicators

```
Draft          : Gray dot (#94A3B8)
AI Scored      : Blue dot (#0d5cab)
Final          : Green dot (#10B981)
Ready      : Blue dot (#0d5cab)
Not Ready  : Red dot (#f04438)
Emergency 🚨   : Red dot (#EF4444) + red left border on card
Overridden 👤  : shown as small badge below score
```

### AI Insight Panel Style

```
Background     : White card
Left border    : 3px solid #0d5cab
AI Badge       : gradient pill with insight type label (Impact Alert / Recommendation / Planning)
Alert Count    : "3 alerts" pill — #fee4e2 bg, #f04438 text, 20px border radius
                 Color changes: red if Impact Alert, orange if Recommendation only, gray if 0
Reasoning      : Expandable toggle (collapsed by default)
Action button  : Full width, outline or filled
Body text      : 11px, #64748B
```

-----

## 7. SCREENS TO DESIGN

Design these screens in order of priority:

-----

### SCREEN 1 — Dashboard Overview ⭐ HIGHEST PRIORITY

**Purpose:** First impression, overall product health at a glance

**Layout:**

```
Topbar (56px)
  ↓
Submission Banner (full width)
  ↓
4 Stat Cards (grid, equal width)
  ↓
Main 2-column Grid:
  Left (60%): Top Backlog List
  Right (40%): AI Insights Panel
  ↓
Bottom 2-column Grid:
  Left: Shadow Roadmap Preview
  Right: Activity Feed
```

**Submission Banner:**

```
Background    : gradient #083767 → #0d5cab (left to right)
Left icon     : 📤 in semi-transparent white rounded square
Content       : Title (bold white) + subtitle (muted white)
Right         : Circular progress ring (white stroke) + % text
Far right     : White CTA button "Review Now →"
Border radius : 12px
```

**4 Stat Cards:**

```
Each card: white bg, 12px radius, 1px border
Top accent bar: 3px, colors below

Card 1 (Blue accent #0d5cab):
  Label: "Total Active Backlog"
  Value: "24" (large, bold)
  Sub: "12 shadow · 12 pending review"

Card 2 (Green accent #10B981):
  Label: "AI Scored"
  Value: "8"
  Sub: "↑3 from last week" (green change indicator)

Card 3 (Purple accent #7c3aed):
  Label: "PRD Drafted"
  Value: "5"
  Sub: "of 8 AI scored backlogs"

Card 4 (Red accent #EF4444):
  Label: "Needs Attention"
  Value: "3"
  Sub: "Dependency conflicts detected"
```

> Stat cards summary:
> 
> - Card 1 (Blue #0d5cab): Total Active Backlog — 24 — “12 shadow · 12 pending”
> - Card 2 (Green #12b76a): AI Scored — 8 of 24 — “↑ 3 from last week”
> - Card 3 (Purple #7c3aed): PRD Drafted — 5 — “of 8 AI scored backlogs”
> - Card 4 (Red #f04438): Needs Attention — 3 — “Dependency conflicts detected”

**Top Backlog List:**

```
Header: "Top Backlog — AI Prioritized" + "Sorted by RICE Score" + "View all →"

Each row:
[Rank] [Title + Tags + Status] [RICE Score + mini bar]

Rank: navy (#083767) rounded square for top 3, gray for rest
Title: 600 weight, truncated
Tags: MoSCoW pill + Impact Area pill (small, colored)
Status dot: colored + label text (10px)
  - Ready     : Blue dot (#0d5cab) + "Ready"
  - Not Ready : Red dot (#f04438) + "Not Ready"
  - Draft     : Gray dot (#d0d5dd) + "Draft"
  - AI Scored : Blue dot (#0d5cab) + "AI Scored"
  (No "Needs Review" status)
RICE: bold #083767, right-aligned, 13px
Mini bar: 60px wide, 4px height, shows relative score
Mini bar tooltip: "Relative score vs highest RICE in this product"

Row hover: #F8FAFC background
Row separator: 1px #F1F5F9

Show 5 rows
```

**AI Insights Panel:**

```
Header: "🤖 AI Insights" + "3 alerts" badge (#fee4e2 bg, #f04438 text)

3 insight cards separated by dividers:

Each insight card:
- AI badge type (Impact Alert / Recommendation / Planning)
- Title (bold, 12px)
- Body text (11px, #64748B, 1.5 line height)
- Impact chips (colored pills: danger=red bg, warn=yellow bg, info=blue bg)
- Full-width action button

Padding: 14px 16px per card
```

**Shadow Roadmap Preview:**

```
Header: "Shadow Roadmap 2025" + "View detail →"

4 Q rows:
Q1: chips (Final style: #DBEAFE bg) + "✅ Final" status
Q2: chips (Final style) + "✅ Submitted" status
Q3: mix of Final + Draft chips + "⏳ Draft" status (orange)
Q4: Draft chips + "💭 Shadow" status (gray)

Chip style Final  : #DBEAFE bg, #1E40AF text, 4px radius
Chip style Draft  : #F1F5F9 bg, #64748B text, 4px radius

Divider below Q rows

Submission Readiness section (replaces Sprint Capacity — out of scope):
Title: "Q3 Submission Readiness" (bold, 11px)
Progress bar: shows X/total backlogs ready
Label: "8 of 12 backlogs ready for submission"
Progress % shown as "75% (8/12)" — not just "75%"
Bar color: #0d5cab (blue primary)

Ready criteria (Opsi A — implicit review):
A backlog is "Ready" when ALL of:
→ AI scored (RICE + MoSCoW complete)
→ Assigned to target quarter
→ Completeness score ≥ 75%
→ No unresolved dependency conflict

Not Ready breakdown shown below bar:
→ [backlog name] — [reason: completeness X% / dependency conflict / not scored / not assigned]
Each item clickable → navigate to fix the issue
```

**Activity Feed:**

```
Header: "Recent Activity" + "Audit trail →"

Each entry:
[Icon 28px] [Content]

Icon backgrounds:
🤖 AI: #e7eff7 (blue accent)
👤 Human: #D1FAE5 (green)
⚠️ Warning: #FEF3C7 (yellow)
📤 Submit: #EDE9FE (purple)
➕ New: #F1F5F9 (gray)

Content:
- Action text (11px, bold name + regular description)
- Italic reason text if override (muted, 10px)
- Timestamp (10px, #94A3B8)

5 entries visible
```

-----

### SCREEN 2 — Backlog Input + AI Scoring

**Purpose:** PO inputs backlog, AI scores and explains

**Layout:**

```
Left panel (60%): Input form
Right panel (40%): AI scoring result (appears after analysis)
Sticky topbar with: backlog title + [Save Draft] [Analyze with AI →]
```

**Left Panel — Input Form:**

```
Step indicator (top):
● Basic Info  ─── ○ Evidence ─── ○ Context
Active step: #0d5cab dot, completed: green checkmark

Completeness bar (below steps):
Label: "Completeness: 78%"
Bar: ████████░░ (color: red<50%, orange 50-80%, green>80%)
Missing fields listed below bar in red/orange text

Form fields (clean, labeled):
- Backlog Title* (large text input)
- Description* (textarea, 4 rows)
- Impact Area* (multi-select chips, click to select)
  Revenue | CX | Compliance | Ops | Retention | Risk
- Business Objective* (textarea)
- Target Users* (text input)
- Supporting Evidence (multi-select chips)
  Analytics | Complaint Data | Survey | Incident Report | Business Request
- Estimated Business Impact (text)
- Dependency (search input, multi-select from existing backlog)
- Risk if Not Implemented (textarea)
- Target Quarter (Q1 Q2 Q3 Q4 pill selector)
- Strategic Initiative Tag (dropdown)
- Emergency Flag (toggle switch)
  When ON: yellow warning box appears
  "Business emergency only. Requires PMO/CPO approval."

*Required fields marked with red asterisk
```

**Right Panel — AI Scoring Result:**

```
Appears after "Analyze with AI →" is clicked

Header section:
"🤖 AI Analysis Complete" (bold)
Timestamp: "Analyzed: today, 14:30"
Prompt version: "v1.2.3" (small, muted)

RICE Score (prominent):
Large number: "15,000" (#083767, 32px bold)
Below: "RICE Score · Must Have" (12px, muted)

4 dimension bars:
Reach      ████████░░ High      "50,000 users"
Impact     █████████░ Massive   "Revenue direct"
Confidence ████████░░ 80%       "Supported by analytics"
Effort     ████░░░░░░ Medium    "Infrastructure exists"

Bar color: #0d5cab fill, #E2E8F0 track

MoSCoW Badge:
Large pill: "MUST HAVE" (#DBEAFE bg, #1D4ED8 text, 14px bold)

AI Confidence:
"High Confidence · Evidence: Strong"
Small green indicator dot

Reasoning section (toggle):
▼ "Why this score?" (#0d5cab text, clickable)
  Expanded: bullet reasoning per dimension (11px, gray)

Override section (collapsed):
▼ "Override AI Recommendation" (muted text)
  Priority dropdown + mandatory reason textarea
  [Save Override] button

Action buttons:
[Save to Shadow Roadmap]  [Generate PRD Draft →]
```

-----

### SCREEN 3 — Priority Impact Analysis ⭐ FLAGSHIP

**Purpose:** Show consequences when backlog priority changes

**Layout:**

```
Topbar: "Impact Analysis — QRIS Retry Flow"
  ↓
What-If Simulator card (full width)
  ↓
Split view: Before | After (2 columns)
  ↓
Impact detail cards (expandable, full width)
  ↓
AI Recommendation panel
```

**What-If Simulator:**

```
Card with #e7eff7 background

"What happens if [dropdown: backlog name] 
 is moved to [dropdown: Q1 Q2 Q3 Q4]?"

[Run Analysis →] button (#0d5cab, prominent)
```

**Split View:**

```
2 equal columns with header labels:
"CURRENT STATE" | "IF MOVED TO Q4"

Each column shows roadmap quarter rows:
Q3 row:
  Left:  ✅ QRIS Retry (blue chip)
  Right: ❌ QRIS Retry (grayed out, strikethrough)

Q3 row:
  Left:  ✅ Biometrik (blue chip)
  Right: ⚠️ Biometrik (yellow chip, affected)

Q4 row:
  Left:  Onboarding (gray chip)
  Right: ✅ QRIS Retry ↓ (blue chip, moved here)
         Onboarding ↓ (gray chip, shifted down)

Visual diff: changed items highlighted with yellow bg
```

**Impact Detail Cards:**

```
Each card expandable, accordion style

🔴 Roadmap Impact
"2 features delayed"
Expanded: list of affected features + sprint delay estimate

🟡 Dependency Impact  
"Identity Service v2 chain affected"
Expanded: dependency tree visualization

🔴 KPI Impact
"Q3 revenue KPI at risk"
Expanded: which KPIs + estimated delay

AI Recommendation panel (blue left border):
🤖 "Keeping QRIS Retry in Q3 is recommended.
    If Q4 is necessary, consider moving Feature Y
    instead — 40% lower dependency risk."

2 buttons:
[Keep in Q3 — Recommended] (filled #0d5cab)
[Move to Q4 — Override]    (outline, red text)
```

-----

### SCREEN 4 — Shadow Roadmap & Final Roadmap

**Purpose:** Visual planning of backlog per quarter

**Layout:**

```
Tab toggle: [Shadow Roadmap] [Final Roadmap Q3]
  ↓
Quarter swimlanes
  ↓
Backlog cards in lanes
  ↓
Unplanned pool (bottom)
```

**Shadow Roadmap:**

```
Status badge: "DRAFT" (orange pill, top right)

Quarter columns (horizontal scroll if needed):
Q1 | Q2 | Q3 (highlighted: current) | Q4

Backlog card in lane:
┌──────────────────────┐
│ 🟢 QRIS Retry Flow   │  ← colored left border by RICE level
│ RICE: 15,000         │  ← bold, #083767
│ Must Have · Revenue  │  ← tags
│ [⚡ Impact] [📄 PRD] │  ← action buttons (small, outline)
└──────────────────────┘

Card left border colors:
High RICE  : #0d5cab
Medium RICE: #4a85c0
Low RICE   : #E2E8F0

Drag handle visible on hover (⠿ icon, muted)
"Drag to reorder or move quarters" tooltip

Unplanned section:
Gray dashed border area at bottom
Label: "Unplanned — 5 backlogs"
Cards shown horizontally
[Assign to Q ▼] button on each card
```

**Final Roadmap:**

```
Status badge: "SUBMITTED TO PMO ✅" (green) 
           or "DRAFT — Not yet submitted" (orange)

Submission info bar (if submitted):
"Submitted: 28 Mar 2025 · Budi Santoso (PO)"

Cards: locked (no drag)
Lock icon 🔒 on each card
Cards slightly muted (90% opacity)

[View Submission Details] button (outline)
```

-----

### SCREEN 5 — Quarterly Submission to PMO

**Purpose:** PO finalizes and submits Q roadmap to PMO

**Layout:**

```
Readiness checklist header
  ↓
Confirmed backlog table
  ↓
Submission summary card
  ↓
PMO comment thread (if post-submission)
```

**Readiness Checklist:**

```
"Q3 2025 Submission Readiness"

Checklist items:
✅ 8 backlogs prioritized
✅ All Must Have items scored  
⚠️ 2 backlogs completeness < 75%
✅ No unresolved dependency conflicts

Overall readiness bar:
████████░░ 85%
(color: red<60%, orange 60-80%, green>80%)
```

**Confirmed Backlog Table:**

```
Columns: # | Title | RICE | MoSCoW | Status | Action

Rows:
1 | QRIS Retry Flow    | 15,000 | Must Have | ✅ Ready | [Remove]
2 | Login Biometrik    | 13,200 | Must Have | ✅ Ready | [Remove]
3 | Notif Realtime     | 11,800 | Should    | ⚠️ Review | [Remove]
4 | Onboarding Digital | 10,400 | Should    | ✅ Ready | [Remove]

[+ Add from Shadow Roadmap] button (outline, below table)

Note: "Remove" triggers swap flow — replacement must be selected
```

**Submission Summary:**

```
Card with #e7eff7 background

Total backlog    : 4 items
Must Have        : 2 items
Should Have      : 2 items

[Export Preview PDF]  [Submit to PMO →] (primary button)
```

**Post-Submission PMO Thread:**

```
Thread header: "PMO Communication"

Message bubbles:
📤 Right-aligned (PO message):
   "Q3 2025 roadmap submitted."
   Timestamp + name

💬 Left-aligned (PMO reply):
   "Noted. Please coordinate Login Biometrik
    with Security team before sprint starts."
   Timestamp + PMO name

[Reply...] input + [Send] button at bottom
```

-----

### SCREEN 6 — Audit Trail

**Purpose:** Full governance record

**Layout:**

```
Filter bar (type / date range / actor)
  ↓
Chronological timeline entries
```

**Filter Bar:**

```
[All Types ▼] [Date Range ▼] [All Actors ▼] [Search...]
```

**Timeline:**

```
Date header: "Today, May 24 2025" (sticky)

Each entry (card style):
┌─────────────────────────────────────────┐
│ [Icon] Actor · Role           Timestamp │
│        Action description               │
│        Detail (italic, muted)           │
│        [View detail →] (optional)       │
└─────────────────────────────────────────┘

Icon backgrounds:
🤖 #e7eff7 (AI — blue)
👤 #D1FAE5 (Human override — green)
⚠️ #FEF3C7 (Warning — yellow)
📤 #EDE9FE (Submission — purple)
➕ #F1F5F9 (New item — gray)

Example entries:
👤 Budi Santoso (PO) · 5 min ago
   Override: QRIS Retry → Priority High
   "Strategic initiative Q4 BCA campaign"
   Prompt v1.2.3

🤖 COMPASS AI · 23 min ago  
   Scoring: Login Biometrik — RICE 13,200
   Confidence: 80%

⚠️ COMPASS AI · 1 hour ago
   Dependency conflict: Biometrik ↔ Identity Service v2
```

-----

## 8. KEY UI PATTERNS

### Backlog List Row

```
[Rank] Title                          [RICE]
       [Tag] [Tag] [●status text]     [bar ]

Rank: 22px rounded square
      Top 3: #083767 bg, white text
      Rest: #94A3B8 bg, white text
Title: 12px, 600 weight, truncate
Tags: 10px pills with colored bg
Status: 7px dot + 10px text
RICE: 13px, bold, #083767
Bar: 60px × 4px, #0d5cab fill
```

### Override Badge (shown on scored backlog)

```
👤 Overridden · Medium → High
"Strategic initiative Q4 campaign"
10px, #64748B, below main score
```

### Product Switcher

```
In sidebar bottom section:
┌──────────────────────────┐
│ Active Product           │
│ myBCA Mobile         ▼  │  ← #0d5cab text, white bg subtle card
└──────────────────────────┘

Dropdown:
○ myBCA Mobile  ← active (checkmark #0d5cab)
○ BCA Mobile Bisnis
○ Klik BCA
```

### Emergency Backlog Card

```
Red left border (3px #EF4444)
🚨 [EMERGENCY] tag (red bg pill)
Yellow info box below:
"Awaiting PMO/CPO Approval"
"Raw RICE: 5,000 → Adjusted: 10,000"
```

### Notification Bell Panel (slide-in right)

```
Header: "Notifications" + [Mark all read]

Entry types with icons:
🤖 AI scoring complete
⏰ Q3 submission deadline in 18 days
💬 PMO commented on your submission
⚠️ Dependency conflict detected
🚨 Emergency flag requires approval
```

-----

## 9. MOBILE CONSIDERATIONS

Mobile is secondary (stakeholder report viewing):

```
Priority on mobile:
→ Dashboard summary (read-only)
→ Roadmap view (read-only)
→ Delivered reports

Mobile layout:
→ Bottom tab navigation (replaces sidebar)
  Tabs: Dashboard | Backlog | Roadmap | More
→ Cards stack vertically, full width
→ Simplified stats (2 cards per row)
→ No backlog input on mobile (desktop only)
→ Read-only mode for most features
```

-----

## 10. EMPTY STATES

```
No backlog yet:
Icon: 📋 (large, muted)
Title: "No backlogs added yet"
Sub: "Start by adding your first backlog item"
CTA: [+ Add Backlog] button

No AI score:
Icon: 🤖
Title: "AI analysis pending"
Sub: "Complete backlog details to enable scoring"
CTA: [Complete Details] button

No roadmap:
Icon: 🗺️
Title: "Shadow roadmap is empty"
Sub: "Add backlogs and assign them to quarters"

No activity:
Icon: 🕐
Title: "No recent activity"
Sub: "Actions and AI decisions will appear here"
```

-----

## 11. MICRO-INTERACTIONS

```
→ Completeness bar: animates as fields are filled
→ RICE score: count-up animation on first display
→ Impact analysis: slide-in for conflict cards
→ Override: smooth expand for reason field
→ Submission progress ring: animated circular fill
→ Badge "3 alerts": colored pill (danger red if alerts, orange if warnings)
→ Roadmap cards: drag ghost on hover (shadow only)
→ Notification bell: bounce on new notification
→ Tab switch: smooth fade between roadmap modes
```

-----

## 12. SCREENS PRIORITY FOR DEMO

```
For judges demo (5-10 minutes):

1. Dashboard Overview      ← First impression
2. Backlog Input + AI Score ← Core AI value  
3. Priority Impact Analysis ← Flagship differentiator
4. Shadow → Final Roadmap  ← Planning workflow
5. PMO Submission          ← Governance
6. Audit Trail             ← Explainability
```

-----

## 13. DESIGN DO’S & DON’TS

```
DO:
✅ White space — breathing room between elements
✅ Data prominent — numbers should stand out
✅ AI feels helpful — not intimidating or autonomous
✅ Color purposefully — not decoratively
✅ Every AI element has reasoning toggle
✅ Human override always visible and accessible
✅ Consistent border radius (12px cards, 8px buttons)
✅ Use #0d5cab as the single source of blue truth

DON'T:
❌ Too many colors — stick to defined palette
❌ Information overload — use progressive disclosure
❌ Make AI feel in control or autonomous
❌ Hide the override mechanism
❌ Pie charts — use bars and numbers
❌ Small touch targets on mobile
❌ Multiple shades of blue that are too similar
❌ Dark mode (not required for MVP)
```

-----

## 14. REFERENCE APPS TO STUDY

```
Linear.app       → Sidebar, issue list, clean typography
Vercel Dashboard → Stat cards, activity feed style
Notion AI        → Inline AI suggestions, toggle pattern
Retool           → Enterprise data tables
Raycast          → Clean search, command palette
```

-----

*Document prepared for design handoff.*
*Platform: COMPASS — Cognitive Orchestration & Management for Product Agile Scoring System*
*Brand: Bank Central Asia (BCA) Internal Platform*
*Primary Blue: #0d5cab*
*Font: To be finalized by designer*
*Design Language: Enterprise Modern SaaS*