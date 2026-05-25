import { Injectable } from '@angular/core';
import { Backlog, BacklogStatus } from '../models/backlog.model';
import { backlogStore } from '../stores/backlog.store';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class BacklogService {
  constructor(private toast: ToastService) {}

  addBacklog(backlog: Backlog): void {
    backlogStore.all.update(all => [backlog, ...all]);
    this.toast.show('success', 'Backlog saved to draft');
  }

  updateBacklog(updated: Backlog): void {
    backlogStore.all.update(all =>
      all.map(b => b.id === updated.id ? updated : b)
    );
    this.toast.show('success', 'Changes saved');
  }

  updateStatus(id: string, status: BacklogStatus): void {
    backlogStore.all.update(all =>
      all.map(b => b.id === id ? { ...b, status, updatedAt: new Date() } : b)
    );
  }

  getById(id: string): Backlog | undefined {
    return backlogStore.all().find(b => b.id === id);
  }

  archiveBacklog(id: string): void {
    this.updateStatus(id, 'archived');
    this.toast.show('info', 'Backlog archived');
  }
}
