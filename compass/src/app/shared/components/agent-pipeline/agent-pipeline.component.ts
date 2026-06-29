import { Component, computed } from '@angular/core';
import { backlogStore } from '../../../core/stores/backlog.store';

@Component({
  selector: 'app-agent-pipeline',
  standalone: true,
  templateUrl: './agent-pipeline.component.html',
})
export class AgentPipelineComponent {
  agentStates = backlogStore.agentStates;
  loadingStep = backlogStore.aiLoadingStep;

  /** Derives the current pipeline phase from the loading step text and agent states */
  pipelinePhase = computed<'idle' | 'core-engine' | 'agents' | 'decision-engine'>(() => {
    if (backlogStore.aiLoadingState() === 'complete') return 'idle';
    const step = this.loadingStep();
    const agents = this.agentStates();

    if (step.startsWith('AIPRO Core Engine') || step.startsWith('Semantic Context')) {
      return 'core-engine';
    }
    if (agents.length > 0 && agents.some(a => a.status === 'running')) {
      return 'agents';
    }
    if (step.startsWith('Central Decision Engine') || step.startsWith('Generating MoSCoW')) {
      return 'decision-engine';
    }
    return 'idle';
  });
}
