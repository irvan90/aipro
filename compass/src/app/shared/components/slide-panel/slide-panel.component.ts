import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-slide-panel',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (isOpen) {
      <!-- Overlay -->
      <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
           (click)="close.emit()"></div>
      <!-- Panel -->
      <div class="fixed right-0 top-0 h-full z-50 bg-white shadow-blue-md flex flex-col"
           [style.width]="width"
           style="animation: slideInRight 250ms var(--ease-out) forwards;">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-900">{{ title }}</h3>
          <button (click)="close.emit()"
                  class="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors">✕</button>
        </div>
        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class SlidePanelComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() width = '400px';
  @Output() close = new EventEmitter<void>();
}
