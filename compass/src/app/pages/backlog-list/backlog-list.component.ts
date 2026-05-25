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
  template: `
    <div class="space-y-4 animate-fade-up">
      <!-- Page header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-gray-900">Backlog</h1>
          <p class="text-xs text-gray-500">myBCA Mobile</p>
        </div>
        <a routerLink="/backlog/new"
           class="flex items-center gap-1.5 px-3 py-2 bg-bca-primary hover:bg-bca-hover text-white text-xs font-semibold rounded-btn transition-colors duration-120">
          + Input Backlog
        </a>
      </div>

      <!-- Filter bar -->
      <div class="bg-white rounded-card border border-gray-200 p-3 flex flex-wrap items-center gap-2">
        <!-- Search -->
        <div class="relative flex-1 min-w-[160px]">
          <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input type="text"
                 [(ngModel)]="searchValue"
                 (ngModelChange)="onSearch($event)"
                 placeholder="Search backlogs..."
                 class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary" />
        </div>

        <!-- Status filter -->
        <select [(ngModel)]="filterStatusValue" (ngModelChange)="onFilterStatus($event)"
                class="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="ai_scored">AI Scored</option>
          <option value="ready">Ready</option>
          <option value="not_ready">Not Ready</option>
          <option value="submitted">Submitted</option>
          <option value="archived">Archived</option>
        </select>

        <!-- MoSCoW filter -->
        <select [(ngModel)]="filterMoscowValue" (ngModelChange)="onFilterMoscow($event)"
                class="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
          <option value="all">All MoSCoW</option>
          <option value="Must Have">Must Have</option>
          <option value="Should Have">Should Have</option>
          <option value="Could Have">Could Have</option>
          <option value="Won't Have">Won't Have</option>
        </select>

        <!-- Quarter filter -->
        <select [(ngModel)]="filterQuarterValue" (ngModelChange)="onFilterQuarter($event)"
                class="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
          <option value="all">All Quarters</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
          <option value="Unplanned">Unplanned</option>
        </select>

        <!-- Sort -->
        <select [(ngModel)]="sortByValue" (ngModelChange)="onSortChange($event)"
                class="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
          <option value="rice">Sort: RICE Score</option>
          <option value="date">Sort: Date Added</option>
          <option value="completeness">Sort: Completeness</option>
        </select>

        @if (hasFilters()) {
          <button (click)="clearFilters()"
                  class="text-xs text-bca-primary hover:underline font-medium px-2 py-2">
            Clear All
          </button>
        }
      </div>

      <!-- Backlog table -->
      <div class="bg-white rounded-card border border-gray-200 overflow-hidden">
        @if (filtered().length > 0) {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 bg-gray-50">
                  <th class="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 w-8">#</th>
                  <th class="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Title</th>
                  <th class="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">MoSCoW</th>
                  <th class="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Status</th>
                  <th class="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">RICE</th>
                  <th class="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Quarter</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                @for (item of filtered(); track item.id; let i = $index) {
                  <tr class="hover:bg-gray-50 transition-colors cursor-pointer group"
                      [routerLink]="['/backlog', item.id]">
                    <td class="px-4 py-3">
                      <div [class]="i < 3 ? 'bg-bca-navy text-white' : 'bg-gray-100 text-gray-500'"
                           class="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold">
                        {{ i + 1 }}
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="text-xs font-semibold text-gray-900 mb-1">{{ item.title }}</div>
                      <div class="flex items-center gap-1.5 flex-wrap">
                        @if (item.isEmergency) {
                          <span class="text-[10px] font-bold px-1.5 py-0.5 bg-danger-bg text-danger rounded">🚨 Emergency</span>
                        }
                        @for (area of item.impactArea.slice(0, 2); track area) {
                          <span class="text-[10px] px-1.5 py-0.5 bg-purple-bg text-purple rounded-full font-medium">{{ area }}</span>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-3 hidden md:table-cell">
                      @if (item.aiResult?.moscow) {
                        <app-moscow-tag [moscow]="item.aiResult!.moscow" />
                      } @else {
                        <span class="text-xs text-gray-400">—</span>
                      }
                    </td>
                    <td class="px-4 py-3 hidden lg:table-cell">
                      <app-status-dot [status]="item.status" />
                    </td>
                    <td class="px-4 py-3 text-right hidden md:table-cell">
                      @if (item.aiResult) {
                        <span class="text-sm font-bold text-bca-navy">{{ item.aiResult.riceScore | number }}</span>
                      } @else {
                        <span class="text-xs text-gray-400">—</span>
                      }
                    </td>
                    <td class="px-4 py-3 hidden lg:table-cell">
                      <span class="text-xs font-medium px-2 py-0.5 bg-bca-accent text-bca-primary rounded-full">
                        {{ item.targetQuarter }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <app-empty-state
            [icon]="hasFilters() ? '🔍' : '📋'"
            [title]="hasFilters() ? 'No backlogs match your filters' : 'No backlogs yet'"
            [description]="hasFilters() ? 'Try adjusting or clearing your filters' : 'Start by adding your first backlog item'">
            @if (hasFilters()) {
              <button (click)="clearFilters()" class="px-4 py-2 text-sm text-bca-primary border border-bca-primary rounded-btn hover:bg-bca-accent transition-colors">
                Clear All Filters
              </button>
            } @else {
              <a routerLink="/backlog/new" class="px-4 py-2 text-sm bg-bca-primary text-white rounded-btn hover:bg-bca-hover transition-colors">
                + Input Backlog
              </a>
            }
          </app-empty-state>
        }
      </div>
    </div>
  `,
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
