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
  template: `
    <div class="border-l-4 border-bca-primary pl-4 py-3">
      <div class="flex items-start gap-2 mb-2">
        <app-ai-badge [type]="insight.type" />
      </div>
      <h4 class="text-xs font-semibold text-gray-900 mb-1">{{ insight.title }}</h4>
      <p class="text-[11px] text-gray-500 leading-relaxed mb-2">{{ insight.body }}</p>
      <div class="flex flex-wrap gap-1 mb-3">
        @for (chip of insight.chips; track chip.label) {
          <span [class]="getChipClass(chip.color)"
                class="text-[10px] font-medium px-2 py-0.5 rounded-full">
            {{ chip.label }}
          </span>
        }
      </div>
      <a [routerLink]="insight.actionRoute"
         class="block w-full text-center py-2 px-3 text-xs font-semibold text-bca-primary border border-bca-primary rounded-btn hover:bg-bca-accent transition-colors duration-120">
        {{ insight.actionLabel }}
      </a>
    </div>
  `,
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
