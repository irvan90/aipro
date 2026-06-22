import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AgentFinding, AIResult, Backlog, Quarter, RoadmapLane } from '../models/backlog.model';
import { backlogStore } from '../stores/backlog.store';
import { AGENT_DEFINITIONS, MOCK_IMPACT_RESULTS } from './mock-data.service';

const STEP_MS = 400;

@Injectable({ providedIn: 'root' })
export class AiService {
  analyzeBacklog(backlog: Backlog): Observable<AIResult> {
    return new Observable(observer => {
      const findings = this.findingsFor(backlog);
      backlogStore.agentStates.set(AGENT_DEFINITIONS.map(agent => ({
        agentId: agent.id,
        name: agent.name,
        icon: agent.icon,
        status: 'pending' as const,
      })));

      const timers: ReturnType<typeof setTimeout>[] = [];
      let offset = 0;

      AGENT_DEFINITIONS.forEach((agent, index) => {
        timers.push(setTimeout(() => {
          backlogStore.agentStates.update(states => states.map(state =>
            state.agentId === agent.id ? { ...state, status: 'running' as const } : state
          ));
        }, offset));

        agent.steps.forEach(step => {
          timers.push(setTimeout(() => backlogStore.aiLoadingStep.set(step), offset));
          offset += STEP_MS;
        });

        timers.push(setTimeout(() => {
          backlogStore.agentStates.update(states => states.map(state =>
            state.agentId === agent.id
              ? { ...state, status: 'done' as const, finding: findings[index] }
              : state
          ));
        }, offset));
      });

      timers.push(setTimeout(() => {
        observer.next(this.resultFor(backlog, findings));
        observer.complete();
      }, offset + 250));

      return () => timers.forEach(timer => clearTimeout(timer));
    });
  }

  analyzeImpact(backlogId: string, targetLane: RoadmapLane | Quarter): Observable<ImpactAnalysisResult> {
    return new Observable(observer => {
      const timers = [
        setTimeout(() => backlogStore.aiLoadingStep.set('Membandingkan prioritas dan kapasitas lane'), 0),
        setTimeout(() => backlogStore.aiLoadingStep.set('Menghitung trade-off roadmap'), 450),
        setTimeout(() => backlogStore.aiLoadingStep.set('Menyiapkan rekomendasi untuk PO'), 900),
        setTimeout(() => {
          const source = MOCK_IMPACT_RESULTS[backlogId] ?? MOCK_IMPACT_RESULTS['pocket-bca'];
          observer.next({ ...source, backlogId, targetLane });
          observer.complete();
        }, 1350),
      ];
      return () => timers.forEach(timer => clearTimeout(timer));
    });
  }

  private findingsFor(backlog: Backlog): AgentFinding[] {
    if (backlog.aiResult?.agentFindings?.length === 3) {
      return backlog.aiResult.agentFindings;
    }

    return [
      {
        agentId: 'market-gap', agentName: 'Market Gap', role: 'Membaca ekspektasi pasar', icon: '◎',
        summary: backlog.priorityChangeReason ?? 'Posisi kompetitif telah dibandingkan dengan prioritas awal PO.',
        contributesTo: ['Impact', 'Confidence'], evidence: backlog.aiResult?.reasoning.evidenceRefs ?? [],
      },
      {
        agentId: 'business-impact', agentName: 'Customer & Business Impact', role: 'Mengestimasi opportunity', icon: '↗',
        summary: backlog.estimatedImpact,
        contributesTo: ['Reach', 'Impact'], evidence: backlog.aiResult?.reasoning.evidenceRefs ?? [],
      },
      {
        agentId: 'feasibility-risk', agentName: 'Feasibility & Risk', role: 'Menilai effort dan trade-off', icon: '◇',
        summary: `${backlog.effortEstimation}. ${backlog.riskIfNotImplemented}`,
        contributesTo: ['Effort', 'MoSCoW'], evidence: [],
      },
    ];
  }

  private resultFor(backlog: Backlog, findings: AgentFinding[]): AIResult {
    const result = backlog.aiResult;
    if (!result) {
      throw new Error(`Demo scoring result is not configured for ${backlog.id}`);
    }

    return {
      ...result,
      agentFindings: findings,
      scoredAt: new Date(),
    };
  }
}
