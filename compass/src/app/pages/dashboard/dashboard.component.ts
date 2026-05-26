import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { appStore } from '../../core/stores/app.store';
import { backlogStore } from '../../core/stores/backlog.store';
import { roadmapStore } from '../../core/stores/roadmap.store';
import { MOCK_ACTIVITIES } from '../../core/services/mock-data.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { AiInsightCardComponent, AIInsight } from '../../shared/components/ai-insight-card/ai-insight-card.component';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, NgClass, NgFor, NgIf, DecimalPipe,
    StatCardComponent, AiInsightCardComponent,
    MoscowTagComponent, StatusDotComponent, RelativeTimePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  backlog = backlogStore;
  store = appStore;
  roadmap = roadmapStore;
  activities = MOCK_ACTIVITIES;

  topBacklogs = computed(() =>
    [...backlogStore.all()]
      .filter(b => b.aiResult)
      .sort((a, b) => (b.aiResult?.riceScore ?? 0) - (a.aiResult?.riceScore ?? 0))
      .slice(0, 5)
  );

  maxRice = computed(() => backlogStore.maxRiceScore());
  readyCount = computed(() => roadmapStore.readyCount());
  totalQ3 = computed(() => roadmapStore.totalQ3Count());
  submissionPct = computed(() => roadmapStore.submissionReadiness());
  roadmapQuarters = computed(() => roadmapStore.quarters());

  aiInsights: AIInsight[] = [
    {
      type: 'Impact Alert',
      title: 'QRIS Retry dependency may delay Login Biometrik',
      body: 'Login Biometrik depends on Identity Service v2 which is at risk if QRIS Retry moves to Q4.',
      chips: [{ label: 'Revenue Risk', color: 'danger' }, { label: 'Q3', color: 'info' }],
      actionLabel: 'Lihat Impact Analysis →',
      actionRoute: '/impact-analysis',
    },
    {
      type: 'Recommendation',
      title: 'OTP Compliance needs completion before scoring',
      body: 'OTP Compliance backlog is at 45% completeness. Add supporting evidence to enable AI scoring.',
      chips: [{ label: 'Completeness: 45%', color: 'warning' }, { label: 'Compliance', color: 'info' }],
      actionLabel: 'Lengkapi Sekarang →',
      actionRoute: '/backlog/bl-006',
    },
    {
      type: 'Planning',
      title: '3 backlogs not ready for Q3 submission',
      body: 'Q3 submission readiness is 75%. Review remaining backlogs to meet PMO deadline.',
      chips: [{ label: '18 days left', color: 'warning' }, { label: 'Q3', color: 'info' }],
      actionLabel: 'Review Roadmap →',
      actionRoute: '/roadmap',
    },
  ];

  getBacklogTitle(id: string): string {
    const b = backlogStore.all().find(bl => bl.id === id);
    return b?.title?.split(' ').slice(0, 3).join(' ') ?? id;
  }

  getChipClass(status: string): string {
    return status === 'completed' || status === 'submitted'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-600';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'bg-success-bg text-success',
      submitted: 'bg-success-bg text-success',
      draft: 'bg-warning-bg text-warning',
      shadow: 'bg-gray-100 text-gray-500',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-500';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: '✅ Final',
      submitted: '✅ Submitted',
      draft: '⏳ Draft',
      shadow: '💭 Shadow',
    };
    return labels[status] ?? status;
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      ai_scored: '🤖',
      human_override: '👤',
      dependency_conflict: '⚠️',
      backlog_added: '➕',
      prd_generated: '📄',
      submission: '📤',
      warning: '⚠️',
    };
    return icons[type] ?? '📋';
  }

  getActivityIconBg(type: string): string {
    const bgs: Record<string, string> = {
      ai_scored: 'bg-bca-accent',
      human_override: 'bg-success-bg',
      dependency_conflict: 'bg-warning-bg',
      backlog_added: 'bg-gray-100',
      prd_generated: 'bg-purple-bg',
      submission: 'bg-purple-bg',
      warning: 'bg-warning-bg',
    };
    return bgs[type] ?? 'bg-gray-100';
  }
}
