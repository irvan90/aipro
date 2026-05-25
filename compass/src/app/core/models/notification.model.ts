export type NotificationType = 'ai_scored' | 'deadline' | 'pmo_comment'
  | 'dependency_conflict' | 'emergency_approval' | 'submission_confirmed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl?: string;
  timestamp: Date;
}
