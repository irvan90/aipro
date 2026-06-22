import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { appStore } from '../../core/stores/app.store';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  store = appStore;
  unreadCount = computed(() => appStore.unreadCount());

  toggleNotifications(): void {
    appStore.showNotificationPanel.update(value => !value);
  }

  markAllRead(): void {
    appStore.notifications.update(items => items.map(item => ({ ...item, isRead: true })));
  }

  markRead(id: string): void {
    appStore.notifications.update(items => items.map(item => item.id === id ? { ...item, isRead: true } : item));
    appStore.showNotificationPanel.set(false);
  }
}
