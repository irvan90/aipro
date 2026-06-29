import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Backlog, BacklogStatus } from '../../core/models/backlog.model';
import { backlogStore } from '../../core/stores/backlog.store';

interface DailyInsight {
  type: 'market' | 'dependency' | 'performance';
  eyebrow: string;
  title: string;
  body: string;
  source: string;
  severity: 'high' | 'medium' | 'info';
  backlogId: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  searchValue = signal('');
  statusFilter = signal<BacklogStatus | 'all'>('all');
  sortBy = signal<'date'>('date');

  allBacklogs = backlogStore.all;
  fromMyService = computed(() => this.allBacklogs().filter(item => item.source === 'myservice'));
  totalCount = computed(() => this.allBacklogs().length);
  doneCount = computed(() => this.allBacklogs().filter(item => item.status === 'delivered' || item.status === 'submitted').length);
  onProgressCount = computed(() => this.totalCount() - this.doneCount());

  filteredBacklogs = computed(() => {
    const query = this.searchValue().trim().toLowerCase();
    const status = this.statusFilter();
    let items = this.allBacklogs().filter(item => {
      const matchesQuery = !query || `${item.title} ${item.description}`.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || item.status === status;
      return matchesQuery && matchesStatus;
    });
    return [...items].sort((a, b) => {
      if (a.status === 'new' && b.status !== 'new') return -1;
      if (a.status !== 'new' && b.status === 'new') return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  });

  dailyInsights: DailyInsight[] = [
    {
      type: 'market', eyebrow: 'Internet signal · High', title: 'Pocket BCA tertinggal dari ekspektasi pasar',
      body: 'Pemantauan fitur publik menemukan pola pocket/goal saving telah digunakan Jenius dan blu. AIPRO merekomendasikan review prioritas.',
      source: 'Public product pages · dipindai hari ini', severity: 'high', backlogId: 'pocket-bca',
    },
    {
      type: 'dependency', eyebrow: 'Dependency monitor · Medium', title: 'Login Biometrik masih memiliki blocker',
      body: 'Identity Service v2 belum siap. Memajukan delivery sekarang berisiko menambah dua sprint rework.',
      source: 'Roadmap dependency graph', severity: 'medium', backlogId: 'login-biometric',
    },
    {
      type: 'performance', eyebrow: 'KPI monitor · Stable', title: 'QRIS Retry masuk fase pemantauan',
      body: 'Backlog sudah delivered. AI akan memantau transaction success rate sebelum dampaknya dinyatakan tercapai.',
      source: 'Product KPI context', severity: 'info', backlogId: 'qris-retry',
    },
  ];

  statusLabel(status: BacklogStatus): string {
    return {
      new: 'New', draft: 'Draft', ai_scored: 'AI Scored', ready: 'Ready', not_ready: 'Not Ready',
      submitted: 'Submitted', archived: 'Archived', delivered: 'Done',
    }[status];
  }

  statusClass(status: BacklogStatus): string {
    if (status === 'delivered' || status === 'submitted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'ai_scored' || status === 'ready') return 'bg-blue-50 text-bca-primary border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  }

  insightClass(severity: DailyInsight['severity']): string {
    return {
      high: 'border-red-200 bg-red-50/60',
      medium: 'border-amber-200 bg-amber-50/60',
      info: 'border-blue-200 bg-blue-50/60',
    }[severity];
  }

  trackByBacklog(_: number, backlog: Backlog): string { return backlog.id; }
}
