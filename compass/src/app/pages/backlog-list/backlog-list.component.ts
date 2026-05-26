import { Component, computed, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { backlogStore } from '../../core/stores/backlog.store';
import { BacklogStatus, MoSCoW, Quarter } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-backlog-list',
  standalone: true,
  imports: [RouterLink, NgClass, NgFor, NgIf, DecimalPipe, FormsModule, MoscowTagComponent, StatusDotComponent, EmptyStateComponent],
  templateUrl: './backlog-list.component.html',
  styleUrl: './backlog-list.component.css',
})
export class BacklogListComponent {
  filtered = computed(() => backlogStore.filtered());

  searchValue = '';
  filterStatusValue = 'all';
  filterMoscowValue = 'all';
  filterQuarterValue = 'all';
  sortByValue = 'rice';

  constructor(private toast: ToastService) {}

  onSearch(q: string): void { backlogStore.searchQuery.set(q); }
  onFilterStatus(v: string): void { backlogStore.filterStatus.set(v as any); }
  onFilterMoscow(v: string): void { backlogStore.filterMoscow.set(v as any); }
  onFilterQuarter(v: string): void { backlogStore.filterQuarter.set(v as any); }
  onSortChange(v: string): void { backlogStore.sortBy.set(v as any); }

  hasFilters(): boolean {
    return this.searchValue !== '' ||
      this.filterStatusValue !== 'all' ||
      this.filterMoscowValue !== 'all' ||
      this.filterQuarterValue !== 'all';
  }

  clearFilters(): void {
    this.searchValue = '';
    this.filterStatusValue = 'all';
    this.filterMoscowValue = 'all';
    this.filterQuarterValue = 'all';
    backlogStore.searchQuery.set('');
    backlogStore.filterStatus.set('all');
    backlogStore.filterMoscow.set('all');
    backlogStore.filterQuarter.set('all');
    this.toast.show('info', 'Filters cleared');
  }
}
