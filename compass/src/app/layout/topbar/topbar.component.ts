import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { appStore } from '../../core/stores/app.store';
import { backlogStore } from '../../core/stores/backlog.store';
import { roadmapStore } from '../../core/stores/roadmap.store';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  store = appStore;
  unreadCount = computed(() => appStore.unreadCount());

  constructor(private toast: ToastService) {}

  toggleNotifications(): void {
    appStore.showNotificationPanel.update(v => !v);
  }

  closeNotifications(): void {
    appStore.showNotificationPanel.set(false);
  }

  markAllRead(): void {
    appStore.notifications.update(notifs => notifs.map(n => ({ ...n, isRead: true })));
    this.toast.show('success', 'All notifications marked as read');
  }

  handleNotifClick(notif: any): void {
    appStore.notifications.update(notifs =>
      notifs.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
    );
    this.closeNotifications();
  }

  getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
      ai_scored: '🤖',
      deadline: '⏰',
      pmo_comment: '💬',
      dependency_conflict: '⚠️',
      emergency_approval: '🚨',
      submission_confirmed: '✅',
    };
    return icons[type] ?? '🔔';
  }

  getNotifIconBg(type: string): string {
    const bgs: Record<string, string> = {
      ai_scored: 'bg-bca-accent',
      deadline: 'bg-warning-bg',
      pmo_comment: 'bg-purple-bg',
      dependency_conflict: 'bg-danger-bg',
      emergency_approval: 'bg-danger-bg',
      submission_confirmed: 'bg-success-bg',
    };
    return bgs[type] ?? 'bg-gray-100';
  }

  getRelativeTime(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
