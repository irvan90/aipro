import { Component, Input } from '@angular/core';

type BadgeType = 'Impact Alert' | 'Recommendation' | 'Planning' | 'AI Draft' | 'AI Scoring' | 'AI Analysis';

@Component({
  selector: 'app-ai-badge',
  standalone: true,
  templateUrl: './ai-badge.component.html',
  styleUrl: './ai-badge.component.scss',
})
export class AiBadgeComponent {
  @Input() type: string = 'Recommendation';
}
