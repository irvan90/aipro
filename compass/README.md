# COMPASS

**Cognitive Orchestration & Management for Product Agile Scoring System**

> *"Navigate your product priorities with confidence."*

An AI-assisted Product Planning & Prioritization Platform for Bank Central Asia (BCA) internal use.

## Tech Stack

- **Framework:** Angular 21 (Standalone Components)
- **Reactivity:** Angular Signals
- **Styling:** Tailwind CSS v3 + Custom SCSS
- **Drag & Drop:** Angular CDK
- **Build:** Angular CLI + Vite

## Features

- 🤖 AI-powered backlog scoring (RICE methodology)
- 📊 MoSCoW classification with reasoning
- 🗺️ Shadow & Final Roadmap planning with drag & drop
- ⚡ Priority Impact Analysis (what-if scenarios)
- 📄 AI-generated PRD drafts with split editor
- 📤 PMO Submission workflow
- 📋 Audit Trail & governance

## Local Development

```bash
npm install
npm start
```

The app will run at `http://localhost:4200`

## Build for Production

```bash
npm run build
```

Output goes to `dist/compass/browser/`

## Project Structure

```
src/app/
├── core/
│   ├── models/       # TypeScript interfaces
│   ├── services/     # Mock data & AI services
│   └── stores/       # Angular Signal stores
├── layout/           # Sidebar, Topbar, BottomNav
├── pages/            # 11 feature pages
└── shared/           # Reusable components & pipes
```

## Demo Flow

1. **Dashboard** → Overview of product health & AI insights
2. **Backlog Input** → Add backlog → AI scoring animation (3.2s)
3. **Impact Analysis** → What-if scenario analysis
4. **Roadmap** → Drag & drop planning with impact checks
5. **PMO Submission** → Submit Q3 roadmap to PMO

## Color System

| Token | Color | Usage |
|-------|-------|-------|
| `bca-navy` | `#083767` | Sidebar, headers |
| `bca-primary` | `#0d5cab` | Buttons, active states |
| `bca-accent` | `#e7eff7` | Light blue backgrounds |
| `success` | `#12b76a` | Completed states |
| `warning` | `#f79009` | Pending states |
| `danger` | `#f04438` | Conflicts, errors |

## Mock Data

All data is mocked — no backend required. Includes:
- 6 backlogs (bl-001 to bl-006) with full AI results
- 7 team members across roles (PO, APO, PMO, Dev, BA, QA)
- 2 products (myBCA Mobile, BCA Mobile Bisnis)
- Full roadmap Q1–Q4 with submission readiness
- 5 activities & 4 notifications
