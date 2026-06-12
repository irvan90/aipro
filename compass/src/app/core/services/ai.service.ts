import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgentFinding, AIResult, Backlog, MoSCoW, Quarter, RICEDimension, valueEffortQuadrant } from '../models/backlog.model';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AILoadingStep } from '../models/ui.model';
import { backlogStore } from '../stores/backlog.store';
import { AGENT_DEFINITIONS, MOCK_IMPACT_RESULT } from './mock-data.service';

const STEP_MS = 380;
const MISSING_FIELD_LABELS: { key: keyof Backlog; label: string }[] = [
  { key: 'businessObjective', label: 'Business Objective' },
  { key: 'targetUsers', label: 'Target Users' },
  { key: 'impactArea', label: 'Impact Area' },
  { key: 'supportingEvidence', label: 'Supporting Evidence' },
  { key: 'estimatedImpact', label: 'Estimasi Impact' },
  { key: 'effortEstimation', label: 'Estimasi Effort' },
];

@Injectable({ providedIn: 'root' })
export class AiService {
  private impactSteps: AILoadingStep[] = [
    'Mapping dependency chain...',
    'Analyzing roadmap consequences...',
    'Calculating KPI effects...',
    'Generating recommendations...',
  ];

  /**
   * Simulated agentic scoring pipeline: 6 agents run sequentially,
   * each emitting its steps to aiLoadingStep and its finding to agentStates.
   */
  analyzeBacklog(backlog: Backlog): Observable<AIResult> {
    return new Observable(observer => {
      const findings = this.buildFindings(backlog);
      backlogStore.agentStates.set(AGENT_DEFINITIONS.map(a => ({
        agentId: a.id, name: a.name, icon: a.icon, status: 'pending' as const,
      })));

      const timers: ReturnType<typeof setTimeout>[] = [];
      let offset = 0;

      AGENT_DEFINITIONS.forEach((agent, idx) => {
        timers.push(setTimeout(() => {
          backlogStore.agentStates.update(states =>
            states.map(s => s.agentId === agent.id ? { ...s, status: 'running' } : s));
        }, offset));

        agent.steps.forEach((step, sIdx) => {
          timers.push(setTimeout(() => {
            backlogStore.aiLoadingStep.set(`${agent.icon} ${agent.name}: ${step}`);
          }, offset + sIdx * STEP_MS));
        });

        offset += agent.steps.length * STEP_MS;

        timers.push(setTimeout(() => {
          backlogStore.agentStates.update(states =>
            states.map(s => s.agentId === agent.id ? { ...s, status: 'done', finding: findings[idx] } : s));
        }, offset));
      });

      timers.push(setTimeout(() => {
        observer.next(this.buildResult(backlog, findings));
        observer.complete();
      }, offset + 400));

      return () => timers.forEach(t => clearTimeout(t));
    });
  }

