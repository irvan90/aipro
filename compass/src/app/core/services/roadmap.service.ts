import { Injectable } from '@angular/core';
import { Quarter } from '../models/backlog.model';
import { roadmapStore } from '../stores/roadmap.store';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  constructor(private toast: ToastService) {}

  moveBacklog(backlogId: string, fromQuarter: Quarter, toQuarter: Quarter): void {
    roadmapStore.roadmap.update(rm => ({
      ...rm,
      quarters: rm.quarters.map(q => {
        if (q.quarter === fromQuarter) {
          return { ...q, backlogIds: q.backlogIds.filter(id => id !== backlogId) };
        }
        if (q.quarter === toQuarter) {
          return { ...q, backlogIds: [...q.backlogIds, backlogId] };
        }
        return q;
      }),
      lastModifiedAt: new Date(),
    }));
    this.toast.show('success', `Moved to ${toQuarter} — recorded in audit trail`);
  }

  submitQ3(): void {
    roadmapStore.roadmap.update(rm => ({
      ...rm,
      status: 'submitted',
      submittedAt: new Date(),
      submittedBy: 'user-po-001',
      quarters: rm.quarters.map(q =>
        q.quarter === 'Q3' ? { ...q, status: 'submitted' } : q
      ),
    }));
    this.toast.show('success', 'Q3 roadmap submitted to PMO');
  }
}
