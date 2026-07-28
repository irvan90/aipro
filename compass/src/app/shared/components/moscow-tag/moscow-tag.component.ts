import { Component, Input } from '@angular/core';
import { MoSCoW } from '../../../core/models/backlog.model';

@Component({
  selector: 'app-moscow-tag',
  standalone: true,
  imports: [],
  templateUrl: './moscow-tag.component.html',
  styleUrl: './moscow-tag.component.scss',
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
