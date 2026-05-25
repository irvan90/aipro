import { UserRole } from './user.model';

export type ActivityType = 'ai_scored' | 'human_override' | 'dependency_conflict'
  | 'backlog_added' | 'prd_generated' | 'submission' | 'warning'
  | 'status_changed' | 'roadmap_moved' | 'submitted' | 'override' | 'comment';

export interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  actorRole: UserRole;
  userName?: string;
  userRole?: string;
  description: string;
  subDescription?: string;
  backlogId?: string;
  backlogTitle?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  productId: string;
}