  analyzeImpact(backlogId: string, targetQuarter: Quarter): Observable<ImpactAnalysisResult> {
    return new Observable(observer => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < this.impactSteps.length) {
          backlogStore.aiLoadingStep.set(this.impactSteps[i]);
          i++;
        }
      }, 700);

      setTimeout(() => {
        clearInterval(interval);
        observer.next({ ...MOCK_IMPACT_RESULT, backlogId, targetQuarter });
        observer.complete();
      }, 3000);
    });
  }

  private missingFields(backlog: Backlog): string[] {
    return MISSING_FIELD_LABELS
      .filter(({ key }) => {
        const v = backlog[key];
        return Array.isArray(v) ? v.length === 0 : !v;
      })
      .map(({ label }) => label);
  }

  private buildFindings(backlog: Backlog): AgentFinding[] {
    const ms = backlog.myService;
    const sparse = backlog.completenessScore < 60;

    const external: AgentFinding = {
      agentId: 'external-research', agentName: 'External Product Research', role: 'Riset produk sejenis', icon: '🔍',
      summary: ms
        ? `Fitur serupa "${backlog.title}" sudah umum di aplikasi bank digital (Jago, blu, Livin'). Kehadirannya dianggap standar pasar, bukan diferensiator.`
        : `Benchmark kompetitor menunjukkan fitur sejenis tersedia di 2–3 pemain utama; gap kompetitif moderat.`,
      contributesTo: ['Impact', 'Confidence'],
      evidence: ['Competitor Feature Scan Jun 2026', 'App Store Review Analysis'],
    };

    const internal: AgentFinding = {
      agentId: 'internal-data', agentName: 'Internal Data Analyst', role: 'Analisis data internal', icon: '📊',
      summary: sparse
        ? 'Data internal terbatas — belum ada Supporting Evidence yang dilampirkan. Estimasi Reach memakai proksi segmen pengguna sejenis.'
        : `Reach diestimasi dari analytics segmen target; evidence terlampir (${backlog.supportingEvidence.join(', ') || 'analytics'}) memperkuat estimasi Impact.`,
      contributesTo: ['Reach', 'Impact'],
      evidence: sparse ? ['Proksi: segmen pengguna fitur sejenis'] : ['Usage Analytics Dashboard', 'Complaint/Survey Data'],
    };

    const complianceFlag = this.complianceFlagged(backlog);
    const compliance: AgentFinding = {
      agentId: 'compliance-risk', agentName: 'Compliance & Risk Assessor', role: 'Cek regulasi & risiko', icon: '🛡️',
      summary: complianceFlag
        ? (ms?.personalDataAccess
          ? 'Backlog mengakses data pribadi nasabah — wajib ROPA/DPIA sebelum implementasi. Direkomendasikan Must Have dengan gate kepatuhan.'
          : 'Backlog terkait kepatuhan regulasi (OJK/BI) — wajib diprioritaskan terlepas dari skor RICE.')
        : 'Tidak ditemukan keterkaitan regulasi baru maupun akses data pribadi tambahan.',
      contributesTo: ['MoSCoW'],
      evidence: complianceFlag ? ['Checklist ROPA/DPIA', 'Regulasi OJK/BI terkait'] : ['Pemindaian regulasi OJK/BI 2026'],
    };

    const effortAnchor = ms
      ? `Valuegraph Effort myService: ${ms.valuegraphEffort}`
      : (backlog.effortEstimation || 'estimasi internal');
    const effortSignals = [
      ms?.involvementDWH ? 'keterlibatan DWH' : '',
      ms?.involvementRPA ? 'keterlibatan RPA' : '',
      ms?.timeToMarketMonths ? `time to market ${ms.timeToMarketMonths} bulan` : '',
    ].filter(Boolean).join(', ');
    const effort: AgentFinding = {
      agentId: 'effort-estimator', agentName: 'Effort Estimator', role: 'Estimasi effort teknis', icon: '⚙️',
      summary: `Effort di-anchor dari ${effortAnchor}${effortSignals ? `, disesuaikan dengan ${effortSignals}` : ''}. Estimasi ${this.effortPoints(backlog)} story points.`,
      contributesTo: ['Effort'],
      evidence: ms ? ['Valuegraph myService', 'Delivery History fitur sejenis'] : ['Delivery History fitur sejenis'],
    };

    const fit: AgentFinding = {
      agentId: 'product-fit', agentName: 'Product Fit Checker', role: 'Kesesuaian strategi produk', icon: '🎯',
      summary: sparse
        ? 'Keselarasan dengan KPI produk belum dapat dinilai penuh — Business Objective belum diisi. Penilaian sementara dari deskripsi.'
        : 'Backlog selaras dengan objective produk dan tidak overlap dengan fitur existing.',
      contributesTo: ['Impact', 'MoSCoW'],
      evidence: ['Product Context: myBCA Mobile'],
    };

    const synth: AgentFinding = {
      agentId: 'synthesizer', agentName: 'Scoring Synthesizer', role: 'Sintesis skor final', icon: '🧮',
      summary: sparse
        ? 'Skor disusun dari data terbatas — confidence rendah. Lengkapi field yang kurang untuk meningkatkan kualitas skor.'
        : 'Temuan antar-agent konsisten; skor final disusun dengan confidence tinggi.',
      contributesTo: ['Reach', 'Impact', 'Confidence', 'Effort', 'MoSCoW'],
      evidence: ['Gabungan temuan 5 agent'],
    };

    return [external, internal, compliance, effort, fit, synth];
  }

  private complianceFlagged(backlog: Backlog): boolean {
    return backlog.impactArea.includes('Compliance')
      || backlog.myService?.category === 'Compliance'
      || backlog.myService?.personalDataAccess === true;
  }

  private effortPoints(backlog: Backlog): number {
    const ms = backlog.myService;
    if (ms) {
      const base = { Low: 2, Medium: 5, High: 8 }[ms.valuegraphEffort];
      return base + (ms.involvementDWH ? 2 : 0) + (ms.involvementRPA ? 1 : 0);
    }
    const parsed = parseInt(backlog.effortEstimation, 10);
    return isNaN(parsed) ? 8 : parsed;
  }

  private buildResult(backlog: Backlog, findings: AgentFinding[]): AIResult {
    const prior = backlog.aiResult;
    const ms = backlog.myService;
    const completeness = backlog.completenessScore;
    const missing = this.missingFields(backlog);

    const confidenceLevel = completeness < 60
      ? Math.min(60, 40 + Math.round(completeness / 3))
      : Math.min(90, 75 + Math.round(((completeness - 60) / 40) * 15));

    // deterministic pseudo-variety per backlog
    const seed = backlog.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const reachValue = prior?.reach.value ?? (15000 + (seed % 7) * 5000 + completeness * 200);
    const impactValue = prior?.impact.value
      ?? (ms ? { Low: 1, Medium: 2, High: 3 }[ms.valuegraphValue] : 2);
    const confValue = confidenceLevel / 100;
    const effortValue = this.effortPoints(backlog);
    const riceScore = Math.round((reachValue * impactValue * confValue) / effortValue);

    const reachDim = (value: number, reasoning: string): RICEDimension => ({
      value, reasoning,
      label: value >= 40000 ? 'High' : value >= 15000 ? 'Medium' : 'Low',
    });
    const impactDim = (value: number, reasoning: string): RICEDimension => ({
      value, reasoning,
      label: value >= 3 ? 'Massive' : value >= 2 ? 'High' : 'Medium',
    });
    const effortDim = (value: number, reasoning: string): RICEDimension => ({
      value, reasoning,
      label: value >= 13 ? 'High' : value >= 6 ? 'Medium' : 'Low',
    });

    const complianceFlag = this.complianceFlagged(backlog);
    let moscow: MoSCoW;
    if (complianceFlag) {
      moscow = 'Must Have';
    } else {
      moscow = riceScore >= 12000 ? 'Must Have'
        : riceScore >= 7000 ? 'Should Have'
        : riceScore >= 3000 ? 'Could Have'
        : "Won't Have";
      if (ms) {
        const quadrant = valueEffortQuadrant(ms.valuegraphValue, ms.valuegraphEffort).label;
        const ladder: MoSCoW[] = ["Won't Have", 'Could Have', 'Should Have', 'Must Have'];
        const i = ladder.indexOf(moscow);
        if (quadrant === 'Quick Win') moscow = ladder[Math.min(i + 1, 3)];
        if (quadrant === 'Money Pit') moscow = ladder[Math.max(i - 1, 0)];
      }
    }

    // discrepancy between AI score and myService Valuegraph
    let discrepancy = '';
    if (ms) {
      if (riceScore >= 10000 && ms.valuegraphValue === 'Low') {
        discrepancy = ' ⚠️ Penilaian AI lebih tinggi dari Valuegraph myService (Value: Low) — perlu review PO.';
      } else if (riceScore < 5000 && ms.valuegraphValue === 'High') {
        discrepancy = ' ⚠️ Penilaian AI lebih rendah dari Valuegraph myService (Value: High) — perlu review PO.';
      }
    }

    const summary = (completeness < 60
      ? `Skor awal dari data minimal (confidence ${confidenceLevel}%). Lengkapi ${missing.join(', ')} untuk meningkatkan confidence.`
      : `Skor disusun dari temuan 6 agent dengan confidence ${confidenceLevel}%.`) + discrepancy;

    return {
      riceScore,
      reach: reachDim(reachValue, findings[1].summary),
      impact: impactDim(impactValue, findings[0].summary),
      confidence: { value: confValue, label: confValue >= 0.75 ? 'High' : confValue >= 0.5 ? 'Medium' : 'Low', reasoning: `Confidence ${confidenceLevel}% — ditentukan dari kelengkapan data (${completeness}%) dan ketersediaan evidence.` },
      effort: effortDim(effortValue, findings[3].summary),
      moscow,
      reasoning: {
        reach: findings[1].summary,
        impact: `${findings[0].summary} ${findings[4].summary}`,
        confidence: `Confidence ${confidenceLevel}% dari kelengkapan data ${completeness}% dan evidence yang tersedia.`,
        effort: findings[3].summary,
        summary,
        evidenceRefs: findings.flatMap(f => f.evidence).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5),
      },
      confidenceLevel,
      promptVersion: 'agentic-v2.0',
      scoredAt: new Date(),
      agentFindings: findings,
      missingFields: missing,
    };
  }
}
