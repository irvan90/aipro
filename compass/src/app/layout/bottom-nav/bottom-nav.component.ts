import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-30 lg:hidden">
      @for (item of navItems; track item.route) {
        <a [routerLink]="item.route"
           routerLinkActive="text-bca-primary"
           [routerLinkActiveOptions]="{ exact: item.exact }"
           class="flex flex-col items-center gap-1 py-1 px-3 min-w-[44px] text-gray-400 hover:text-bca-primary transition-colors duration-120">
          <span class="text-xl leading-none">{{ item.icon }}</span>
          <span class="text-[9px] font-semibold">{{ item.label }}</span>
        </a>
      }
    </nav>
    <!-- Spacer to prevent content overlap -->
    <div class="h-16 lg:hidden"></div>
  `,
})
export class BottomNavComponent {
  navItems = [
    { label: 'Home', route: '/dashboard', icon: '⊞', exact: true },
    { label: 'Backlog', route: '/backlog', icon: '☰', exact: false },
    { label: 'Roadmap', route: '/roadmap', icon: '◫', exact: false },
    { label: 'Impact', route: '/impact-analysis', icon: '⚡', exact: false },
    { label: 'PMO', route: '/pmo-submission', icon: '📤', exact: false },
  ];
}
