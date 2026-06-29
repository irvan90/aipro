import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AgentFinding, AIResult, Backlog, Quarter, RoadmapLane } from '../models/backlog.model';
import { backlogStore } from '../stores/backlog.store';
import { AGENT_DEFINITIONS, MOCK_IMPACT_RESULTS, MOCK_POCKET_RUPIAH_AI_RESULT } from './mock-data.service';

const STEP_MS = 400;

@Injectable({ providedIn: 'root' })
export class AiService {
  analyzeBacklog(backlog: Backlog): Observable<AIResult> {
    return new Observable(observer => {
      const findings = this.findingsFor(backlog);
      backlogStore.thinkingLogs.set([]);
      backlogStore.fastForwardAnalysis.set(false);
      backlogStore.agentStates.set(AGENT_DEFINITIONS.map(agent => ({
        agentId: agent.id,
        name: agent.name,
        icon: agent.icon,
        status: 'pending' as const,
      })));

      const TIME_SCALE = 12; // Scales ~5s base to ~60s total
      const scheduledActions: { time: number, action: () => void }[] = [];
      const pushAction = (time: number, action: () => void) => scheduledActions.push({ time, action });
      
      let offset = 0;
      const log = (msg: string) => backlogStore.thinkingLogs.update(logs => [...logs, msg]);

      const isPocket = backlog.id === 'pocket-rupiah' || backlog.id === 'pocket-bca';
      const title = backlog.title;

      // ── Phase 1: AIPRO Core Engine ──
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('AIPRO Core Engine menerima Backlog Data Payload dari myService...'));
      pushAction(offset * TIME_SCALE, () => log('[SYSTEM] Bootstrapping AIPRO Orchestrator v4.2... [OK]'));
      offset += 200;
      pushAction(offset * TIME_SCALE, () => log('[CORE] Ingesting telemetry & semantic payload: "' + title + '"'));
      offset += 200;
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Semantic Context Processing & Orchestration Framework...'));
      pushAction(offset * TIME_SCALE, () => log('[CORE] Embedding sequence mapped to vector space (dim=1536)'));
      offset += 250;
      pushAction(offset * TIME_SCALE, () => log('[CORE] Constructing task subgraph. Initiating parallel agent swarms...'));
      offset += 150;

      // ── Phase 2: Fan-out — 3 AI Agents run in PARALLEL ──
      const parallelStart = offset;

      AGENT_DEFINITIONS.forEach(agent => {
        pushAction(parallelStart * TIME_SCALE, () => {
          backlogStore.agentStates.update(states => states.map(state =>
            state.agentId === agent.id ? { ...state, status: 'running' as const, currentStep: agent.steps[0] } : state
          ));
        });
      });
      pushAction(parallelStart * TIME_SCALE, () => backlogStore.aiLoadingStep.set('3 AI Agent berjalan paralel...'));

      let agentLogOffset = parallelStart + 150;

      // Agent 1 logs
      pushAction(agentLogOffset * TIME_SCALE, () => log('[Agent 1: Market Gap] Executing market-gap-analyzer... Querying competitor graph DB'));
      agentLogOffset += 280;
      pushAction(agentLogOffset * TIME_SCALE, () => log(isPocket
        ? '[Agent 1: Market Gap] ⚠️ Found high-confidence matching vectors: Jenius (t-9 yrs), blu (t-6 yrs)'
        : '[Agent 1: Market Gap] ⚠️ Market positioning anomaly detected against baseline'));
      agentLogOffset += 300;
      pushAction(agentLogOffset * TIME_SCALE, () => log(isPocket
        ? '[Agent 1: Market Gap] Inferring opportunity loss: "Severe market lag detected. Adoption threshold breached"'
        : '[Agent 1: Market Gap] Market timing tensor evaluated — high urgency inferred'));
      agentLogOffset += 250;

      // Agent 2 logs
      pushAction(agentLogOffset * TIME_SCALE, () => log('[Agent 2: Business Impact] Running Monte Carlo simulations on user segmentation models...'));
      agentLogOffset += 300;
      pushAction(agentLogOffset * TIME_SCALE, () => log(isPocket
        ? '[Agent 2: Business Impact] p(eligible_users) converged at ~80,000 nodes (confidence: 0.92)'
        : '[Agent 2: Business Impact] Reach topology mapped across user nodes'));
      agentLogOffset += 280;
      pushAction(agentLogOffset * TIME_SCALE, () => log(isPocket
        ? '[Agent 2: Business Impact] Projecting CASA retention delta: Rp9.6B - Rp30B (12mo horizon)'
        : '[Agent 2: Business Impact] Revenue/retention impact projection tensor generated'));
      agentLogOffset += 250;

      // Agent 3 logs
      pushAction(agentLogOffset * TIME_SCALE, () => log('[Agent 3: Feasibility] Analyzing dependency matrix and repo telemetry...'));
      agentLogOffset += 300;
      pushAction(agentLogOffset * TIME_SCALE, () => log(isPocket
        ? '[Agent 3: Feasibility] Codebase traversal complete. Reusability factor: high (transfer_infra)'
        : '[Agent 3: Feasibility] Abstract syntax tree (AST) evaluation complete'));
      agentLogOffset += 280;
      pushAction(agentLogOffset * TIME_SCALE, () => log(isPocket
        ? '[Agent 3: Feasibility] Evaluating compliance policies... PBI & OJK constraints satisfied ✓'
        : '[Agent 3: Feasibility] Evaluating compliance logic gates... constraints satisfied ✓'));

      const maxSteps = Math.max(...AGENT_DEFINITIONS.map(a => a.steps.length));
      for (let stepIdx = 1; stepIdx < maxSteps; stepIdx++) {
        AGENT_DEFINITIONS.forEach(agent => {
          if (stepIdx < agent.steps.length) {
            pushAction((parallelStart + stepIdx * STEP_MS) * TIME_SCALE, () => {
              backlogStore.agentStates.update(states => states.map(state =>
                state.agentId === agent.id ? { ...state, currentStep: agent.steps[stepIdx] } : state
              ));
            });
          }
        });
      }
      offset = parallelStart + maxSteps * STEP_MS;

      // Agents complete
      AGENT_DEFINITIONS.forEach((agent, index) => {
        pushAction(offset * TIME_SCALE, () => {
          backlogStore.agentStates.update(states => states.map(state =>
            state.agentId === agent.id
              ? { ...state, status: 'done' as const, currentStep: undefined, finding: findings[index] }
              : state
          ));
        });
      });

      // ── Phase 3: Central Decision Engine ──
      offset += 200;
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Central Decision Engine mengkalkulasi matriks RICE & MoSCoW...'));
      pushAction(offset * TIME_SCALE, () => log('[Decision Engine] Awaiting barrier sync... Aggregating tensor states from all agents'));
      offset += 300;
      const finalResult = this.resultFor(backlog, findings);
      const rice = finalResult.riceScore;
      const ve = finalResult.valueEffort;

      pushAction(offset * TIME_SCALE, () => log(rice
        ? `[Decision Engine] RICE parameters optimized: Reach=${rice.reach}, Impact=${rice.impact}, Confidence=${rice.confidence/100}, Effort=${rice.effort}`
        : '[Decision Engine] RICE heuristic parameters optimized from agent distributions'
      ));
      offset += STEP_MS;
      pushAction(offset * TIME_SCALE, () => backlogStore.aiLoadingStep.set('Generating MoSCoW Categorization & Value-Effort Matrix...'));
      pushAction(offset * TIME_SCALE, () => log(`[Decision Engine] Target trajectory inferred: MoSCoW=${finalResult.moscow.replace(' ', '_')} (loss=0.04)`));
      offset += 300;
      pushAction(offset * TIME_SCALE, () => log(ve 
        ? `[Decision Engine] Quadrant embedding resolved: (${ve.value}_Value, ${ve.effort}_Effort)`
        : '[Decision Engine] Value-Effort quadrant mapping resolved'
      ));
      offset += 250;
      pushAction(offset * TIME_SCALE, () => log(isPocket
        ? '[RESULT] 🎯 Policy Action Executed: PROMOTE (Q4 → Q3). Priority override applied.'
        : `[RESULT] 🎯 Policy Action Executed: ${backlog.recommendation?.toUpperCase() || 'EVALUATED'}. Analysis finalized.`
      ));
      offset += STEP_MS;

      pushAction(offset * TIME_SCALE, () => {
        observer.next(this.resultFor(backlog, findings));
        observer.complete();
      });

      scheduledActions.sort((a, b) => a.time - b.time);
      const startTime = Date.now();
      let timeoutId: any;
      let isCompleted = false;

      const runSchedule = () => {
        if (isCompleted) return;
        
        if (backlogStore.fastForwardAnalysis()) {
          scheduledActions.forEach(s => s.action());
          scheduledActions.length = 0;
          isCompleted = true;
          return;
        }

        const now = Date.now();
        const elapsed = now - startTime;

        while (scheduledActions.length > 0 && elapsed >= scheduledActions[0].time) {
          scheduledActions[0].action();
          scheduledActions.shift();
        }

        if (scheduledActions.length > 0) {
          timeoutId = setTimeout(runSchedule, 50);
        } else {
          isCompleted = true;
        }
      };

      runSchedule();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        isCompleted = true;
      };
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

    if (backlog.id === 'pocket-rupiah' || backlog.id === 'pocket-bca') {
      return MOCK_POCKET_RUPIAH_AI_RESULT.agentFindings!;
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
    if (backlog.id === 'pocket-rupiah' || backlog.id === 'pocket-bca') {
      return {
        ...MOCK_POCKET_RUPIAH_AI_RESULT,
        agentFindings: findings,
        scoredAt: new Date(),
      };
    }

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
