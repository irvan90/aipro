import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { backlogStore } from '../../core/stores/backlog.store';
import { roadmapStore } from '../../core/stores/roadmap.store';
import { RoadmapService } from '../../core/services/roadmap.service';
import { ToastService } from '../../core/services/toast.service';
import { Backlog, Quarter } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { RiceScoreComponent } from '../../shared/components/rice-score/rice-score.component';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, MoscowTagComponent, StatusDotComponent, RiceScoreComponent],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css',
})
export class RoadmapComponent implements OnInit {
  viewMode = roadmapStore.viewMode;
  readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

  // Local mutable copy of quarter assignments
  quarterMap = signal<Record<string, Backlog[]>>({
    Q1: [], Q2: [], Q3: [], Q4: []
  });

  unplannedBacklogs = signal<Backlog[]>([]);
  showImpactModal = signal(false);
  pendingMove = signal<{ backlog: Backlog; fromQuarter: string | null; toQuarter: string } | null>(null);
  pendingDropEvent = signal<CdkDragDrop<Backlog[]> | null>(null);

  connectedLists = ['quarter-Q1', 'quarter-Q2', 'quarter-Q3', 'quarter-Q4', 'unplanned-pool'];

  readyCount = computed(() => {
    const q3 = this.quarterMap()['Q3'];
    return q3.filter(b => b.status === 'ready' || b.status === 'ai_scored').length;
  });

  q3Count = computed(() => this.quarterMap()['Q3'].length);

  readinessPercent = computed(() => {
    const total = this.q3Count();
    if (total === 0) return 0;
    return Math.round((this.readyCount() / total) * 100);
  });

  readinessChecklist = computed(() => {
    const q3 = this.quarterMap()['Q3'];
    return [
      { label: 'AI scored items', met: q3.filter(b => b.aiResult).length === q3.length },
      { label: 'MoSCoW assigned', met: q3.filter(b => b.aiResult?.moscow).length === q3.length },
      { label: 'No dependency conflicts', met: q3.filter(b => b.status === 'not_ready').length === 0 },
      { label: 'Completeness ≥ 75%', met: q3.filter(b => b.completenessScore < 75).length === 0 },
    ];
  });

  constructor(private roadmapService: RoadmapService, private toastService: ToastService) {}

  ngOnInit() {
    const all = backlogStore.all();
    const map: Record<string, Backlog[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
    const unplanned: Backlog[] = [];
    for (const b of all) {
      if (b.targetQuarter && (b.targetQuarter in map)) {
        map[b.targetQuarter].push(b);
      } else {
        unplanned.push(b);
      }
    }
    this.quarterMap.set(map);
    this.unplannedBacklogs.set(unplanned);
  }

  getQuarterBacklogs(quarter: string): Backlog[] {
    return this.quarterMap()[quarter];
  }

  getQuarterCount(quarter: string): number {
    return this.quarterMap()[quarter].length;
  }

  onDrop(event: CdkDragDrop<Backlog[]>, toQuarter: string) {
    if (event.previousContainer === event.container) {
      const map = { ...this.quarterMap() };
      const arr = [...map[toQuarter]];
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
      map[toQuarter] = arr;
      this.quarterMap.set(map);
      return;
    }

    const backlog: Backlog = event.item.data;
    const fromQuarterId = event.previousContainer.id.replace('quarter-', '');
    const fromQuarter = this.quarters.includes(fromQuarterId as any) ? fromQuarterId : null;

    if (fromQuarter && fromQuarter !== toQuarter) {
      this.pendingMove.set({ backlog, fromQuarter, toQuarter });
      this.pendingDropEvent.set(event);
      this.showImpactModal.set(true);
    } else {
      this.executeMove(event, toQuarter, fromQuarter);
    }
  }

  onDropToUnplanned(event: CdkDragDrop<Backlog[]>) {
    if (event.previousContainer === event.container) return;
    const backlog: Backlog = event.item.data;
    const fromQuarterId = event.previousContainer.id.replace('quarter-', '');
    if (this.quarters.includes(fromQuarterId as any)) {
      const map = { ...this.quarterMap() };
      map[fromQuarterId] = map[fromQuarterId].filter(b => b.id !== backlog.id);
      this.quarterMap.set(map);
      this.unplannedBacklogs.set([...this.unplannedBacklogs(), backlog]);
      this.toastService.show('info', `${backlog.title} moved to Unplanned Pool`);
    }
  }

  confirmDrop() {
    const event = this.pendingDropEvent();
    const move = this.pendingMove();
    if (event && move) {
      this.executeMove(event, move.toQuarter, move.fromQuarter);
    }
    this.showImpactModal.set(false);
    this.pendingMove.set(null);
    this.pendingDropEvent.set(null);
  }

  cancelDrop() {
    this.showImpactModal.set(false);
    this.pendingMove.set(null);
    this.pendingDropEvent.set(null);
  }

  private executeMove(event: CdkDragDrop<Backlog[]>, toQuarter: string, fromQuarter: string | null) {
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

  getQuarterHeaderClass(quarter: string): string {
    const map: Record<string, string> = {
      Q1: 'px-3 py-1 rounded-lg text-xs font-bold bg-gray-800 text-white',
      Q2: 'px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white',
      Q3: 'px-3 py-1 rounded-lg text-xs font-bold bg-bca-primary text-white',
      Q4: 'px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white',
    };
    return map[quarter];
  }

  getDropZoneClass(quarter: string): string {
    return quarter === 'Q3'
      ? 'border-2 border-dashed border-bca-primary/20 bg-bca-accent/30'
      : 'border-2 border-dashed border-gray-200 bg-gray-50/50';
  }

  getRiceBorderClass(backlog: Backlog): string {
    const score = backlog.aiResult?.riceScore ?? 0;
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-blue-500';
    if (score >= 25) return 'bg-yellow-400';
    return 'bg-gray-300';
  }
}
