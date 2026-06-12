import { signal, computed, Signal } from '@angular/core';
import { AgentFinding, AgentId, Backlog, BacklogStatus, Quarter, MoSCoW } from '../models/backlog.model';
import { AILoadingState, AILoadingStep } from '../models/ui.model';
import { MOCK_BACKLOGS } from '../services/mock-data.service';

export const CURRENT_QUARTER: Quarter = 'Q2';

export interface AgentState {
  agentId: AgentId;
  name: string;
  icon: string;
  status: 'pending' | 'running' | 'done';
  finding?: AgentFinding;
}

const _all = signal<Backlog[]>(MOCK_BACKLOGS);
const _agentStates = signal<AgentState[]>([]);
const _filterStatus = signal<BacklogStatus | 'all'>('all');
const _filterQuarter = signal<Quarter | 'all'>('all');
const _filterMoscow = signal<MoSCoW | 'all'>('all');
const _filterImpactArea = signal<string>('all');
const _searchQuery = signal('');
const _sortBy = signal<'rice' | 'date' | 'completeness'>('rice');
const _aiLoadingState = signal<AILoadingState>('idle');
const _aiLoadingStep = signal<AILoadingStep>('Reading backlog context...');
const _currentAnalyzingId = signal<string | null>(null);
const _selectedBacklogId = signal<string | null>(null);

export const backlogStore = {
  all: _all,
  filterStatus: _filterStatus,
  filterQuarter: _filterQuarter,
  filterMoscow: _filterMoscow,
  filterImpactArea: _filterImpactArea,
  searchQuery: _searchQuery,
  sortBy: _sortBy,

  filtered: computed<Backlog[]>(() => {
    let list: Backlog[] = _all();
    const q = _searchQuery().toLowerCase();
    if (q) {
      list = list.filter((b: Backlog) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    if (_filterStatus() !== 'all') {
      list = list.filter((b: Backlog) => b.status === _filterStatus());
    }
    if (_filterQuarter() !== 'all') {
      list = list.filter((b: Backlog) => b.targetQuarter === _filterQuarter());
    }
    if (_filterMoscow() !== 'all') {
      list = list.filter((b: Backlog) => b.aiResult?.moscow === _filterMoscow());
    }
    if (_filterImpactArea() !== 'all') {
      list = list.filter((b: Backlog) => b.impactArea.includes(_filterImpactArea() as any));
    }
    const sort = _sortBy();
    if (sort === 'rice') {
      list = [...list].sort((a: Backlog, b: Backlog) => (b.aiResult?.riceScore ?? 0) - (a.aiResult?.riceScore ?? 0));
    } else if (sort === 'date') {
      list = [...list].sort((a: Backlog, b: Backlog) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sort === 'completeness') {
      list = [...list].sort((a: Backlog, b: Backlog) => b.completenessScore - a.completenessScore);
    }
    return list;
  }),

  totalCount: computed<number>(() => _all().length),
  scoredCount: computed<number>(() =>
    _all().filter((b: Backlog) => b.status === 'ai_scored' || b.status === 'ready').length
  ),
  newFromMyService: computed<Backlog[]>(() =>
    _all().filter((b: Backlog) => b.status === 'new')
  ),
  ongoingCount: computed<number>(() =>
    _all().filter((b: Backlog) =>
      b.targetQuarter === CURRENT_QUARTER &&
      !['delivered', 'submitted', 'archived'].includes(b.status)
    ).length
  ),
  deliveredCount: computed<number>(() =>
    _all().filter((b: Backlog) => b.status === 'delivered' || b.status === 'submitted').length
  ),
  maxRiceScore: computed<number>(() =>
    Math.max(..._all().map((b: Backlog) => b.aiResult?.riceScore ?? 0), 1)
  ),

  aiLoadingState: _aiLoadingState,
  aiLoadingStep: _aiLoadingStep,
  currentAnalyzingId: _currentAnalyzingId,
  agentStates: _agentStates,

  selectedBacklogId: _selectedBacklogId,
  selectedBacklog: computed<Backlog | null>(() =>
    _all().find((b: Backlog) => b.id === _selectedBacklogId()) ?? null
  ),
};
