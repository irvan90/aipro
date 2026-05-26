import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
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
