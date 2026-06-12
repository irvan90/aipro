import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { appStore } from '../../core/stores/app.store';
import { backlogStore } from '../../core/stores/backlog.store';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
  badgeType?: 'count' | 'alert';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgFor, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  store = appStore;
  newBacklogCount = computed(() => backlogStore.newFromMyService().length);
  showProductDropdown = signal(false);

  mainNavItems = computed<NavItem[]>(() => [
    { label: 'Dashboard', route: '/dashboard', icon: '⊞', badge: this.newBacklogCount() || undefined, badgeType: 'count' },
    { label: 'Roadmap', route: '/roadmap', icon: '◫' },
  ]);

  mgmtNavItems: NavItem[] = [
    { label: 'Team & Members', route: '/team-members', icon: '👥' },
    { label: 'Product Context', route: '/product-context', icon: '⚙️' },
    { label: 'Audit Trail', route: '/audit-trail', icon: '📋' },
  ];

  toggleProductDropdown(): void {
    this.showProductDropdown.update(v => !v);
  }

  switchProduct(productId: string): void {
    const product = this.store.products().find(p => p.id === productId);
    if (product) {
      this.store.activeProduct.set(product);
    }
    this.showProductDropdown.set(false);
  }
}
