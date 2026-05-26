import { Injectable } from '@angular/core';
import { Quarter } from '../models/backlog.model';
import { roadmapStore } from '../stores/roadmap.store';
import { ToastService } from './toast.service';
import { ActivityService } from './activity.service';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  constructor(private toast: ToastService, private activityService: ActivityService) {}

  moveBacklog(backlogId: string, fromQuarter: Quarter | null, toQuarter: Quarter, backlogTitle?: string): void {
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
    this.activityService.log({
      type: 'roadmap_moved',
      description: `"${backlogTitle ?? backlogId}" moved from ${fromQuarter ?? 'Unplanned'} to ${toQuarter}`,
      backlogId,
      backlogTitle,
      metadata: { from: fromQuarter ?? 'Unplanned', to: toQuarter },
    });
    this.toast.show('success', `Moved to ${toQuarter}`);
  }

  submitQuarter(quarter: Quarter): void {
    roadmapStore.roadmap.update(rm => ({
      ...rm,
      lastModifiedAt: new Date(),
      quarters: rm.quarters.map(q =>
        q.quarter === quarter ? { ...q, status: 'submitted' } : q
      ),
    }));
    this.activityService.log({
      type: 'quarter_submitted',
      description: `${quarter} roadmap submitted to PMO`,
      metadata: { quarter },
    });
    this.toast.show('success', `${quarter} roadmap submitted to PMO`);
  }
}
