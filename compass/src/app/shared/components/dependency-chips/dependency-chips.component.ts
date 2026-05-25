import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Backlog } from '../../../core/models/backlog.model';
import { backlogStore } from '../../../core/stores/backlog.store';

@Component({
  selector: 'app-dependency-chips',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormsModule, DecimalPipe],
  template: `
    <div class="space-y-2">
      <!-- Search field -->
      <div class="relative">
        <input type="text"
               [(ngModel)]="searchQuery"
               (input)="onSearch()"
               (focus)="showDropdown.set(true)"
               placeholder="Search backlogs..."
               class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary" />

        @if (showDropdown() && filteredBacklogs().length > 0) {
          <div class="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-blue-md max-h-48 overflow-y-auto">
            @for (backlog of filteredBacklogs(); track backlog.id) {
              <button type="button"
                      (click)="addDependency(backlog)"
                      class="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-left transition-colors">
                <span class="text-xs font-semibold text-bca-navy w-4">{{ getRank(backlog) }}</span>
                <span class="flex-1 text-xs text-gray-700 truncate">{{ backlog.title }}</span>
                <span class="text-xs text-gray-400">{{ backlog.aiResult?.riceScore | number }}</span>
                <span class="text-[10px] text-gray-400 ml-1">{{ backlog.targetQuarter }}</span>
              </button>
            }
          </div>
        }
      </div>

      <!-- Selected chips -->
      @if (selectedBacklogs().length > 0) {
        <div class="flex flex-wrap gap-1.5">
          @for (backlog of selectedBacklogs(); track backlog.id) {
            <span [class]="hasConflict(backlog.id) ? 'border-warning bg-warning-bg' : 'border-gray-200 bg-gray-50'"
                  class="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border">
              @if (hasConflict(backlog.id)) {
                <span title="Conflict detected">⚠️</span>
              }
              <span class="text-gray-700 font-medium truncate max-w-[120px]">{{ backlog.title }}</span>
              <button type="button"
                      (click)="removeDependency(backlog.id)"
                      class="text-gray-400 hover:text-danger transition-colors leading-none">✕</button>
            </span>
          }
        </div>
      } @else {
        <p class="text-xs text-gray-400">No dependencies selected</p>
      }
    </div>
  `,
})
export class DependencyChipsComponent {
  @Input() selectedIds: string[] = [];
  @Input() currentBacklogId = '';
  @Output() selectedIdsChange = new EventEmitter<string[]>();

  searchQuery = '';
  showDropdown = signal(false);

  allBacklogs = computed(() => backlogStore.all());

  filteredBacklogs = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.allBacklogs()
      .filter(b =>
        b.id !== this.currentBacklogId &&
        !this.selectedIds.includes(b.id) &&
        (b.title.toLowerCase().includes(q) || !q)
      )
      .slice(0, 8);
  });

  selectedBacklogs = computed(() =>
    this.selectedIds.map(id => this.allBacklogs().find(b => b.id === id)).filter(Boolean) as Backlog[]
  );

  onSearch(): void {
    this.showDropdown.set(true);
  }

  addDependency(backlog: Backlog): void {
    if (!this.selectedIds.includes(backlog.id)) {
      const newIds = [...this.selectedIds, backlog.id];
      this.selectedIdsChange.emit(newIds);
    }
    this.searchQuery = '';
    this.showDropdown.set(false);
  }

  removeDependency(id: string): void {
    this.selectedIdsChange.emit(this.selectedIds.filter(i => i !== id));
  }

  hasConflict(id: string): boolean {
    const backlog = this.allBacklogs().find((b: Backlog) => b.id === id);
    return backlog?.status === 'not_ready' ? true : false;
  }

  getRank(backlog: Backlog): string {
    const sorted = [...this.allBacklogs()]
      .filter(b => b.aiResult)
      .sort((a, b) => (b.aiResult?.riceScore ?? 0) - (a.aiResult?.riceScore ?? 0));
    const rank = sorted.findIndex(b => b.id === backlog.id) + 1;
    return rank > 0 ? `#${rank}` : '-';
  }
}
