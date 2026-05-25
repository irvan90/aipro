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
  template: `
    <div class="p-6 space-y-6 animate-fade-up">
      <!-- Header with View Toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Roadmap Planning</h1>
          <p class="text-sm text-gray-500 mt-1">Drag & drop backlogs between quarters to plan your roadmap</p>
        </div>
        <!-- Shadow / Final Toggle -->
        <div class="flex items-center bg-gray-100 rounded-xl p-1 gap-1 w-fit">
          <button
            (click)="viewMode.set('shadow')"
            [class]="viewMode() === 'shadow'
              ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-white text-bca-primary shadow-sm transition-all'
              : 'px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-all'">
            Shadow Roadmap
          </button>
          <button
            (click)="viewMode.set('final')"
            [class]="viewMode() === 'final'
              ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-white text-bca-primary shadow-sm transition-all'
              : 'px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-all'">
            Final Roadmap
          </button>
        </div>
      </div>

      <!-- View Mode Badge -->
      @if (viewMode() === 'shadow') {
        <div class="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 w-fit">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Shadow mode — changes here don't affect the final roadmap until promoted
        </div>
      } @else {
        <div class="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2 w-fit">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Final mode — this is the committed roadmap submitted to PMO
        </div>
      }

      <!-- Quarter Swimlanes -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        @for (quarter of quarters; track quarter) {
          <div class="flex flex-col">
            <!-- Quarter Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div [class]="getQuarterHeaderClass(quarter)">
                  {{ quarter }}
                </div>
                <span class="text-xs text-gray-500">{{ getQuarterCount(quarter) }} items</span>
              </div>
              @if (quarter === 'Q3' && viewMode() === 'final') {
                <span class="text-xs font-medium text-bca-primary bg-bca-accent px-2 py-0.5 rounded-full">
                  Current
                </span>
              }
            </div>

            <!-- Drop Zone -->
            <div
              cdkDropList
              [id]="'quarter-' + quarter"
              [cdkDropListData]="getQuarterBacklogs(quarter)"
              [cdkDropListConnectedTo]="connectedLists"
              (cdkDropListDropped)="onDrop($event, quarter)"
              [class]="getDropZoneClass(quarter)"
              class="flex-1 min-h-48 rounded-xl p-3 space-y-2 transition-colors">
              @for (backlog of getQuarterBacklogs(quarter); track backlog.id) {
                <div
                  cdkDrag
                  [cdkDragData]="backlog"
                  class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group">
                  <!-- RICE Level Left Border -->
                  <div class="flex">
                    <div [class]="getRiceBorderClass(backlog)" class="w-1 rounded-l-xl flex-shrink-0"></div>
                    <div class="flex-1 p-3">
                      <div class="flex items-start justify-between gap-2 mb-2">
                        <p class="text-xs font-semibold text-gray-800 line-clamp-2 flex-1">{{ backlog.title }}</p>
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a [routerLink]="['/backlog', backlog.id]"
                            class="w-6 h-6 rounded-lg bg-gray-100 hover:bg-bca-accent flex items-center justify-center">
                            <svg class="w-3 h-3 text-gray-500 hover:text-bca-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <app-moscow-tag [moscow]="backlog.aiResult?.moscow ?? 'Should Have'"></app-moscow-tag>
                        <span class="text-xs font-bold text-gray-600">{{ backlog.aiResult?.riceScore ?? 0 }}</span>
                      </div>
                      @if (backlog.dependency.length > 0) {
                        <div class="mt-2 flex items-center gap-1">
                          <svg class="w-3 h-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                          </svg>
                          <span class="text-xs text-yellow-600">{{ backlog.dependency.length }} dep.</span>
                        </div>
                      }
                    </div>
                  </div>
                  <!-- Drag Placeholder -->
                  <div *cdkDragPlaceholder class="h-16 bg-bca-accent rounded-xl border-2 border-dashed border-bca-primary/40"></div>
                  <!-- Drag Preview -->
                  <div *cdkDragPreview class="bg-white rounded-xl border border-bca-primary shadow-blue p-3 w-48 opacity-90">
                    <p class="text-xs font-semibold text-gray-800 truncate">{{ backlog.title }}</p>
                    <span class="text-xs text-bca-primary font-medium">Moving...</span>
                  </div>
                </div>
              }
              @if (getQuarterBacklogs(quarter).length === 0) {
                <div class="h-full min-h-32 flex flex-col items-center justify-center text-center">
                  <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center mb-2 mx-auto">
                    <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <p class="text-xs text-gray-400">Drop items here</p>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Unplanned Pool -->
      <div class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="text-sm font-semibold text-gray-800">Unplanned Pool</h3>
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ unplannedBacklogs().length }}</span>
          </div>
          <p class="text-xs text-gray-500">Items not yet assigned to a quarter</p>
        </div>
        <div
          cdkDropList
          id="unplanned-pool"
          [cdkDropListData]="unplannedBacklogs()"
          [cdkDropListConnectedTo]="connectedLists"
          (cdkDropListDropped)="onDropToUnplanned($event)"
          class="p-4 min-h-20">
          @if (unplannedBacklogs().length > 0) {
            <div class="flex flex-wrap gap-2">
              @for (backlog of unplannedBacklogs(); track backlog.id) {
                <div
                  cdkDrag
                  [cdkDragData]="backlog"
                  class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 cursor-grab hover:border-bca-primary hover:bg-bca-accent transition-colors">
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span class="text-xs font-medium text-gray-700 max-w-32 truncate">{{ backlog.title }}</span>
                  <span class="text-xs text-gray-400">{{ backlog.aiResult?.riceScore ?? '—' }}</span>
                  <div *cdkDragPlaceholder class="h-8 w-32 bg-bca-accent rounded-xl border-2 border-dashed border-bca-primary/40"></div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-4">
              <p class="text-xs text-gray-400">All backlogs have been assigned to quarters</p>
            </div>
          }
        </div>
      </div>

      <!-- Q3 Submission Readiness -->
      @if (viewMode() === 'final') {
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-semibold text-gray-800">Q3 Submission Readiness</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ readyCount() }} of {{ q3Count() }} items ready for PMO submission</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-bca-primary">{{ readinessPercent() }}%</p>
              <p class="text-xs text-gray-500">Complete</p>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              class="h-full rounded-full transition-all duration-700"
              [class]="readinessPercent() >= 75 ? 'bg-green-500' : readinessPercent() >= 50 ? 'bg-yellow-500' : 'bg-red-400'"
              [style.width.%]="readinessPercent()">
            </div>
          </div>
          <!-- Checklist -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            @for (check of readinessChecklist(); track check.label) {
              <div class="flex items-center gap-2">
                <div [class]="check.met ? 'w-5 h-5 rounded-full bg-green-100 flex items-center justify-center' : 'w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'">
                  @if (check.met) {
                    <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  } @else {
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  }
                </div>
                <span [class]="check.met ? 'text-xs text-gray-700' : 'text-xs text-gray-400'">{{ check.label }}</span>
              </div>
            }
          </div>
          <a routerLink="/pmo-submission"
            class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Go to PMO Submission →
          </a>
        </div>
      }

      <!-- Cross-Quarter Impact Modal -->
      @if (showImpactModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="cancelDrop()"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-in">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-800">Cross-Quarter Move Detected</h3>
                <p class="text-xs text-gray-500">Review potential impact before confirming</p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 mb-4">
              <p class="text-xs font-medium text-gray-600 mb-1">Moving:</p>
              <p class="text-sm font-semibold text-gray-800">{{ pendingMove()?.backlog?.title }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs text-gray-500">{{ pendingMove()?.fromQuarter }}</span>
                <svg class="w-4 h-4 text-bca-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
                <span class="text-xs font-semibold text-bca-primary">{{ pendingMove()?.toQuarter }}</span>
              </div>
            </div>

            <div class="space-y-2 mb-5">
              <div class="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl">
                <div class="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-white text-xs font-bold">!</span>
                </div>
                <p class="text-xs text-yellow-800">Dependencies may be affected. Run Impact Analysis to see full consequences.</p>
              </div>
              @if (pendingMove()?.backlog?.aiResult?.moscow === 'Must Have') {
                <div class="flex items-start gap-2 p-3 bg-red-50 rounded-xl">
                  <div class="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-white text-xs font-bold">!</span>
                  </div>
                  <p class="text-xs text-red-800">This is a Must Have item — moving it may impact critical commitments.</p>
                </div>
              }
            </div>

            <div class="flex gap-3">
              <button (click)="cancelDrop()"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button (click)="confirmDrop()"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors">
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
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
