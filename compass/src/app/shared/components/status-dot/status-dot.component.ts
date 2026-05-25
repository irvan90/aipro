import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { BacklogStatus } from '../../../core/models/backlog.model';

@Component({
  selector: 'app-status-dot',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="flex items-center gap-1.5">
      <span [class]="getDotClass()" class="w-1.5 h-1.5 rounded-full flex-shrink-0"></span>
      <span class="text-[10px] text-gray-500">{{ getLabel() }}</span>
    </span>
  `,
})
export class StatusDotComponent {
  @Input() status: BacklogStatus = 'draft';

  getDotClass(): string {
    const classes: Record<BacklogStatus, string> = {
      draft: 'bg-gray-400',
      ai_scored: 'bg-bca-primary',
      ready: 'bg-bca-primary',
      not_ready: 'bg-danger',
      submitted: 'bg-success',
      archived: 'bg-gray-300',
    };
    return classes[this.status] ?? 'bg-gray-400';
  }

  getLabel(): string {
    const labels: Record<BacklogStatus, string> = {
      draft: 'Draft',
      ai_scored: 'AI Scored',
      ready: 'Ready',
      not_ready: 'Not Ready',
      submitted: 'Submitted',
      archived: 'Archived',
    };
    return labels[this.status] ?? this.status;
  }
}
