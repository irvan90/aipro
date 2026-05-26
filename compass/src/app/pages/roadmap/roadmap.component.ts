import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { backlogStore } from '../../core/stores/backlog.store';
import { roadmapStore } from '../../core/stores/roadmap.store';
import { ToastService } from '../../core/services/toast.service';
import { Backlog } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { RiceScoreComponent } from '../../shared/components/rice-score/rice-score.component';

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

  quarterMap = signal<Record<string, Backlog[]>>({ Q1: [], Q2: [], Q3: [], Q4: [] });
  unplannedBacklogs = signal<Backlog[]>([]);

  // Per-quarter state for Shadow mode
  quarterLocked    = signal<Record<string, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false });
  quarterSubmitted = signal<Record<string, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false });

  showImpactModal  = signal(false);
  pendingMove      = signal<{ backlog: Backlog; fromQuarter: string | null; toQuarter: string } | null>(null);
  pendingDropEvent = signal<CdkDragDrop<Backlog[]> | null>(null);

  readonly connectedLists = ['quarter-Q1', 'quarter-Q2', 'quarter-Q3', 'quarter-Q4', 'unplanned-pool'];

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

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    const map: Record<string, Backlog[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
    const unplanned: Backlog[] = [];
    for (const b of backlogStore.all()) {
      if (b.targetQuarter && b.targetQuarter in map) map[b.targetQuarter].push(b);
      else unplanned.push(b);
    }
    this.quarterMap.set(map);
    this.unplannedBacklogs.set(unplanned);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  getQuarterBacklogs(q: string): Backlog[] { return this.quarterMap()[q]; }
  getQuarterCount(q: string): number        { return this.quarterMap()[q].length; }

  isQuarterLocked(q: string): boolean    { return this.quarterLocked()[q]; }
  isQuarterSubmitted(q: string): boolean { return this.quarterSubmitted()[q]; }

  isQuarterEditable(q: string): boolean {
    return this.viewMode() === 'shadow'
      && !this.isQuarterLocked(q)
      && !this.isQuarterSubmitted(q);
  }

  // ── Quarter state actions ──────────────────────────────────────────────────

  lockQuarter(q: string): void {
    this.quarterLocked.update(m => ({ ...m, [q]: true }));
    this.toastService.show('info', `${q} locked — ready to submit to Final`);
  }

  unlockQuarter(q: string): void {
    this.quarterLocked.update(m => ({ ...m, [q]: false }));
    this.toastService.show('info', `${q} unlocked`);
  }

  submitQuarterToFinal(q: string): void {
    this.quarterSubmitted.update(m => ({ ...m, [q]: true }));
    this.toastService.show('success', `${q} submitted to Final Roadmap!`);
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
    this.toastService.show('success', `Moved to ${toQuarter}`);
  }

  // ── CSS helpers ────────────────────────────────────────────────────────────

  getRiceBorderClass(b: Backlog): string {
    const s = b.aiResult?.riceScore ?? 0;
    if (s >= 80) return 'bg-green-500';
    if (s >= 50) return 'bg-blue-500';
    if (s >= 25) return 'bg-yellow-400';
    return 'bg-gray-300';
  }

  getQuarterBadgeClass(q: string): string {
    const m: Record<string, string> = {
      Q1: 'badge-q1', Q2: 'badge-q2', Q3: 'badge-q3', Q4: 'badge-q4',
    };
    return m[q];
  }
}
