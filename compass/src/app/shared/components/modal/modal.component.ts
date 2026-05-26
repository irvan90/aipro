import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { appStore } from '../../../core/stores/app.store';
import { ModalConfig } from '../../../core/models/ui.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
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
