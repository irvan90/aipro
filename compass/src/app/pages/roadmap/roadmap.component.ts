import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImpactAnalysisResult } from '../../core/models/ai-result.model';
import { Backlog, Quarter, RoadmapLane } from '../../core/models/backlog.model';
import { AiService } from '../../core/services/ai.service';
import { ToastService } from '../../core/services/toast.service';
import { backlogStore } from '../../core/stores/backlog.store';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink, DragDropModule, DecimalPipe],
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
      .filter(item => item.targetQuarter === quarter),
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

  isExpired(quarter: Quarter): boolean {
    return quarter === 'Q1';
  }

  isCurrent(quarter: Quarter): boolean {
    return quarter === 'Q2';
  }

  quarterLabel(quarter: Quarter): string {
    const labels: Record<Quarter, string> = {
      Q1: 'Jan – Mar 2026',
      Q2: 'Apr – Jun 2026',
      Q3: 'Jul – Sep 2026',
      Q4: 'Okt – Des 2026',
      Unplanned: 'Unplanned',
    };
    return labels[quarter];
  }

  onDrop(event: CdkDragDrop<Backlog[]>, target: Quarter): void {
    if (this.isExpired(target)) return;

    if (event.previousContainer === event.container) {
      // Vertical reordering within the same quarter
      if (event.previousIndex === event.currentIndex) return;

      const currentItems = [...event.container.data];
      moveItemInArray(currentItems, event.previousIndex, event.currentIndex);

      const all = backlogStore.all();
      const result: Backlog[] = [];
      let quarterIdx = 0;

      for (const item of all) {
        if (item.targetQuarter === target) {
          if (quarterIdx < currentItems.length) {
            result.push(currentItems[quarterIdx++]);
          }
        } else {
          result.push(item);
        }
      }

      backlogStore.all.set(result);
      this.toast.show('info', `Urutan backlog di ${target} diperbarui`);
      return;
    }

    // Cross-quarter move
    const item: Backlog = event.item.data;
    if (!item || item.targetQuarter === target) return;
    this.reviewRecommendation(item, target);
  }

  getRiceRankInfo(item: Backlog): { tier: string; tierKey: 'top' | 'high' | 'medium' | 'low' } | null {
    if (!item.aiResult?.riceScore) return null;
    const currentScore = item.aiResult.riceScore.total;
    const allScores = backlogStore.all()
      .map(b => b.aiResult?.riceScore?.total)
      .filter((s): s is number => s !== undefined && s !== null);

    if (allScores.length === 0) return null;

    const sorted = [...allScores].sort((a, b) => a - b);
    const beatenCount = sorted.filter(s => s < currentScore).length;
    const ratio = beatenCount / sorted.length;

    if (ratio >= 0.75) return { tier: 'Top Tier', tierKey: 'top' };
    if (ratio >= 0.50) return { tier: 'High', tierKey: 'high' };
    if (ratio >= 0.25) return { tier: 'Medium', tierKey: 'medium' };
    return { tier: 'Low', tierKey: 'low' };
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



  private laneForQuarter(quarter: Quarter): RoadmapLane {
    if (quarter === 'Q2') return 'Now';
    if (quarter === 'Q3') return 'Next';
    return 'Later';
  }
}
