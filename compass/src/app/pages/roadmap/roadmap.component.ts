import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { backlogStore } from '../../core/stores/backlog.store';
import { roadmapStore } from '../../core/stores/roadmap.store';
import { ToastService } from '../../core/services/toast.service';
import { ActivityService } from '../../core/services/activity.service';
import { Backlog } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { RiceScoreComponent } from '../../shared/components/rice-score/rice-score.component';

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
  imports: [CommonModule, RouterModule, DragDropModule, MoscowTagComponent, RiceScoreComponent],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent implements OnInit {
  viewMode = roadmapStore.viewMode;
  readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

  quarterMap       = signal<Record<string, Backlog[]>>({ Q1: [], Q2: [], Q3: [], Q4: [] });
  unplannedBacklogs = signal<Backlog[]>([]);

  // Per-quarter state (shadow mode)
  quarterLocked    = signal<Record<string, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false });
  quarterSubmitted = signal<Record<string, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false });

  showImpactModal  = signal(false);
  pendingMove      = signal<{ backlog: Backlog; fromQuarter: string | null; toQuarter: string } | null>(null);
  pendingDropEvent = signal<CdkDragDrop<Backlog[]> | null>(null);

  readonly connectedLists = ['quarter-Q1', 'quarter-Q2', 'quarter-Q3', 'quarter-Q4', 'unplanned-pool'];

  today = new Date();

  readyCount = computed(() =>
    this.quarterMap()['Q3'].filter(b => b.status === 'ready' || b.status === 'ai_scored').length
  );
  q3Count          = computed(() => this.quarterMap()['Q3'].length);
  readinessPercent = computed(() => {
    const t = this.q3Count();
    return t === 0 ? 0 : Math.round((this.readyCount() / t) * 100);
  });
  readinessChecklist = computed(() => {
    const q3 = this.quarterMap()['Q3'];
    return [
      { label: 'AI scored items',         met: q3.filter(b => b.aiResult).length === q3.length },
      { label: 'MoSCoW assigned',         met: q3.filter(b => b.aiResult?.moscow).length === q3.length },
      { label: 'No dependency conflicts', met: q3.filter(b => b.status === 'not_ready').length === 0 },
      { label: 'Completeness ≥ 75%',      met: q3.filter(b => b.completenessScore < 75).length === 0 },
    ];
  });

  submittedCount = computed(() => Object.values(this.quarterSubmitted()).filter(Boolean).length);

  constructor(private toastService: ToastService, private activityService: ActivityService) {}

  ngOnInit(): void {
    const map: Record<string, Backlog[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
    const unplanned: Backlog[] = [];
    for (const b of backlogStore.all()) {
      if (b.targetQuarter && b.targetQuarter in map) map[b.targetQuarter].push(b);
      else unplanned.push(b);
    }
    this.quarterMap.set(map);
    this.unplannedBacklogs.set(unplanned);

    // Auto-lock/submit quarters whose deadline has already passed
    for (const q of this.quarters) {
      if (this.isQuarterExpired(q)) {
        this.quarterLocked.update(m => ({ ...m, [q]: true }));
        this.quarterSubmitted.update(m => ({ ...m, [q]: true }));
      }
    }
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

  // ── Per-quarter state ─────────────────────────────────────────────────────

  getQuarterBacklogs(q: string): Backlog[] { return this.quarterMap()[q]; }
  getQuarterCount(q: string): number        { return this.quarterMap()[q].length; }

  isQuarterLocked(q: string): boolean    { return this.quarterLocked()[q]; }
  isQuarterSubmitted(q: string): boolean { return this.quarterSubmitted()[q]; }

  isQuarterEditable(q: string): boolean {
    return this.viewMode() === 'shadow'
      && !this.isQuarterLocked(q)
      && !this.isQuarterSubmitted(q);
  }

  canRevertToDraft(q: string): boolean {
    return this.isQuarterSubmitted(q);
  }

  // ── Quarter actions ───────────────────────────────────────────────────────

  lockQuarter(q: string): void {
    this.quarterLocked.update(m => ({ ...m, [q]: true }));
    this.activityService.log({
      type: 'quarter_locked',
      description: `${q} locked for review`,
      metadata: { quarter: q },
    });
    this.toastService.show('info', `${q} locked — ready to submit to Final`);
  }

  unlockQuarter(q: string): void {
    this.quarterLocked.update(m => ({ ...m, [q]: false }));
    this.activityService.log({
      type: 'quarter_unlocked',
      description: `${q} unlocked for editing`,
      metadata: { quarter: q },
    });
    this.toastService.show('info', `${q} unlocked`);
  }

  submitQuarterToFinal(q: string): void {
    this.quarterSubmitted.update(m => ({ ...m, [q]: true }));
    this.activityService.log({
      type: 'quarter_submitted',
      description: `${q} submitted to Final Roadmap`,
      metadata: { quarter: q },
    });
    this.toastService.show('success', `${q} submitted to Final Roadmap!`);
  }

  revertToDraft(q: string): void {
    this.quarterSubmitted.update(m => ({ ...m, [q]: false }));
    this.quarterLocked.update(m => ({ ...m, [q]: false }));
    this.viewMode.set('shadow');
    this.activityService.log({
      type: 'quarter_reverted',
      description: `${q} reverted to draft`,
      metadata: { quarter: q },
    });
    this.toastService.show('info', `${q} reverted to draft — make your changes in Shadow mode`);
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
    } else {
      this.executeMove(event, toQuarter, fromQuarter);
    }
  }

  onDropToUnplanned(event: CdkDragDrop<Backlog[]>): void {
    if (event.previousContainer === event.container || this.viewMode() === 'final') return;
    const backlog: Backlog = event.item.data;
    const fromId = event.previousContainer.id.replace('quarter-', '');
    if (this.quarters.includes(fromId as any)) {
      const map = { ...this.quarterMap() };
      map[fromId] = map[fromId].filter(b => b.id !== backlog.id);
      this.quarterMap.set(map);
      this.unplannedBacklogs.set([...this.unplannedBacklogs(), backlog]);
      this.toastService.show('info', `${backlog.title} moved to Unplanned`);
    }
  }

  confirmDrop(): void {
    const ev = this.pendingDropEvent();
    const mv = this.pendingMove();
    if (ev && mv) this.executeMove(ev, mv.toQuarter, mv.fromQuarter);
    this.showImpactModal.set(false);
    this.pendingMove.set(null);
    this.pendingDropEvent.set(null);
  }

  cancelDrop(): void {
    this.showImpactModal.set(false);
    this.pendingMove.set(null);
    this.pendingDropEvent.set(null);
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
}
