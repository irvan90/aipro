import { Component, computed, OnInit, signal } from '@angular/core';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImpactAnalysisResult } from '../../core/models/ai-result.model';
import { Backlog, Quarter, RoadmapLane } from '../../core/models/backlog.model';
import { AiService } from '../../core/services/ai.service';
import { ToastService } from '../../core/services/toast.service';
import { backlogStore } from '../../core/stores/backlog.store';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink, DragDropModule],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent implements OnInit {
  quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  connectedLists = this.quarters.map(quarter => `quarter-${quarter}`);
  selected = signal<Backlog | null>(null);
  targetQuarter = signal<Quarter>('Q3');
  showReview = signal(false);
  impactLoading = signal(false);
  impact = signal<ImpactAnalysisResult | null>(null);
  decisionApplied = signal(false);
  aiLoadingStep = backlogStore.aiLoadingStep;

  quarterData = computed(() => this.quarters.map(quarter => ({
    quarter,
    items: backlogStore.all()
      .filter(item => item.targetQuarter === quarter)
      .sort((a, b) => (b.aiResult?.riceScore ?? 0) - (a.aiResult?.riceScore ?? 0)),
  })));

  constructor(
    private route: ActivatedRoute,
    private ai: AiService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const reviewId = this.route.snapshot.queryParamMap.get('review');
    if (reviewId) {
      const item = backlogStore.all().find(backlog => backlog.id === reviewId);
      if (item) this.reviewRecommendation(item, 'Q3');
    }
  }

  onDrop(event: CdkDragDrop<Backlog[]>, target: Quarter): void {
    const item: Backlog = event.item.data;
    if (!item || item.targetQuarter === target || this.isExpired(target)) return;
    this.reviewRecommendation(item, target);
  }

  reviewRecommendation(item: Backlog, target: Quarter = 'Q3'): void {
    this.selected.set(item);
    this.targetQuarter.set(target);
    this.showReview.set(true);
    this.impactLoading.set(true);
    this.impact.set(null);
    this.ai.analyzeImpact(item.id, target).subscribe(result => {
      this.impact.set(result);
      this.impactLoading.set(false);
    });
  }

  acceptRecommendation(): void {
    const item = this.selected();
    const target = this.targetQuarter();
    if (!item) return;
    backlogStore.all.update(all => all.map(backlog =>
      backlog.id === item.id
        ? { ...backlog, targetQuarter: target, roadmapLane: this.laneForQuarter(target), updatedAt: new Date() }
        : backlog
    ));
    this.showReview.set(false);
    this.decisionApplied.set(true);
    this.toast.show('success', `${item.title} dipindahkan ke ${target}`);
  }

  cancelRecommendation(): void {
    this.showReview.set(false);
    this.selected.set(null);
    this.impact.set(null);
    this.impactLoading.set(false);
  }

  isExpired(quarter: Quarter): boolean { return quarter === 'Q1'; }
  isCurrent(quarter: Quarter): boolean { return quarter === 'Q2'; }

  quarterLabel(quarter: Quarter): string {
    return { Q1: 'Jan–Mar', Q2: 'Apr–Jun', Q3: 'Jul–Sep', Q4: 'Oct–Dec', Unplanned: 'Unplanned' }[quarter];
  }

  private laneForQuarter(quarter: Quarter): RoadmapLane {
    if (quarter === 'Q2') return 'Now';
    if (quarter === 'Q3') return 'Next';
    return 'Later';
  }
}
