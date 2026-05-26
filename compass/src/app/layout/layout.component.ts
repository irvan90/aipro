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
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  store = appStore;
}
