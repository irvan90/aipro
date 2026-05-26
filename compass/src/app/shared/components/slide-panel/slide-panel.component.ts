import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-slide-panel',
  standalone: true,
  imports: [NgClass],
  templateUrl: './slide-panel.component.html',
  styleUrl: './slide-panel.component.scss',
})
export class SlidePanelComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() width = '400px';
  @Output() close = new EventEmitter<void>();
}
