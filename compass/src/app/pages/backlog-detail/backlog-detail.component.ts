import { Component, computed, OnInit, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AIResult, Backlog, ThinkingStep, valueEffortQuadrant, ValueEffortQuadrantInfo } from '../../core/models/backlog.model';
import { AiService } from '../../core/services/ai.service';
import { backlogStore } from '../../core/stores/backlog.store';

interface AgentCardDef {
  agent: string;
  label: string;
  subtitle: string;
  icon: string;
  type: string;
}

type CardStatus = 'pending' | 'active' | 'done';

interface AgentCard {
  agent: string;
  label: string;
  subtitle: string;
  icon: string;
  type: string;
  steps: ThinkingStep[];
  status: CardStatus;
}

const CARD_DEFS: AgentCardDef[] = [
  { agent: 'orchestrator', label: 'Orchestrator Agent', subtitle: 'Menerima & memproses backlog data', icon: '⚡', type: 'orchestrator' },
  { agent: 'market-agent', label: 'Market Agent', subtitle: 'Analisis tren pasar & kompetitor', icon: '◎', type: 'market' },
  { agent: 'value-agent', label: 'Value Agent', subtitle: 'Kalkulasi jangkauan & dampak bisnis', icon: '↗', type: 'value' },
  { agent: 'feasibility-agent', label: 'Feasibility Agent', subtitle: 'Estimasi effort & compliance', icon: '◇', type: 'feasibility' },
  { agent: 'decision-engine', label: 'Central Decision Engine', subtitle: 'RICE Scoring & rekomendasi akhir', icon: '❖', type: 'decision' },
];

@Component({
  selector: 'app-backlog-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './backlog-detail.component.html',
  styleUrl: './backlog-detail.component.scss',
})
export class BacklogDetailComponent implements OnInit, AfterViewChecked {
  backlog = computed(() => backlogStore.selectedBacklog());
  isAnalyzing = signal(false);
  analysisComplete = signal(false);
  analysisResult = signal<AIResult | null>(null);

  /** Computed dynamically from all backlogs that have a RICE score. */
  riceRankInfo = computed(() => {
    const item = this.backlog();
    if (!item?.aiResult?.riceScore) return null;

    const currentScore = item.aiResult.riceScore.total;

    // Collect every RICE total across all backlogs (including the current one)
    const allScores = backlogStore.all()
      .map(b => b.aiResult?.riceScore?.total)
      .filter((s): s is number => s !== undefined && s !== null);

    if (allScores.length === 0) return null;

    // Sort ascending so we can find the rank
    const sorted = [...allScores].sort((a, b) => a - b);

    // How many scores is the current one strictly better than?
    const beatenCount = sorted.filter(s => s < currentScore).length;
    const percentileBeat = Math.round((beatenCount / sorted.length) * 100); // % of backlogs beaten
    const topPercent   = Math.max(1, 100 - percentileBeat);                  // "Top X%"

    // Tier based on relative position (fully dynamic — no hardcoded value thresholds)
    const ratio = beatenCount / sorted.length;
    let tier: string;
    let tierKey: 'top' | 'high' | 'medium' | 'low';
    if (ratio >= 0.75) {
      tier = 'Top Tier'; tierKey = 'top';
    } else if (ratio >= 0.50) {
      tier = 'High';     tierKey = 'high';
    } else if (ratio >= 0.25) {
      tier = 'Medium';   tierKey = 'medium';
    } else {
      tier = 'Low';      tierKey = 'low';
    }

    return { topPercent, percentileBeat, tier, tierKey, total: sorted.length };
  });

  getQuadrant(result: AIResult): ValueEffortQuadrantInfo | null {
    if (!result.valueEffort) return null;
    return valueEffortQuadrant(result.valueEffort.value, result.valueEffort.effort);
  }

  getMatrixPosition(result: AIResult): { x: number; y: number } | null {
    if (!result.valueEffort) return null;
    const effortMap: Record<string, number> = { 'Low': 10, 'Medium': 55, 'High': 90 };
    const valueMap: Record<string, number> = { 'Low': 10, 'Medium': 55, 'High': 90 };
    return {
      x: effortMap[result.valueEffort.effort] ?? 50,
      y: valueMap[result.valueEffort.value] ?? 50,
    };
  }

