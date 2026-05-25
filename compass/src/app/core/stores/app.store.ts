import { signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Notification } from '../models/notification.model';
import { Toast, ModalConfig } from '../models/ui.model';
import { MOCK_CURRENT_USER, MOCK_PRODUCTS, MOCK_NOTIFICATIONS } from '../services/mock-data.service';

const _notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

export const appStore = {
  currentUser: signal<User>(MOCK_CURRENT_USER),
  activeProduct: signal<Product>(MOCK_PRODUCTS[0]),
  products: signal<Product[]>(MOCK_PRODUCTS),
  notifications: _notifications,
  unreadCount: computed<number>(() => _notifications().filter((n: Notification) => !n.isRead).length),
  isSidebarOpen: signal(true),
  activeModal: signal<ModalConfig | null>(null),
  toasts: signal<Toast[]>([]),
  showNotificationPanel: signal(false),
};
