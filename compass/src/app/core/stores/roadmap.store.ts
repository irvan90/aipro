import { signal, computed } from '@angular/core';
import { Roadmap, RoadmapQuarter } from '../models/roadmap.model';
import { Quarter } from '../models/backlog.model';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { MOCK_ROADMAP } from '../services/mock-data.service';

const _roadmap = signal<Roadmap>(MOCK_ROADMAP);
const _quarters = computed<RoadmapQuarter[]>(() => _roadmap().quarters);

export const roadmapStore = {
  roadmap: _roadmap,
  viewMode: signal<'shadow' | 'final'>('shadow'),

  quarters: _quarters,

  isDragging: signal(false),
  draggedBacklogId: signal<string | null>(null),
  dragTargetQuarter: signal<Quarter | null>(null),

  pendingDragImpact: signal<ImpactAnalysisResult | null>(null),
  showDragImpactModal: signal(false),

  submissionReadiness: computed<number>(() => {
    const q3 = _quarters().find((q: RoadmapQuarter) => q.quarter === 'Q3');
    return q3?.submissionReadiness ?? 0;
  }),
  readyCount: computed<number>(() => {
    const q3 = _quarters().find((q: RoadmapQuarter) => q.quarter === 'Q3');
    return q3?.readyCount ?? 0;
  }),
  totalQ3Count: computed<number>(() => {
    const q3 = _quarters().find((q: RoadmapQuarter) => q.quarter === 'Q3');
    return q3?.totalCount ?? 0;
  }),
};
