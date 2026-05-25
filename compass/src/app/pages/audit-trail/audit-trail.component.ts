import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MOCK_ACTIVITIES } from '../../core/services/mock-data.service';
import { Activity, ActivityType } from '../../core/models/activity.model';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RelativeTimePipe],
  template: `
    <div class="p-6 space-y-6 animate-fade-up">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p class="text-sm text-gray-500 mt-1">Complete history of all changes and AI decisions</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="exportCsv()"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export CSV
          </button>
          <button (click)="exportPdf()"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-bca-primary text-white hover:bg-bca-hover transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
            <input
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterActivities()"
              placeholder="Search activities..."
              class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
          </div>

          <!-- Type Filter -->
          <select
            [(ngModel)]="typeFilter"
            (ngModelChange)="filterActivities()"
            class="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
            <option value="">All Activity Types</option>
            <option value="ai_scored">AI Scored</option>
            <option value="status_changed">Status Changed</option>
            <option value="human_override">Human Override</option>
            <option value="roadmap_moved">Roadmap Move</option>
            <option value="prd_generated">PRD Generated</option>
            <option value="submission">Submitted</option>
            <option value="backlog_added">Backlog Added</option>
            <option value="warning">Warning</option>
          </select>

          <!-- Date Range -->
          <select
            [(ngModel)]="dateFilter"
            (ngModelChange)="filterActivities()"
            class="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        @for (stat of stats(); track stat.label) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p class="text-xl font-bold" [class]="stat.color">{{ stat.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Timeline -->
      <div class="space-y-1">
        @if (filteredActivities().length === 0) {
          <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
            <div class="w-12 h-12 rounded-xl bg-gray-100 mx-auto flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p class="text-sm text-gray-500">No activities match your filters</p>
          </div>
        }
        @for (activity of filteredActivities(); track activity.id; let last = $last) {
          <div class="relative">
            <!-- Timeline connector -->
            @if (!last) {
              <div class="absolute left-[23px] top-10 bottom-0 w-px bg-gray-200 z-0"></div>
            }
            <div class="relative z-10 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div
                class="flex items-start gap-4 p-4 cursor-pointer"
                (click)="toggleExpand(activity.id)">
                <!-- Icon -->
                <div [class]="getActivityIconClass(activity.type)" class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4" [class]="getActivityIconColor(activity.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getActivityIcon(activity.type)"/>
                  </svg>
                </div>
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <p class="text-sm font-semibold text-gray-800">{{ activity.description }}</p>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-500">{{ activity.userName ?? activity.actor }}</span>
                        <span class="text-gray-300">·</span>
                        <span class="text-xs text-gray-400">{{ activity.timestamp | relativeTime }}</span>
                        @if (activity.backlogId) {
                          <span class="text-gray-300">·</span>
                          <a [routerLink]="['/backlog', activity.backlogId]"
                            class="text-xs text-bca-primary hover:underline" (click)="$event.stopPropagation()">
                            {{ activity.backlogId }}
                          </a>
                        }
                      </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <span [class]="getTypeBadgeClass(activity.type)">{{ formatType(activity.type) }}</span>
                      <svg [class]="expandedId() === activity.id ? 'w-4 h-4 text-gray-400 rotate-180' : 'w-4 h-4 text-gray-400'"
                        class="transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Expanded Detail -->
              @if (expandedId() === activity.id) {
                <div class="border-t border-gray-100 px-4 py-4 bg-gray-50 animate-fade-up">
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <p class="text-xs font-medium text-gray-500 mb-1">User</p>
                      <p class="text-sm text-gray-800">{{ activity.userName ?? activity.actor }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 mb-1">Role</p>
                      <p class="text-sm text-gray-800">{{ activity.userRole ?? activity.actorRole }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 mb-1">Timestamp</p>
                      <p class="text-sm text-gray-800">{{ activity.timestamp.toLocaleString('id-ID') }}</p>
                    </div>
                    @if (activity.metadata) {
                      @for (entry of getMetadataEntries(activity.metadata); track entry.key) {
                        <div>
                          <p class="text-xs font-medium text-gray-500 mb-1 capitalize">{{ entry.key }}</p>
                          <p class="text-sm text-gray-800">{{ entry.value }}</p>
                        </div>
                      }
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AuditTrailComponent implements OnInit {
  allActivities = signal<Activity[]>([]);
  filteredActivities = signal<Activity[]>([]);
  expandedId = signal<string | null>(null);
  searchQuery = '';
  typeFilter = '';
  dateFilter = '';

  stats = computed(() => {
    const all = this.allActivities();
    return [
      { label: 'Total Events', value: all.length, color: 'text-gray-800' },
      { label: 'AI Actions', value: all.filter(a => a.type === 'ai_scored' || a.type === 'prd_generated').length, color: 'text-bca-primary' },
      { label: 'Overrides', value: all.filter(a => a.type === 'human_override').length, color: 'text-yellow-600' },
      { label: 'Submissions', value: all.filter(a => a.type === 'submission').length, color: 'text-green-600' },
    ];
  });

  constructor() {}

  ngOnInit() {
    const activities = [...MOCK_ACTIVITIES];
    this.allActivities.set(activities);
    this.filteredActivities.set(activities);
  }

  filterActivities() {
    let list = this.allActivities();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(a =>
        a.description.toLowerCase().includes(q) ||
        (a.userName ?? a.actor).toLowerCase().includes(q) ||
        (a.backlogId?.toLowerCase().includes(q) ?? false)
      );
    }
    if (this.typeFilter) {
      list = list.filter(a => a.type === this.typeFilter);
    }
    if (this.dateFilter) {
      const now = new Date();
      const cutoff = new Date();
      if (this.dateFilter === 'today') cutoff.setHours(0, 0, 0, 0);
      else if (this.dateFilter === 'week') cutoff.setDate(now.getDate() - 7);
      else if (this.dateFilter === 'month') cutoff.setMonth(now.getMonth() - 1);
      list = list.filter(a => a.timestamp >= cutoff);
    }
    this.filteredActivities.set(list);
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
      prd_generated: 'bg-green-100',
      submission: 'bg-teal-100',
      backlog_added: 'bg-bca-accent',
      warning: 'bg-red-100',
      dependency_conflict: 'bg-red-100',
    };
    return map[type] ?? 'bg-gray-100';
  }

  getActivityIconColor(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'text-blue-500',
      status_changed: 'text-yellow-600',
      human_override: 'text-orange-500',
      roadmap_moved: 'text-purple-500',
      prd_generated: 'text-green-600',
      submission: 'text-teal-600',
      backlog_added: 'text-bca-primary',
      warning: 'text-red-500',
    };
    return map[type] ?? 'text-gray-500';
  }

  getActivityIcon(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2',
      status_changed: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      roadmap_moved: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      prd_generated: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      submission: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      human_override: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      backlog_added: 'M12 4v16m8-8H4',
    };
    return map[type] ?? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }

  getTypeBadgeClass(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700',
      status_changed: 'px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700',
      roadmap_moved: 'px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700',
      prd_generated: 'px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
      submission: 'px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700',
      human_override: 'px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700',
      backlog_added: 'px-2 py-0.5 rounded-full text-xs font-medium bg-bca-accent text-bca-primary',
      warning: 'px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600',
    };
    return map[type] ?? 'px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600';
  }

  formatType(type: ActivityType): string {
    const map: Partial<Record<ActivityType, string>> = {
      ai_scored: 'AI Scored',
      status_changed: 'Status',
      roadmap_moved: 'Roadmap',
      prd_generated: 'PRD',
      submission: 'Submitted',
      human_override: 'Override',
      backlog_added: 'Added',
      dependency_conflict: 'Conflict',
      warning: 'Warning',
    };
    return map[type] ?? type;
  }
}
