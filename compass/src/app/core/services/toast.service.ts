import { Injectable } from '@angular/core';
import { Toast, ToastType } from '../models/ui.model';
import { appStore } from '../stores/app.store';

@Injectable({ providedIn: 'root' })
export class ToastService {
  show(type: ToastType, message: string, duration = 3000): void {
    const toast: Toast = {
      id: Date.now().toString(),
      type,
      message,
      duration,
    };
    appStore.toasts.update(toasts => [...toasts.slice(-2), toast]);
    setTimeout(() => {
      appStore.toasts.update(toasts => toasts.filter(t => t.id !== toast.id));
    }, duration + 400);
  }
}
