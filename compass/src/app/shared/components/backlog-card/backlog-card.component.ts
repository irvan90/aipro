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
  templateUrl: './backlog-card.component.html',
  styleUrl: './backlog-card.component.css',
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
