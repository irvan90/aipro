import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { AiBadgeComponent } from '../ai-badge/ai-badge.component';
import { RouterLink } from '@angular/router';

export interface AIInsight {
  type: 'Impact Alert' | 'Recommendation' | 'Planning';
  title: string;
  body: string;
  chips: { label: string; color: 'danger' | 'warning' | 'info' }[];
  actionLabel: string;
  actionRoute: string;
}

@Component({
  selector: 'app-ai-insight-card',
  standalone: true,
  imports: [NgFor, AiBadgeComponent, RouterLink],
  templateUrl: './ai-insight-card.component.html',
  styleUrl: './ai-insight-card.component.css',
})
export class AiInsightCardComponent {
  @Input() insight!: AIInsight;

  getChipClass(color: string): string {
    const classes: Record<string, string> = {
      danger: 'bg-danger-bg text-danger',
      warning: 'bg-warning-bg text-warning',
      info: 'bg-bca-accent text-bca-primary',
    };
    return classes[color] ?? 'bg-gray-100 text-gray-600';
  }
}
