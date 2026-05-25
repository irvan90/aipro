import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { appStore } from '../../../core/stores/app.store';
import { Toast } from '../../../core/models/ui.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      @for (toast of store.toasts(); track toast.id) {
        <div [class]="getToastClass(toast)"
             class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-blue-md text-sm font-medium pointer-events-auto animate-toast-in max-w-sm">
          <span class="text-base">{{ getToastIcon(toast.type) }}</span>
          <span class="flex-1">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
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
