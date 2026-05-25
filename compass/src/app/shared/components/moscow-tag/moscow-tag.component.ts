import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MoSCoW } from '../../../core/models/backlog.model';

@Component({
  selector: 'app-moscow-tag',
  standalone: true,
  imports: [NgClass],
  template: `
    <span [class]="getClass()" class="text-[10px] font-semibold px-2 py-0.5 rounded-full">
      {{ moscow }}
    </span>
  `,
})
export class MoscowTagComponent {
  @Input() moscow: MoSCoW = 'Could Have';

  getClass(): string {
    const classes: Record<MoSCoW, string> = {
      'Must Have': 'bg-blue-100 text-blue-800',
      'Should Have': 'bg-green-100 text-green-800',
      'Could Have': 'bg-yellow-100 text-yellow-800',
      "Won't Have": 'bg-gray-100 text-gray-600',
    };
    return classes[this.moscow];
  }
}
