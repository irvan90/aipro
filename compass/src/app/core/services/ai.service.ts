import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backlog, Quarter } from '../models/backlog.model';
import { AIResult } from '../models/backlog.model';
import { ImpactAnalysisResult } from '../models/ai-result.model';
import { AILoadingStep } from '../models/ui.model';
import { backlogStore } from '../stores/backlog.store';
import { MOCK_BACKLOGS, MOCK_IMPACT_RESULT, MOCK_PRD_CONTENT } from './mock-data.service';

@Injectable({ providedIn: 'root' })
export class AiService {
  private scoringSteps: AILoadingStep[] = [
    'Reading backlog context...',
    'Analyzing Jira history...',
    'Calculating RICE dimensions...',
    'Classifying MoSCoW...',
    'Generating reasoning...',
  ];

  private impactSteps: AILoadingStep[] = [
    'Mapping dependency chain...',
    'Analyzing roadmap consequences...',
    'Calculating KPI effects...',
    'Generating recommendations...',
  ];

  private prdSteps: AILoadingStep[] = [
    'Analyzing backlog context...',
    'Structuring PRD sections...',
    'Generating acceptance criteria...',
  ];

  analyzeBacklog(backlog: Backlog): Observable<AIResult> {
    return new Observable(observer => {
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < this.scoringSteps.length) {
          backlogStore.aiLoadingStep.set(this.scoringSteps[stepIndex]);
          stepIndex++;
        }
      }, 600);

      setTimeout(() => {
        clearInterval(stepInterval);
        const result = MOCK_BACKLOGS.find(b => b.id === backlog.id)?.aiResult
          ?? MOCK_BACKLOGS[0].aiResult!;
        observer.next(result);
        observer.complete();
      }, 3200);
    });
  }

  analyzeImpact(backlogId: string, targetQuarter: Quarter): Observable<ImpactAnalysisResult> {
    return new Observable(observer => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < this.impactSteps.length) {
          backlogStore.aiLoadingStep.set(this.impactSteps[i]);
          i++;
        }
      }, 700);

      setTimeout(() => {
        clearInterval(interval);
        observer.next({ ...MOCK_IMPACT_RESULT, backlogId, targetQuarter });
        observer.complete();
      }, 3000);
    });
  }

  generatePRD(backlog: Backlog): Observable<string> {
    return new Observable(observer => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < this.prdSteps.length) {
          backlogStore.aiLoadingStep.set(this.prdSteps[i]);
          i++;
        }
      }, 800);

      setTimeout(() => {
        clearInterval(interval);
        observer.next(MOCK_PRD_CONTENT);
        observer.complete();
      }, 2800);
    });
  }
}
