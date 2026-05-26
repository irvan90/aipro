import { Injectable, signal } from '@angular/core';
import { Activity, ActivityType } from '../models/activity.model';
import { appStore } from '../stores/app.store';
import { MOCK_ACTIVITIES } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private _activities = signal<Activity[]>([...MOCK_ACTIVITIES]);
  readonly all = this._activities.asReadonly();

  log(partial: Omit<Activity, 'id' | 'timestamp' | 'productId' | 'actorRole' | 'actor'>): void {
    const user = appStore.currentUser();
    const activity: Activity = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      productId: appStore.activeProduct().id,
      actorRole: user.role,
      actor: user.name,
      ...partial,
    };
    this._activities.update(list => [activity, ...list]);
  }
}
