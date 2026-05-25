import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { SlidePanelComponent } from '../shared/components/slide-panel/slide-panel.component';
import { appStore } from '../core/stores/app.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    BottomNavComponent,
    ToastComponent,
    ModalComponent,
    SlidePanelComponent,
  ],
  template: `
    <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <!-- Sidebar (desktop) -->
      <app-sidebar class="hidden lg:flex flex-shrink-0" />

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-topbar />
        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <router-outlet />
        </main>
        <!-- Bottom nav (mobile) -->
        <app-bottom-nav class="lg:hidden" />
      </div>
    </div>

    <!-- Global overlays -->
    <app-toast />
    <app-modal />
  `,
})
export class LayoutComponent {
  store = appStore;
}
