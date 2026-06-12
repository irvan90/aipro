import { Component, computed, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Backlog, ImpactArea, EvidenceType, Quarter, MyServiceData } from '../../core/models/backlog.model';
import { backlogStore } from '../../core/stores/backlog.store';
import { AiService } from '../../core/services/ai.service';
import { BacklogService } from '../../core/services/backlog.service';
import { ToastService } from '../../core/services/toast.service';
import { CompletenessBarComponent } from '../../shared/components/completeness-bar/completeness-bar.component';
import { DependencyChipsComponent } from '../../shared/components/dependency-chips/dependency-chips.component';
import { AgentPipelineComponent } from '../../shared/components/agent-pipeline/agent-pipeline.component';

@Component({
  selector: 'app-backlog-input',
  standalone: true,
  imports: [RouterLink, NgClass, NgFor, NgIf, DecimalPipe, FormsModule, ReactiveFormsModule, CompletenessBarComponent, DependencyChipsComponent, AgentPipelineComponent],
  templateUrl: './backlog-input.component.html',
  styleUrl: './backlog-input.component.scss',
})
export class BacklogInputComponent implements OnInit {
  backlogId: string | null = null;
  original: Backlog | null = null;
  saved = signal(false);

  form = signal({
    title: '',
    description: '',
    businessObjective: '',
    targetUsers: '',
    impactArea: [] as ImpactArea[],
    supportingEvidence: [] as EvidenceType[],
    estimatedImpact: '',
    riskIfNotImplemented: '',
    effortEstimation: '',
    targetQuarter: 'Q3' as Quarter,
    dependency: [] as string[],
    isEmergency: false,
    emergencyReason: '',
  });

  impactAreas: ImpactArea[] = ['Revenue', 'CX', 'Compliance', 'Ops', 'Retention', 'Risk'];
  evidenceTypes: EvidenceType[] = ['Analytics', 'Complaint Data', 'Survey', 'Incident Report', 'Business Request'];
  quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4', 'Unplanned'];

  aiState = computed(() => backlogStore.aiLoadingState());
  currentStep = computed(() => backlogStore.aiLoadingStep());

  msData = computed<MyServiceData | null>(() => this.original?.myService ?? null);
  isMyService = computed(() => this.original?.source === 'myservice');

  completenessScore = computed(() => {
    const f = this.form();
    let score = 0;
    if (f.title) score += 20;
    if (f.description) score += 15;
    if (f.businessObjective) score += 15;
    if (f.targetUsers) score += 15;
    if (f.impactArea.length > 0) score += 15;
    if (f.supportingEvidence.length > 0) score += 10;
    if (f.estimatedImpact) score += 5;
    if (f.riskIfNotImplemented) score += 5;
    return score;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ai: AiService,
    private backlogService: BacklogService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.backlogId = id;
      const backlog = this.backlogService.getById(id);
      if (backlog) {
        this.original = backlog;
        this.form.set({
          title: backlog.title,
          description: backlog.description,
          businessObjective: backlog.businessObjective,
          targetUsers: backlog.targetUsers,
          impactArea: [...backlog.impactArea],
          supportingEvidence: [...backlog.supportingEvidence],
          estimatedImpact: backlog.estimatedImpact,
          riskIfNotImplemented: backlog.riskIfNotImplemented,
          effortEstimation: backlog.effortEstimation,
          targetQuarter: backlog.targetQuarter,
          dependency: [...backlog.dependency],
          isEmergency: backlog.isEmergency,
          emergencyReason: backlog.emergencyReason ?? '',
        });
        backlogStore.selectedBacklogId.set(id);
      }
    }
    backlogStore.aiLoadingState.set('idle');
  }

  updateForm(updates: Partial<{
    title: string;
    description: string;
    businessObjective: string;
    targetUsers: string;
    impactArea: ImpactArea[];
    supportingEvidence: EvidenceType[];
    estimatedImpact: string;
    riskIfNotImplemented: string;
    effortEstimation: string;
    targetQuarter: Quarter;
    dependency: string[];
    isEmergency: boolean;
    emergencyReason: string;
  }>): void {
    this.form.update(f => ({ ...f, ...updates }));
  }

  toggleImpactArea(area: ImpactArea): void {
    const current = this.form();
    const idx = current.impactArea.indexOf(area);
    if (idx >= 0) {
      this.form.update(f => ({ ...f, impactArea: f.impactArea.filter(a => a !== area) }));
    } else {
      this.form.update(f => ({ ...f, impactArea: [...f.impactArea, area] }));
    }
  }

  isAreaSelected(area: ImpactArea): boolean {
    return this.form().impactArea.includes(area);
  }

  toggleEvidence(ev: EvidenceType): void {
    const current = this.form();
    const idx = current.supportingEvidence.indexOf(ev);
    if (idx >= 0) {
      this.form.update(f => ({ ...f, supportingEvidence: f.supportingEvidence.filter(e => e !== ev) }));
    } else {
      this.form.update(f => ({ ...f, supportingEvidence: [...f.supportingEvidence, ev] }));
    }
  }

  isEvidenceSelected(ev: EvidenceType): boolean {
    return this.form().supportingEvidence.includes(ev);
  }

  toggleEmergency(): void {
    this.form.update(f => ({ ...f, isEmergency: !f.isEmergency }));
  }

  saveDraft(): void {
    const backlog = this.buildBacklog();
    if (!backlog) return;
    this.backlogService.updateBacklog(backlog);
    this.original = backlog;
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  analyzeWithAI(): void {
    const backlog = this.buildBacklog();
    if (!backlog || backlogStore.aiLoadingState() === 'loading') return;

    this.backlogService.updateBacklog(backlog);
    this.original = backlog;
    backlogStore.aiLoadingState.set('loading');
    backlogStore.currentAnalyzingId.set(backlog.id);

    this.ai.analyzeBacklog(backlog).subscribe(result => {
      backlogStore.all.update(all =>
        all.map(b => b.id === backlog.id ? { ...b, aiResult: result, status: 'ai_scored' as const, updatedAt: new Date() } : b)
      );
      backlogStore.aiLoadingState.set('complete');
      backlogStore.currentAnalyzingId.set(null);
      this.toast.show('success', `AI scoring selesai — confidence ${result.confidenceLevel}%`);
      this.router.navigate(['/backlog', backlog.id]);
    });
  }

  private buildBacklog(): Backlog | null {
    if (!this.original) return null;
    const f = this.form();
    return {
      ...this.original,
      title: f.title,
      description: f.description,
      businessObjective: f.businessObjective,
      targetUsers: f.targetUsers,
      impactArea: f.impactArea,
      supportingEvidence: f.supportingEvidence,
      estimatedImpact: f.estimatedImpact,
      riskIfNotImplemented: f.riskIfNotImplemented,
      effortEstimation: f.effortEstimation,
      targetQuarter: f.targetQuarter,
      dependency: f.dependency,
      isEmergency: f.isEmergency,
      emergencyReason: f.emergencyReason,
      completenessScore: this.completenessScore(),
      status: this.original.status === 'new' ? 'draft' : this.original.status,
      updatedAt: new Date(),
    };
  }
}
