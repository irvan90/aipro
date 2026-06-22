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
    { label: 'Prioritas', route: '/dashboard', icon: '01', exact: true },
    { label: 'Roadmap', route: '/roadmap', icon: '02', exact: false },
    { label: 'Audit', route: '/audit-trail', icon: 'AT', exact: false },
  ];
}
