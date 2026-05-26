import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { appStore } from '../../../core/stores/app.store';
import { Toast } from '../../../core/models/ui.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  store = appStore;

  getToastClass(toast: Toast): string {
    const classes: Record<string, string> = {
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      error: 'bg-danger text-white',
      info: 'bg-bca-primary text-white',
    };
    return classes[toast.type] ?? 'bg-gray-800 text-white';
  }

  getToastIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
    };
    return icons[type] ?? '🔔';
  }
}
