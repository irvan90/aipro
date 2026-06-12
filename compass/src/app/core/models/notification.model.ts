export type NotificationType = 'ai_scored' | 'deadline' | 'myservice_new'
  | 'dependency_conflict' | 'emergency_approval';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl?: string;
  timestamp: Date;
}