  getRecommendationText(moscow: string): string {
    switch (moscow) {
      case 'Must Have': return 'Prioritize now — strong evidence supports immediate action.';
      case 'Should Have': return 'Recommended for upcoming roadmap — solid value proposition.';
      case 'Could Have': return 'Worth considering when team capacity allows.';
      case "Won't Have": return 'Suggested to defer — revisit in next planning cycle.';
      default: return 'Analysis complete — review details below.';
    }
  }

  getFinalRecommendation(result: AIResult, backlog?: Backlog): string {
    const moscow = result.moscow;
    const confidence = result.confidenceLevel;
    const rice = result.riceScore;
    const quadrant = this.getQuadrant(result);

    // Detect competitive evidence signals
    const competitiveSignal = backlog?.evidenceSignals?.find(s => s.type === 'competitive');
    const hasCompetitiveGap = !!competitiveSignal;

    const parts: string[] = [];

    // ── Opening: MoSCoW classification ──
    switch (moscow) {
      case 'Must Have':
        parts.push(`Backlog ini diklasifikasi sebagai <strong>Must Have</strong> — prioritas tertinggi yang harus segera dieksekusi`);
        break;
      case 'Should Have':
        parts.push(`Backlog ini diklasifikasi sebagai <strong>Should Have</strong> — penting dan perlu masuk roadmap kuartal ini`);
        break;
      case 'Could Have':
        parts.push(`Backlog ini diklasifikasi sebagai <strong>Could Have</strong> — memberikan nilai tambah namun dapat ditunda`);
        break;
      case "Won't Have":
        parts.push(`Backlog ini diklasifikasi sebagai <strong>Won't Have</strong> — disarankan untuk ditunda ke siklus berikutnya`);
        break;
      default:
        parts.push(`Hasil analisis menunjukkan rekomendasi <strong>${moscow}</strong>`);
    }

    // ── RICE score context ──
    if (rice) {
      parts.push(`dengan <strong>RICE Score ${rice.total.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong> (Reach: ${rice.reach}/10 — ${rice.reachLabel || 'skor normalisasi'}, Impact: ${rice.impact}x, Confidence: ${confidence}%, Effort: ${rice.effort} pts)`);
    } else {
      parts.push(`dengan confidence level <strong>${confidence}%</strong>`);
    }

    // ── Value-Effort quadrant insight ──
    if (quadrant) {
      switch (quadrant.label) {
        case 'Quick Win':
          parts.push(`— masuk kuadran <strong>Quick Win</strong>: high value, low effort, layak langsung diprioritaskan`);
          break;
        case 'Big Bet':
          parts.push(`— masuk kuadran <strong>Big Bet</strong>: high value namun high effort, perlu perencanaan resource signifikan`);
          break;
        case 'Fill-in':
          parts.push(`— masuk kuadran <strong>Fill-in</strong>: low value, low effort, kerjakan saat ada kapasitas lebih`);
          break;
        case 'Money Pit':
          parts.push(`— masuk kuadran <strong>Money Pit</strong>: low value, high effort, pertimbangkan kembali kelayakannya`);
          break;
      }
    }

    // ── Competitive gap finding dari Market Agent ──
    if (hasCompetitiveGap && competitiveSignal) {
      parts.push(`<br><br><strong>⚠️ Temuan Market Agent — ${competitiveSignal.label}:</strong> ${competitiveSignal.detail} Keterlambatan ini berdampak langsung pada risiko churn nasabah yang menginginkan fitur money management terpadu — dan saat ini mencari solusi di aplikasi kompetitor.`);
    }

    // ── Closing action ──
    const closingMap: Record<string, string> = {
      'Must Have': `<strong>Promote segera</strong> ke roadmap dan alokasikan resource dalam sprint ini.`,
      'Should Have': `<strong>Masukkan ke roadmap kuartal ini</strong> — urutan dapat dinegosiasikan namun jangan lewatkan dari planning.`,
      'Could Have': `<strong>Keep</strong> dalam backlog; eksekusi jika kapasitas tim memungkinkan.`,
      "Won't Have": `<strong>Defer</strong> — evaluasi kembali saat kondisi bisnis atau kapasitas berubah.`,
    };
    const closing = closingMap[moscow];
    if (closing) {
      parts.push(`<br>Rekomendasi: ${closing}`);
    }

    return parts.join(' ');
  }

