import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { ModalComponent } from '../shared/components/modal/modal.component';

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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
