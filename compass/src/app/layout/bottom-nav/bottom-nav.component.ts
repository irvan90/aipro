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
    { label: 'Roadmap', route: '/roadmap', icon: '◫', exact: false },
    { label: 'Audit', route: '/audit-trail', icon: '📋', exact: false },
  ];
}
