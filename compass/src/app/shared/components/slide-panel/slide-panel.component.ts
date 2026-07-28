import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-panel',
  standalone: true,
  imports: [],
  templateUrl: './slide-panel.component.html',
  styleUrl: './slide-panel.component.scss',
})
export class SlidePanelComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() width = '400px';
  @Output() close = new EventEmitter<void>();
}
