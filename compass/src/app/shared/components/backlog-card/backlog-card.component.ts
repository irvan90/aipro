import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Backlog } from '../../../core/models/backlog.model';
import { MoscowTagComponent } from '../moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../status-dot/status-dot.component';
import { RiceFormatPipe } from '../../pipes/rice-format.pipe';

@Component({
  selector: 'app-backlog-card',
  standalone: true,
  imports: [NgClass, RouterLink, MoscowTagComponent, StatusDotComponent, RiceFormatPipe],
  template: `
    <div [class]="getCardClass()"
         class="roadmap-card bg-white rounded-card border border-gray-200 p-3 hover:shadow-blue-sm transition-shadow duration-200 relative">
      <!-- Left border accent by RICE level -->
      <div [class]="getRiceAccentClass()" class="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-card"></div>

      <!-- Emergency badge -->
      @if (backlog.isEmergency) {
        <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-danger-bg text-danger text-[10px] font-bold rounded-full mb-2">
          🚨 EMERGENCY
        </span>
      }

      <div class="flex items-start justify-between gap-2 ml-1.5">
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-semibold text-gray-900 truncate mb-1.5">{{ backlog.title }}</h4>
          <div class="flex items-center flex-wrap gap-1 mb-2">
            @if (backlog.aiResult?.moscow) {
              <app-moscow-tag [moscow]="backlog.aiResult!.moscow" />
            }
            @for (area of backlog.impactArea.slice(0, 2); track area) {
              <span class="text-[10px] font-medium px-1.5 py-0.5 bg-purple-bg text-purple rounded-full">{{ area }}</span>
            }
          </div>
          <app-status-dot [status]="backlog.status" />
        </div>

        @if (backlog.aiResult) {
          <div class="text-right flex-shrink-0">
            <div class="text-sm font-bold text-bca-navy">{{ backlog.aiResult.riceScore | riceFormat }}</div>
            <div class="text-[9px] text-gray-400 mt-0.5">RICE</div>
          </div>
        }
      </div>

      <!-- Action buttons -->
      @if (showActions) {
        <div class="flex items-center gap-2 mt-2.5 pt-2 border-t border-gray-50">
          <a [routerLink]="['/impact-analysis']" [queryParams]="{backlog: backlog.id}"
             class="flex items-center gap-1 text-[10px] font-semibold text-bca-primary border border-bca-primary/30 px-2 py-1 rounded hover:bg-bca-accent transition-colors">
            ⚡ Impact
          </a>
          <a [routerLink]="['/prd-draft', backlog.id]"
             class="flex items-center gap-1 text-[10px] font-semibold text-gray-600 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
            📄 PRD
          </a>
        </div>
      }
    </div>
  `,
})
export class BacklogCardComponent {
  @Input() backlog!: Backlog;
  @Input() showActions = true;
  @Input() isDraggable = false;

  getCardClass(): string {
    return this.backlog.isEmergency ? 'border-l-danger' : '';
  }

  getRiceAccentClass(): string {
    const score = this.backlog.aiResult?.riceScore ?? 0;
    if (score >= 12000) return 'bg-bca-primary';
    if (score >= 8000) return 'bg-bca-light';
    return 'bg-gray-200';
  }
}
