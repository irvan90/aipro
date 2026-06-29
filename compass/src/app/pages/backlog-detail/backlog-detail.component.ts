import { Component, computed, OnInit, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AIResult, valueEffortQuadrant, ValueEffortQuadrantInfo } from '../../core/models/backlog.model';
import { AiService } from '../../core/services/ai.service';
import { backlogStore } from '../../core/stores/backlog.store';
import { AgentPipelineComponent } from '../../shared/components/agent-pipeline/agent-pipeline.component';

@Component({
  selector: 'app-backlog-detail',
  standalone: true,
  imports: [RouterLink, AgentPipelineComponent, DecimalPipe],
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

  showEvidence = signal(false);
  thinkingLogs = backlogStore.thinkingLogs;
  loadingStep = backlogStore.aiLoadingStep;

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
