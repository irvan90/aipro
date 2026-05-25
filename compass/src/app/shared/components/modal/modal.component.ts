import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { appStore } from '../../../core/stores/app.store';
import { ModalConfig } from '../../../core/models/ui.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass, NgIf],
  template: `
    @if (store.activeModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4"
           (click)="handleOverlayClick($event)">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <!-- Modal content -->
        <div class="relative bg-white rounded-card shadow-blue-md max-w-md w-full animate-modal-in"
             (click)="$event.stopPropagation()">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  store = appStore;

  handleOverlayClick(event: MouseEvent): void {
    const modal = appStore.activeModal();
    if (!modal) return;
    // Override modals cannot be dismissed by overlay click
    if (modal.type === 'override-ai' || modal.type === 'emergency-flag') return;
    appStore.activeModal.set(null);
  }

  close(): void {
    appStore.activeModal.set(null);
  }
}
