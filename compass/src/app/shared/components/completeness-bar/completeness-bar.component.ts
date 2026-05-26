import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-completeness-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './completeness-bar.component.html',
  styleUrl: './completeness-bar.component.css',
})
export class CompletenessBarComponent {
  @Input() score = 0;

  getBarClass(): string {
    if (this.score >= 80) return 'bg-success';
    if (this.score >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  getScoreClass(): string {
    if (this.score >= 80) return 'text-success';
    if (this.score >= 50) return 'text-warning';
    return 'text-danger';
  }
}
