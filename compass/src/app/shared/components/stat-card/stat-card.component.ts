import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
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
