import { Component, computed, OnInit, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AIResult, ThinkingStep, valueEffortQuadrant, ValueEffortQuadrantInfo } from '../../core/models/backlog.model';
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
  { agent: 'risk-agent', label: 'Risk Agent', subtitle: 'Estimasi effort & compliance', icon: '◇', type: 'risk' },
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

  getFinalRecommendation(result: AIResult): string {
    const moscow = result.moscow;
    const confidence = result.confidenceLevel;
    const rice = result.riceScore;
    const quadrant = this.getQuadrant(result);

    const parts: string[] = [];

    // MoSCoW + Confidence intro
    switch (moscow) {
      case 'Must Have':
        parts.push(`Backlog ini diklasifikasi sebagai <strong>Must Have</strong> — prioritas tertinggi yang harus segera dieksekusi`);
        break;
      case 'Should Have':
        parts.push(`Backlog ini diklasifikasi sebagai <strong>Should Have</strong> — penting namun tidak bersifat darurat`);
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

    // RICE score context
    if (rice) {
      parts.push(`dengan <strong>RICE Score ${rice.total.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong> (Reach: ${rice.reach}/10 — ${rice.reachLabel || 'skor normalisasi'}, Impact: ${rice.impact}x, Confidence: ${confidence}%, Effort: ${rice.effort} pts)`);
    } else {
      parts.push(`dengan confidence level <strong>${confidence}%</strong>`);
    }

    // Value-Effort quadrant insight
    if (quadrant) {
      switch (quadrant.label) {
        case 'Quick Win':
          parts.push(`— masuk dalam kuadran <strong>Quick Win</strong>: high value, low effort, sehingga layak langsung diprioritaskan dalam sprint mendatang`);
          break;
        case 'Big Bet':
          parts.push(`— masuk dalam kuadran <strong>Big Bet</strong>: high value namun high effort, memerlukan perencanaan matang dan alokasi resource yang signifikan`);
          break;
        case 'Fill-in':
          parts.push(`— masuk dalam kuadran <strong>Fill-in</strong>: low value, low effort, dapat dikerjakan saat ada kapasitas lebih`);
          break;
        case 'Money Pit':
          parts.push(`— masuk dalam kuadran <strong>Money Pit</strong>: low value, high effort, perlu dipertimbangkan kembali kelayakannya`);
          break;
      }
    }

    // Closing based on MoSCoW
    switch (moscow) {
      case 'Must Have':
        parts.push(`Rekomendasi: segera <strong>promote</strong> ke roadmap dan alokasikan resource dalam sprint ini.`);
        break;
      case 'Should Have':
        parts.push(`Rekomendasi: masukkan ke dalam <strong>roadmap kuartal ini</strong> namun dapat dinegosiasikan urutannya.`);
        break;
      case 'Could Have':
        parts.push(`Rekomendasi: <strong>keep</strong> dalam backlog, eksekusi jika kapasitas tim memungkinkan.`);
        break;
      case "Won't Have":
        parts.push(`Rekomendasi: <strong>defer</strong> — evaluasi kembali saat kondisi bisnis atau kapasitas berubah.`);
        break;
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

      if (cfg.agent === 'market-agent' || cfg.agent === 'value-agent' || cfg.agent === 'risk-agent') {
        const state = states.find(s => s.agentId === cfg.agent);
        if (state?.status === 'running') status = 'active';
        else if (state?.status === 'done') status = 'done';
      } else if (cfg.agent === 'orchestrator') {
        if (phase === 'core-engine') status = 'active';
        else if (phase === 'agents' || phase === 'decision-engine') status = 'done';
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
    if (id) backlogStore.selectedBacklogId.set(id);
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
          backlog.id === item.id ? { ...backlog, aiResult: result, updatedAt: new Date() } : backlog
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
