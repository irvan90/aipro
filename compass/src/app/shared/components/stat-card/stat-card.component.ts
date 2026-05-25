import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="bg-white rounded-card border border-gray-200 p-4 cursor-pointer hover:shadow-blue-sm transition-shadow duration-200 relative overflow-hidden"
         (click)="onClick()">
      <div class="absolute top-0 left-0 right-0 h-0.5" [class]="accentClass"></div>
      <div class="text-xs font-medium text-gray-500 mb-2">{{ label }}</div>
      <div class="text-2xl font-bold text-gray-900 mb-1">{{ value }}</div>
      <div class="text-xs text-gray-400">{{ sub }}</div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = 0;
  @Input() sub = '';
  @Input() accentClass = 'bg-bca-primary';
  @Input() clickAction?: () => void;

  onClick(): void {
    this.clickAction?.();
  }
}
