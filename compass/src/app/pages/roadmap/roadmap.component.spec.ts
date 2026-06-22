import { vi } from 'vitest';
import { MOCK_BACKLOGS } from '../../core/services/mock-data.service';
import { AiService } from '../../core/services/ai.service';
import { backlogStore } from '../../core/stores/backlog.store';
import { RoadmapComponent } from './roadmap.component';

describe('RoadmapComponent decision flow', () => {
  let component: RoadmapComponent;

  beforeEach(() => {
    backlogStore.all.set(MOCK_BACKLOGS.map(item => ({ ...item })));
    const route = { snapshot: { queryParamMap: { get: () => null } } } as any;
    const toast = { show: vi.fn() } as any;
    component = new RoadmapComponent(route, new AiService(), toast);
  });

  afterEach(() => vi.useRealTimers());

  it('cancel leaves Pocket BCA in Q4', () => {
    vi.useFakeTimers();
    component.reviewRecommendation(backlogStore.all()[0]);
    component.cancelRecommendation();

    expect(backlogStore.all()[0].targetQuarter).toBe('Q4');
    expect(component.showReview()).toBe(false);
  });

  it('accept moves Pocket BCA to Q3 only after the PO decision', () => {
    component.selected.set(backlogStore.all()[0]);
    component.acceptRecommendation();

    expect(backlogStore.all()[0].targetQuarter).toBe('Q3');
    expect(component.decisionApplied()).toBe(true);
  });
});
