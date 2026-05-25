import { Component, Input } from '@angular/core';

type BadgeType = 'Impact Alert' | 'Recommendation' | 'Planning' | 'AI Draft' | 'AI Scoring' | 'AI Analysis';

@Component({
  selector: 'app-ai-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[9px] font-bold"
          style="background: linear-gradient(135deg, #083767, #0d5cab)">
      🤖 {{ type }}
    </span>
  `,
})
export class AiBadgeComponent {
  @Input() type: string = 'Recommendation';
}
