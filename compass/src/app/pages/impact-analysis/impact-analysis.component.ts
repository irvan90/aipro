import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { backlogStore } from '../../core/stores/backlog.store';
import { AiService } from '../../core/services/ai.service';
import { ToastService } from '../../core/services/toast.service';
import { MOCK_IMPACT_RESULT } from '../../core/services/mock-data.service';
import { Backlog, Quarter, BacklogStatus } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { AiBadgeComponent } from '../../shared/components/ai-badge/ai-badge.component';
import { MoSCoW } from '../../core/models/backlog.model';

interface ImpactStateDisplay {
  riceScore: number;
  quarter: Quarter;
  status: BacklogStatus;
  dependencies: string[];
  revenueImpact: string;
  revenueChange?: number;
}

interface ImpactRoadmapDisplay {
  affectedItems: number;
  severity: string;
  items: Array<{ id: string; title: string; description: string; type: string }>;
}

interface ImpactDependencyDisplay {
  blockedItems: number;
  severity: string;
  details: Array<{ id: string; title: string; reason: string; status: BacklogStatus }>;
}

interface ImpactKPIDisplay {
  severity: string;
  metrics: Array<{ name: string; current: string; projected: string; change: number }>;
}

interface ImpactRecommendation {
  title: string;
  reasoning: string;
  risks: string[];
}

interface ImpactDisplayResult {
  currentState: ImpactStateDisplay;
  whatIfState: ImpactStateDisplay;
  roadmapImpact: ImpactRoadmapDisplay;
  dependencyImpact: ImpactDependencyDisplay;
  kpiImpact: ImpactKPIDisplay;
  recommendation: ImpactRecommendation;
}

@Component({
  selector: 'app-impact-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, MoscowTagComponent, StatusDotComponent, AiBadgeComponent],
  templateUrl: './impact-analysis.component.html',
  styleUrl: './impact-analysis.component.scss',
})
export class ImpactAnalysisComponent implements OnInit {
  backlogs = computed(() => backlogStore.all());
  selectedBacklogId = signal<string>('');
  selectedQuarter = signal<Quarter>('Q3');
  quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  isAnalyzing = signal(false);
  currentStepIndex = signal(0);
  showResults = signal(false);
  analysisResult = signal<ImpactDisplayResult | null>(null);
  accordionOpen = signal<string | null>('roadmap');

  analysisSteps = [
    { label: 'Mapping dependency chain…' },
    { label: 'Analyzing roadmap consequences…' },
    { label: 'Checking dependency readiness…' },
    { label: 'Generating recommendations…' },
  ];

  selectedBacklogTitle = computed(() => {
    const id = this.selectedBacklogId();
    return this.backlogs().find(b => b.id === id)?.title ?? '';
  });

  selectedBacklogMoscow = computed<MoSCoW>(() => {
    const id = this.selectedBacklogId();
    return this.backlogs().find(b => b.id === id)?.aiResult?.moscow ?? 'Should Have';
  });

  constructor(private aiService: AiService, private toastService: ToastService) {}

  ngOnInit() {
    if (this.backlogs().length > 0) {
      this.selectedBacklogId.set(this.backlogs()[0].id);
    }
  }

  onBacklogChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedBacklogId.set(select.value);
    this.showResults.set(false);
    this.analysisResult.set(null);
  }

  runAnalysis() {
    if (!this.selectedBacklogId()) return;
    this.isAnalyzing.set(true);
    this.showResults.set(false);
    this.currentStepIndex.set(0);

    const stepInterval = setInterval(() => {
      const next = this.currentStepIndex() + 1;
      if (next <= this.analysisSteps.length) {
        this.currentStepIndex.set(next);
      } else {
        clearInterval(stepInterval);
      }
    }, 750);

    setTimeout(() => {
      clearInterval(stepInterval);
      this.currentStepIndex.set(this.analysisSteps.length);
      this.isAnalyzing.set(false);
      this.analysisResult.set(this.buildResult());
      this.showResults.set(true);
    }, 3000);
  }

  private buildResult(): ImpactDisplayResult {
    const backlog = backlogStore.all().find(b => b.id === this.selectedBacklogId());
    const toQuarter = this.selectedQuarter();
    const fromQuarter = backlog?.targetQuarter ?? 'Q3';
    return {
      currentState: {
        riceScore: backlog?.aiResult?.riceScore ?? 72,
        quarter: fromQuarter,
        status: backlog?.status ?? 'ai_scored',
        dependencies: backlog?.dependency ?? [],
        revenueImpact: 'Rp 4.2B',
      },
      whatIfState: {
        riceScore: Math.round((backlog?.aiResult?.riceScore ?? 72) * 0.85),
        quarter: toQuarter,
        status: 'ai_scored',
        dependencies: (backlog?.dependency ?? []).slice(0, 1),
        revenueImpact: 'Rp 3.6B',
        revenueChange: -14,
      },
      roadmapImpact: {
        affectedItems: MOCK_IMPACT_RESULT.roadmapImpacts.length,
        severity: 'High',
        items: MOCK_IMPACT_RESULT.roadmapImpacts.map(r => ({
          id: r.affectedBacklogId,
          title: r.affectedBacklogTitle,
          description: r.description,
          type: r.severity === 'high' ? 'conflict' : 'warning',
        })),
      },
      dependencyImpact: {
        blockedItems: MOCK_IMPACT_RESULT.dependencyImpacts.filter(d => d.isBlocker).length,
        severity: 'Medium',
        details: MOCK_IMPACT_RESULT.dependencyImpacts.map(d => ({
          id: d.dependencyId,
          title: d.dependencyTitle,
          reason: d.description,
          status: d.isBlocker ? 'not_ready' : 'ai_scored',
        })),
      },
      kpiImpact: {
        severity: 'High',
        metrics: MOCK_IMPACT_RESULT.kpiImpacts.map(k => ({
          name: k.kpi,
          current: '91.5%',
          projected: '88.2%',
          change: -3,
        })),
      },
      recommendation: {
        title: MOCK_IMPACT_RESULT.recommendedAction === 'keep'
          ? `Keep in ${fromQuarter} — Recommended`
          : `Move to ${toQuarter}`,
        reasoning: MOCK_IMPACT_RESULT.aiRecommendation,
        risks: [
          'Revenue target for Q3 may be missed',
          `${MOCK_IMPACT_RESULT.estimatedDelayInSprints} sprint delay estimated`,
        ],
      },
    };
  }

  toggleAccordion(key: string) {
    this.accordionOpen.set(this.accordionOpen() === key ? null : key);
  }

  acceptRecommendation() {
    this.toastService.show('success', 'Decision recorded: Keep in current quarter');
    this.showResults.set(false);
    this.analysisResult.set(null);
  }

  overrideRecommendation() {
    this.toastService.show('warning', `Override applied: Moving to ${this.selectedQuarter()}`);
    this.showResults.set(false);
    this.analysisResult.set(null);
  }

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = {
      Low: 'px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
      Medium: 'px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700',
      High: 'px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700',
    };
    return map[severity] ?? map['Medium'];
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      draft: 'text-gray-500',
      ai_scored: 'text-blue-500',
      ready: 'text-green-600',
      not_ready: 'text-red-500',
      submitted: 'text-purple-600',
      archived: 'text-gray-400',
    };
    return map[status] ?? 'text-gray-700';
  }

  formatStatus(status: string): string {
    const map: Record<string, string> = {
      draft: 'Draft',
      ai_scored: 'Scored',
      ready: 'Ready',
      not_ready: 'Not Ready',
      submitted: 'Submitted',
      archived: 'Archived',
    };
    return map[status] ?? status;
  }
}
