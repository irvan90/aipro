import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { backlogStore, CURRENT_QUARTER } from '../../core/stores/backlog.store';
import { MOCK_ACTIVITIES } from '../../core/services/mock-data.service';
import { Backlog, valueEffortQuadrant, ValueEffortQuadrantInfo } from '../../core/models/backlog.model';
import { BacklogService } from '../../core/services/backlog.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, DecimalPipe, FormsModule,
    StatCardComponent, MoscowTagComponent, StatusDotComponent,
    EmptyStateComponent, RelativeTimePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  backlog = backlogStore;
  currentQuarter = CURRENT_QUARTER;
  activities = MOCK_ACTIVITIES;

  filtered = computed(() => backlogStore.filtered());
  newFromMyService = computed(() => backlogStore.newFromMyService());
  newInitiators = computed(() =>
    [...new Set(this.newFromMyService().map(b => b.myService?.featureInitiator).filter(Boolean))].join(' · ')
  );

  searchValue = '';
  filterStatusValue = 'all';
  filterQuarterValue = 'all';
  sortByValue = 'rice';

  constructor(private backlogService: BacklogService) {}

  onSearch(q: string): void { backlogStore.searchQuery.set(q); }
  onFilterStatus(v: string): void { backlogStore.filterStatus.set(v as any); }
  onFilterQuarter(v: string): void { backlogStore.filterQuarter.set(v as any); }
  onSortChange(v: string): void { backlogStore.sortBy.set(v as any); }

  hasFilters(): boolean {
    return this.searchValue !== '' ||
      this.filterStatusValue !== 'all' ||
      this.filterQuarterValue !== 'all';
  }

  clearFilters(): void {
    this.searchValue = '';
    this.filterStatusValue = 'all';
    this.filterQuarterValue = 'all';
    backlogStore.searchQuery.set('');
    backlogStore.filterStatus.set('all');
    backlogStore.filterQuarter.set('all');
  }

  showNewBacklogs(): void {
    this.clearFilters();
    this.filterStatusValue = 'new';
    backlogStore.filterStatus.set('new');
  }

  quadrant(b: Backlog): ValueEffortQuadrantInfo | null {
    return b.myService
      ? valueEffortQuadrant(b.myService.valuegraphValue, b.myService.valuegraphEffort)
      : null;
  }

  markDelivered(id: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.backlogService.markDelivered(id);
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      ai_scored: '🤖',
      human_override: '👤',
      dependency_conflict: '⚠️',
      backlog_added: '📥',
      warning: '⚠️',
    };
    return icons[type] ?? '📋';
  }

  getActivityIconBg(type: string): string {
    const bgs: Record<string, string> = {
      ai_scored: 'bg-bca-accent',
      human_override: 'bg-success-bg',
      dependency_conflict: 'bg-warning-bg',
      backlog_added: 'bg-bca-accent',
      warning: 'bg-warning-bg',
    };
    return bgs[type] ?? 'bg-gray-100';
  }
}
