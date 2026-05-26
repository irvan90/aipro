import { Injectable, signal } from '@angular/core';
import { Quarter } from '../models/backlog.model';
import { ToastService } from './toast.service';
import { ActivityService } from './activity.service';
import { RoadmapService } from './roadmap.service';

export interface PMOComment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: Date;
  isPO: boolean;
}

const INITIAL_COMMENTS: Record<string, PMOComment[]> = {
  Q1: [],
  Q2: [],
  Q3: [
    {
      id: 'c-001',
      author: 'Budi Santoso',
      role: 'PO',
      content: 'Q3 2026 roadmap submitted for review.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isPO: true,
    },
    {
      id: 'c-002',
      author: 'Anton Wijaya',
      role: 'PMO',
      content: 'Noted. Please coordinate Login Biometrik with Security team before sprint starts.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isPO: false,
    },
  ],
  Q4: [],
};

@Injectable({ providedIn: 'root' })
export class PmoService {
  quarterComments = signal<Record<string, PMOComment[]>>({ ...INITIAL_COMMENTS });
  quarterSubmitted = signal<Record<string, boolean>>({ Q1: false, Q2: false, Q3: false, Q4: false });

  constructor(
    private toast: ToastService,
    private activityService: ActivityService,
    private roadmapService: RoadmapService,
  ) {}

  getComments(quarter: string): PMOComment[] {
    return this.quarterComments()[quarter] ?? [];
  }

  sendComment(quarter: string, content: string, authorName = 'Budi Santoso', authorRole = 'PO', isPO = true): void {
    const comment: PMOComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      role: authorRole,
      content,
      timestamp: new Date(),
      isPO,
    };
    this.quarterComments.update(qc => ({
      ...qc,
      [quarter]: [...(qc[quarter] ?? []), comment],
    }));
    this.toast.show('success', 'Reply sent');
  }

  submitQuarter(quarter: Quarter): void {
    this.quarterSubmitted.update(qs => ({ ...qs, [quarter]: true }));
    this.roadmapService.submitQuarter(quarter);
    this.activityService.log({
      type: 'submission',
      description: `${quarter} roadmap submitted to PMO`,
      metadata: { quarter },
    });
  }
}
