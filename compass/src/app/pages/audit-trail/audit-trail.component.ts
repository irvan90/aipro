import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../core/services/activity.service';
import { Activity, ActivityType } from '../../core/models/activity.model';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RelativeTimePipe],
  templateUrl: './audit-trail.component.html',
  styleUrl: './audit-trail.component.scss',
})
export class AuditTrailComponent {
  expandedId = signal<string | null>(null);
  searchQuery = '';
  typeFilter = '';
  dateFilter = '';

  private _filterQuery = signal('');
  private _filterType = signal('');
  private _filterDate = signal('');

  filteredActivities = computed(() => {
    let list = this.activityService.all();
    const q = this._filterQuery();
    const type = this._filterType();
    const date = this._filterDate();
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(a =>
        a.description.toLowerCase().includes(lower) ||
        (a.userName ?? a.actor).toLowerCase().includes(lower) ||
        (a.backlogId?.toLowerCase().includes(lower) ?? false)
      );
    }
    if (type) list = list.filter(a => a.type === type);
    if (date) {
      const now = new Date();
      const cutoff = new Date();
      if (date === 'today') cutoff.setHours(0, 0, 0, 0);
      else if (date === 'week') cutoff.setDate(now.getDate() - 7);
      else if (date === 'month') cutoff.setMonth(now.getMonth() - 1);
      list = list.filter(a => a.timestamp >= cutoff);
    }
    return list;
  });

  stats = computed(() => {
    const all = this.activityService.all();
    return [
      { label: 'Total Events', value: all.length, color: 'text-gray-800' },
      { label: 'AI Actions', value: all.filter(a => a.type === 'ai_scored').length, color: 'text-bca-primary' },
      { label: 'Overrides', value: all.filter(a => a.type === 'human_override').length, color: 'text-yellow-600' },
      { label: 'Roadmap Moves', value: all.filter(a => a.type === 'roadmap_moved').length, color: 'text-green-600' },
    ];
  });

  constructor(private activityService: ActivityService) {}

  filterActivities() {
    this._filterQuery.set(this.searchQuery);
    this._filterType.set(this.typeFilter);
    this._filterDate.set(this.dateFilter);
  }

  toggleExpand(id: string) {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  exportCsv() {
    alert('CSV export would download activity log as .csv file');
  }

  exportPdf() {
    alert('PDF export would download activity log as .pdf file');
  }

  getMetadataEntries(metadata: Record<string, unknown>): { key: string; value: string }[] {
    return Object.entries(metadata).map(([key, value]) => ({ key, value: String(value) }));
  }

  getActivityIconClass(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'bg-blue-100',
      status_changed: 'bg-yellow-100',
      human_override: 'bg-orange-100',
      roadmap_moved: 'bg-purple-100',
      backlog_added: 'bg-bca-accent',
      warning: 'bg-red-100',
      dependency_conflict: 'bg-red-100',
      backlog_delivered: 'bg-green-100',
    };
    return map[type] ?? 'bg-gray-100';
  }

  getActivityIconColor(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'text-blue-500',
      status_changed: 'text-yellow-600',
      human_override: 'text-orange-500',
      roadmap_moved: 'text-purple-500',
      backlog_added: 'text-bca-primary',
      warning: 'text-red-500',
      backlog_delivered: 'text-green-600',
    };
    return map[type] ?? 'text-gray-500';
  }

  getActivityIcon(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2',
      status_changed: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      roadmap_moved: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      human_override: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      backlog_added: 'M12 4v16m8-8H4',
      backlog_delivered: 'M5 13l4 4L19 7',
    };
    return map[type] ?? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }

  getTypeBadgeClass(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700',
      status_changed: 'px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700',
      roadmap_moved: 'px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700',
      human_override: 'px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700',
      backlog_added: 'px-2 py-0.5 rounded-full text-xs font-medium bg-bca-accent text-bca-primary',
      warning: 'px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600',
      backlog_delivered: 'px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
    };
    return map[type] ?? 'px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600';
  }

  formatType(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'AI Scored',
      status_changed: 'Status',
      roadmap_moved: 'Roadmap',
      human_override: 'Override',
      backlog_added: 'Added',
      dependency_conflict: 'Conflict',
      warning: 'Warning',
      backlog_delivered: 'Delivered',
    };
    return map[type] ?? type;
  }
}
