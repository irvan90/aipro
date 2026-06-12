import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { backlogStore } from '../../core/stores/backlog.store';
import { ToastService } from '../../core/services/toast.service';
import { ActivityService } from '../../core/services/activity.service';
import { AiService } from '../../core/services/ai.service';
import { Backlog, Quarter } from '../../core/models/backlog.model';
import { ImpactAnalysisResult } from '../../core/models/ai-result.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';

// Quarter boundaries for 2026
const QUARTER_END: Record<string, Date> = {
  Q1: new Date('2026-03-31T23:59:59'),
  Q2: new Date('2026-06-30T23:59:59'),
  Q3: new Date('2026-09-30T23:59:59'),
  Q4: new Date('2026-12-31T23:59:59'),
};

const QUARTER_LABEL: Record<string, string> = {
  Q1: 'Jan – Mar 2026',
  Q2: 'Apr – Jun 2026',
  Q3: 'Jul – Sep 2026',
  Q4: 'Oct – Dec 2026',
};

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, MoscowTagComponent],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent implements OnInit {
  readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

  quarterMap       = signal<Record<string, Backlog[]>>({ Q1: [], Q2: [], Q3: [], Q4: [] });
  unplannedBacklogs = signal<Backlog[]>([]);

  showImpactModal  = signal(false);
  pendingMove      = signal<{ backlog: Backlog; fromQuarter: string | null; toQuarter: string } | null>(null);
  pendingDropEvent = signal<CdkDragDrop<Backlog[]> | null>(null);
  impactLoading    = signal(false);
  dragImpact       = signal<ImpactAnalysisResult | null>(null);
  aiLoadingStep    = backlogStore.aiLoadingStep;
  private impactSub: Subscription | null = null;

  readonly connectedLists = ['quarter-Q1', 'quarter-Q2', 'quarter-Q3', 'quarter-Q4', 'unplanned-pool'];

  today = new Date();

  constructor(
    private toastService: ToastService,
    private activityService: ActivityService,
    private ai: AiService,
  ) {}

  ngOnInit(): void {
    const map: Record<string, Backlog[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
    const unplanned: Backlog[] = [];
    for (const b of backlogStore.all()) {
      if (b.targetQuarter && b.targetQuarter in map) map[b.targetQuarter].push(b);
      else unplanned.push(b);
    }
    this.quarterMap.set(map);
    this.unplannedBacklogs.set(unplanned);
  }

  // ── Quarter metadata ──────────────────────────────────────────────────────

  getQuarterLabel(q: string): string { return QUARTER_LABEL[q] ?? q; }

  isQuarterExpired(q: string): boolean {
    return (QUARTER_END[q] ?? new Date(0)) < this.today;
  }

  isCurrentQuarter(q: string): boolean {
    const end   = QUARTER_END[q] ?? new Date(0);
    const start = new Date(end);
    start.setMonth(start.getMonth() - 3);
    return start <= this.today && this.today <= end;
  }

  getQuarterBacklogs(q: string): Backlog[] { return this.quarterMap()[q]; }
  getQuarterCount(q: string): number        { return this.quarterMap()[q].length; }

  isQuarterEditable(q: string): boolean {
    return !this.isQuarterExpired(q);
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────

  onDrop(event: CdkDragDrop<Backlog[]>, toQuarter: string): void {
    if (!this.isQuarterEditable(toQuarter)) return;

    if (event.previousContainer === event.container) {
      const map = { ...this.quarterMap() };
      const arr = [...map[toQuarter]];
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      map[toQuarter] = arr;
      this.quarterMap.set(map);
      return;
    }

    const backlog: Backlog = event.item.data;
    const fromId     = event.previousContainer.id.replace('quarter-', '');
    const fromQuarter = this.quarters.includes(fromId as any) ? fromId : null;

    if (fromQuarter && fromQuarter !== toQuarter) {
      this.pendingMove.set({ backlog, fromQuarter, toQuarter });
      this.pendingDropEvent.set(event);
      this.showImpactModal.set(true);
      this.runImpactAnalysis(backlog.id, toQuarter as Quarter);
    } else {
      this.executeMove(event, toQuarter, fromQuarter);
    }
  }

  private runImpactAnalysis(backlogId: string, toQuarter: Quarter): void {
    this.impactLoading.set(true);
    this.dragImpact.set(null);
    this.impactSub?.unsubscribe();
    this.impactSub = this.ai.analyzeImpact(backlogId, toQuarter).subscribe(result => {
      this.dragImpact.set(result);
      this.impactLoading.set(false);
    });
  }

  onDropToUnplanned(event: CdkDragDrop<Backlog[]>): void {
    if (event.previousContainer === event.container) return;
    const backlog: Backlog = event.item.data;
    const fromId = event.previousContainer.id.replace('quarter-', '');
    if (this.quarters.includes(fromId as any)) {
      const map = { ...this.quarterMap() };
      map[fromId] = map[fromId].filter(b => b.id !== backlog.id);
      this.quarterMap.set(map);
      this.unplannedBacklogs.set([...this.unplannedBacklogs(), backlog]);
      this.syncQuarterToStore(backlog.id, 'Unplanned');
      this.toastService.show('info', `${backlog.title} moved to Unplanned`);
    }
  }

  confirmDrop(): void {
    const ev = this.pendingDropEvent();
    const mv = this.pendingMove();
    if (ev && mv) this.executeMove(ev, mv.toQuarter, mv.fromQuarter);
    this.resetDropState();
  }

  cancelDrop(): void {
    this.resetDropState();
  }

  private resetDropState(): void {
    this.showImpactModal.set(false);
    this.pendingMove.set(null);
    this.pendingDropEvent.set(null);
    this.impactSub?.unsubscribe();
    this.impactSub = null;
    this.impactLoading.set(false);
    this.dragImpact.set(null);
  }

  private syncQuarterToStore(backlogId: string, quarter: Quarter): void {
    backlogStore.all.update(all => all.map(b =>
      b.id === backlogId ? { ...b, targetQuarter: quarter, updatedAt: new Date() } : b
    ));
  }

  private executeMove(event: CdkDragDrop<Backlog[]>, toQuarter: string, fromQuarter: string | null): void {
    const backlog: Backlog = event.item.data;
    const map = { ...this.quarterMap() };

    if (fromQuarter && (this.quarters as readonly string[]).includes(fromQuarter)) {
      map[fromQuarter] = map[fromQuarter].filter(b => b.id !== backlog.id);
    } else {
      this.unplannedBacklogs.set(this.unplannedBacklogs().filter(b => b.id !== backlog.id));
    }

    const arr = [...map[toQuarter]];
    arr.splice(event.currentIndex, 0, backlog);
    map[toQuarter] = arr;
    this.quarterMap.set(map);
    this.syncQuarterToStore(backlog.id, toQuarter as Quarter);
    this.activityService.log({
      type: 'roadmap_moved',
      description: `"${backlog.title}" moved from ${fromQuarter ?? 'Unplanned'} to ${toQuarter}`,
      backlogId: backlog.id,
      backlogTitle: backlog.title,
      metadata: { from: fromQuarter ?? 'Unplanned', to: toQuarter },
    });
    this.toastService.show('success', `Moved to ${toQuarter}`);
  }

  // ── CSS helpers ────────────────────────────────────────────────────────────

  getRiceBorderClass(b: Backlog): string {
    const s = b.aiResult?.riceScore ?? 0;
    if (s >= 10000) return 'bg-green-500';
    if (s >= 7000)  return 'bg-blue-500';
    if (s >= 4000)  return 'bg-yellow-400';
    return 'bg-gray-300';
  }

  getQuarterBadgeClass(q: string): string {
    const m: Record<string, string> = {
      Q1: 'badge-q1', Q2: 'badge-q2', Q3: 'badge-q3', Q4: 'badge-q4',
    };
    return m[q];
  }

  getSeverityClass(severity: string): string {
    const m: Record<string, string> = {
      high: 'bg-red-50 text-red-800',
      medium: 'bg-yellow-50 text-yellow-800',
      low: 'bg-gray-50 text-gray-600',
    };
    return m[severity] ?? 'bg-gray-50 text-gray-600';
  }
}
