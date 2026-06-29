import { vi } from 'vitest';
import { backlogStore } from '../stores/backlog.store';
import { MOCK_BACKLOGS } from './mock-data.service';
import { AiService } from './ai.service';

describe('Pocket BCA demo scoring', () => {
  let service: AiService;

  beforeEach(() => {
    service = new AiService();
    backlogStore.all.set([...MOCK_BACKLOGS]);
    backlogStore.agentStates.set([]);
  });

  afterEach(() => vi.useRealTimers());

  it('keeps the dashboard dataset intentionally limited to four backlogs', () => {
    expect(MOCK_BACKLOGS).toHaveLength(4);
    expect(MOCK_BACKLOGS.map(item => item.id)).toEqual([
      'pocket-bca', 'qris-retry', 'login-biometric', 'dark-mode',
    ]);
  });

  it('promotes Pocket BCA from Low to Must Have with a transparent estimate', () => {
    const pocket = MOCK_BACKLOGS[0];
    expect(pocket.initialPriority).toBe('Low');
    expect(pocket.aiResult?.moscow).toBe('Must Have');
    expect(pocket.opportunityAtRisk?.isDemoEstimate).toBe(true);
    expect(pocket.opportunityAtRisk?.assumptions).toHaveLength(3);
  });

  it('runs exactly three analysis stages and returns the configured result', () => {
    vi.useFakeTimers();
    const pocket = MOCK_BACKLOGS[0];

    service.analyzeBacklog(pocket).subscribe(result => {
      expect(result.moscow).toBe('Must Have');
      expect(result.agentFindings).toHaveLength(3);
    });
    vi.advanceTimersByTime(2800);

    expect(backlogStore.agentStates()).toHaveLength(3);
    expect(backlogStore.agentStates().every(stage => stage.status === 'done')).toBe(true);
  });

  it('returns backlog-specific impact instead of the QRIS scenario', () => {
    vi.useFakeTimers();
    let recommendation = '';

    service.analyzeImpact('login-biometric', 'Later').subscribe(result => {
      recommendation = result.aiRecommendation;
      expect(result.backlogId).toBe('login-biometric');
      expect(result.recommendedAction).toBe('defer');
      expect(result.dependencyImpacts[0].dependencyTitle).toBe('Identity Service v2');
    });
    vi.advanceTimersByTime(1500);

    expect(recommendation).toContain('Identity Service v2');
  });
});
