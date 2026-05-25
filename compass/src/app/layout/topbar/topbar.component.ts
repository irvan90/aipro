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
  template: `
    <header class="flex items-center gap-4 px-4 lg:px-6 h-14 bg-white border-b border-gray-200 flex-shrink-0 z-30">
      <!-- Page title -->
      <div class="flex-1 min-w-0">
        <h1 class="font-bold text-gray-900 text-sm truncate">Dashboard</h1>
        <p class="text-xs text-gray-500 hidden sm:block">{{ store.activeProduct().name }} · Q3 Planning</p>
      </div>

      <!-- Status badges -->
      <div class="hidden md:flex items-center gap-2">
        <span class="flex items-center gap-1.5 px-2.5 py-1 bg-bca-accent text-bca-primary text-[11px] font-semibold rounded-full">
          📅 Q3 Planning
        </span>
        <span class="flex items-center gap-1.5 px-2.5 py-1 bg-warning-bg text-warning text-[11px] font-semibold rounded-full">
          ⏰ 18 days left
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Bell notification -->
        <button (click)="toggleNotifications()"
                class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-120">
          <span class="text-lg">🔔</span>
          @if (unreadCount() > 0) {
            <span class="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          }
        </button>

        <!-- Input Backlog CTA -->
        <a routerLink="/backlog/new"
           class="flex items-center gap-1.5 px-3 py-2 bg-bca-primary hover:bg-bca-hover text-white text-xs font-semibold rounded-btn transition-colors duration-120 shadow-blue-btn whitespace-nowrap">
          <span>+</span>
          <span class="hidden sm:inline">Input Backlog</span>
        </a>
      </div>
    </header>

    <!-- Notification Panel -->
    @if (store.showNotificationPanel()) {
      <div class="fixed inset-0 z-40" (click)="closeNotifications()">
        <div class="absolute right-0 top-14 w-80 bg-white shadow-blue-md rounded-bl-xl border border-gray-200 overflow-hidden"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900 text-sm">Notifications</h3>
            <div class="flex items-center gap-2">
              <button (click)="markAllRead()" class="text-[11px] text-bca-primary hover:underline">Mark all read</button>
              <button (click)="closeNotifications()" class="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>
          </div>
          <div class="max-h-96 overflow-y-auto">
            @for (notif of store.notifications(); track notif.id) {
              <div (click)="handleNotifClick(notif)"
                   [class]="notif.isRead ? 'opacity-60' : ''"
                   class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors">
                <div [class]="getNotifIconBg(notif.type)"
                     class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                  {{ getNotifIcon(notif.type) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <span class="text-xs font-semibold text-gray-900">{{ notif.title }}</span>
                    @if (!notif.isRead) {
                      <span class="w-1.5 h-1.5 bg-bca-primary rounded-full flex-shrink-0"></span>
                    }
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{{ notif.body }}</p>
                  <p class="text-[10px] text-gray-400 mt-1">{{ getRelativeTime(notif.timestamp) }}</p>
                </div>
              </div>
            }
          </div>
          <div class="px-4 py-2 border-t border-gray-100">
            <a routerLink="/audit-trail" (click)="closeNotifications()"
               class="text-[11px] text-bca-primary hover:underline font-medium">View all in Audit Trail →</a>
          </div>
        </div>
      </div>
    }
  `,
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
