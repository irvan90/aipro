import { Component } from '@angular/core';
import { backlogStore } from '../../../core/stores/backlog.store';

@Component({
  selector: 'app-agent-pipeline',
  standalone: true,
  templateUrl: './agent-pipeline.component.html',
})
export class AgentPipelineComponent {
  agentStates = backlogStore.agentStates;
  loadingStep = backlogStore.aiLoadingStep;
}