  showEvidence = signal(false);
  thinkingLogs = backlogStore.thinkingLogs;
  loadingStep = backlogStore.aiLoadingStep;

  currentPhase = computed<'idle' | 'core-engine' | 'agents' | 'decision-engine'>(() => {
    if (backlogStore.aiLoadingState() === 'complete') return 'idle';
    const step = this.loadingStep();
    if (step.startsWith('Orchestrator') || step.startsWith('Connecting')) return 'core-engine';
    const agents = backlogStore.agentStates();
    if (agents.some(a => a.status === 'running')) return 'agents';
    if (step.includes('Decision Engine') || step.includes('MoSCoW')) return 'decision-engine';
    return 'idle';
  });

  agentCards = computed<AgentCard[]>(() => {
    const logs = this.thinkingLogs();
    const states = backlogStore.agentStates();
    const phase = this.currentPhase();

    return CARD_DEFS.map(cfg => {
      const steps = logs.filter(l => l.agent === cfg.agent);
      let status: CardStatus = 'pending';

      if (cfg.agent === 'market-agent' || cfg.agent === 'value-agent' || cfg.agent === 'feasibility-agent') {
        const state = states.find(s => s.agentId === cfg.agent);
        if (state?.status === 'running') status = 'active';
        else if (state?.status === 'done') status = 'done';
      } else if (cfg.agent === 'orchestrator') {
        if (phase === 'core-engine') status = 'active';
        else if (steps.length > 0) status = 'done';
      } else if (cfg.agent === 'decision-engine') {
        if (phase === 'decision-engine') status = 'active';
        else if (steps.some(s => s.type === 'result')) status = 'done';
      }

      return { ...cfg, steps, status };
    });
  });

  activeAgentCount = computed(() => this.agentCards().filter(c => c.status !== 'pending').length);
  completedAgentCount = computed(() => this.agentCards().filter(c => c.status === 'done').length);
  totalAgents = CARD_DEFS.length;
  agentCardDefs = CARD_DEFS;

  @ViewChild('logScroll') logScroll?: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ai: AiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      backlogStore.selectedBacklogId.set(id);
      const item = this.backlog();
      if (item?.aiResult) {
        this.analysisResult.set(item.aiResult);
        this.analysisComplete.set(true);
      }
    }
  }

  fastForward(): void {
    if (this.isAnalyzing()) {
      backlogStore.fastForwardAnalysis.set(true);
    }
  }

  ngAfterViewChecked(): void {
    if (this.logScroll) {
      const el = this.logScroll.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  runAnalysis(): void {
    const item = this.backlog();
    if (!item || this.isAnalyzing()) return;

    console.log('[BACKLOG-DETAIL DEBUG] runAnalysis called, item.id=', item?.id);

    this.analysisComplete.set(false);
    this.isAnalyzing.set(true);
    backlogStore.thinkingLogs.set([]);
    backlogStore.aiLoadingState.set('loading');
    backlogStore.currentAnalyzingId.set(item.id);

    this.ai.analyzeBacklog(item).subscribe({
      next: result => {
        this.analysisResult.set(result);
        backlogStore.all.update(all => all.map(backlog =>
          backlog.id === item.id ? {
            ...backlog,
            status: 'ai_scored',
            aiResult: result,
            priorityChangeReason: backlog.id === 'pocket-rupiah'
              ? '⚠️ ANALISIS KOMPETITOR: Fitur pocket/kantong sudah ada di Jenius sejak 2017 dan blu sejak 2020. BCA tertinggal 6-9 tahun. Urgensi harus dinaikkan dari Q4 ke Q3 untuk mencegah nasabah beralih ke kompetitor yang sudah memiliki fitur matang ini.'
              : backlog.priorityChangeReason,
            updatedAt: new Date()
          } : backlog
        ));
        this.analysisComplete.set(true);
        this.isAnalyzing.set(false);
        backlogStore.aiLoadingState.set('complete');
        backlogStore.currentAnalyzingId.set(null);
      },
      error: () => {
        this.isAnalyzing.set(false);
        backlogStore.aiLoadingState.set('error');
        backlogStore.currentAnalyzingId.set(null);
      },
    });
  }

  reviewRoadmap(): void {
    const item = this.backlog();
    if (!item) return;
    this.router.navigate(['/roadmap'], { queryParams: { review: item.id } });
  }
}
