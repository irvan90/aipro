import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

export interface PMOComment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: Date;
  isPO: boolean;
}

@Injectable({ providedIn: 'root' })
export class PmoService {
  comments = [
    {
      id: 'c-001',
      author: 'Budi Santoso',
      role: 'PO',
      content: 'Q3 2025 roadmap submitted for review.',
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
  ];

  constructor(private toast: ToastService) {}

  sendComment(content: string): void {
    this.comments.push({
      id: `c-${Date.now()}`,
      author: 'Budi Santoso',
      role: 'PO',
      content,
      timestamp: new Date(),
      isPO: true,
    });
    this.toast.show('success', 'Reply sent');
  }
}
