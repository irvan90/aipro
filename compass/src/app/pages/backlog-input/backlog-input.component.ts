import { Component, computed, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Backlog, ImpactArea, EvidenceType, Quarter } from '../../core/models/backlog.model';
import { backlogStore } from '../../core/stores/backlog.store';
import { AiService } from '../../core/services/ai.service';
import { BacklogService } from '../../core/services/backlog.service';
import { ToastService } from '../../core/services/toast.service';
import { CompletenessBarComponent } from '../../shared/components/completeness-bar/completeness-bar.component';
import { DependencyChipsComponent } from '../../shared/components/dependency-chips/dependency-chips.component';

@Component({
  selector: 'app-backlog-input',
  standalone: true,
  imports: [RouterLink, NgClass, NgFor, NgIf, DecimalPipe, FormsModule, ReactiveFormsModule, CompletenessBarComponent, DependencyChipsComponent],
  templateUrl: './backlog-input.component.html',
  styleUrl: './backlog-input.component.scss',
})
export class BacklogInputComponent implements OnInit {
  isEdit = false;
  backlogId: string | null = null;
  saved = signal(false);
  showReasoning = signal(false);

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
  quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  aiState = computed(() => backlogStore.aiLoadingState());
  currentStep = computed(() => backlogStore.aiLoadingStep());
  aiResult = computed(() => backlogStore.selectedBacklog()?.aiResult ?? null);

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

  dimensionRows = computed(() => {
    const r = this.aiResult();
    if (!r) return [];
    const labelToPct: Record<string, number> = { Minimal: 10, Low: 25, Medium: 50, High: 75, Massive: 100 };
    return [
      { label: 'Reach', dimLabel: r.reach.label, pct: labelToPct[r.reach.label] ?? 50 },
      { label: 'Impact', dimLabel: r.impact.label, pct: labelToPct[r.impact.label] ?? 50 },
      { label: 'Confidence', dimLabel: `${r.confidence.value * 100}%`, pct: r.confidence.value * 100 },
      { label: 'Effort', dimLabel: r.effort.label, pct: labelToPct[r.effort.label] ?? 50 },
    ];
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
    if (id && this.route.snapshot.url.some(s => s.path === 'edit')) {
      this.isEdit = true;
      this.backlogId = id;
      const backlog = this.backlogService.getById(id);
      if (backlog) {
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
    const backlog = this.buildBacklog('draft');
    if (this.isEdit && this.backlogId) {
      this.backlogService.updateBacklog({ ...backlog, id: this.backlogId });
    } else {
      this.backlogService.addBacklog(backlog);
    }
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  analyzeWithAI(): void {
    if (this.completenessScore() < 50) return;
    const tempId = this.backlogId ?? 'bl-temp-' + Date.now();
    const backlog = this.buildBacklog('draft');
    backlog.id = tempId;
    backlogStore.aiLoadingState.set('loading');
    backlogStore.selectedBacklogId.set(tempId);

    if (!this.backlogId) {
      backlogStore.all.update(all => [backlog, ...all]);
    }

    this.ai.analyzeBacklog(backlog).subscribe(result => {
      backlogStore.all.update(all =>
        all.map(b => b.id === tempId ? { ...b, aiResult: result, status: 'ai_scored' } : b)
      );
      backlogStore.aiLoadingState.set('complete');
      this.backlogId = tempId;
      this.toast.show('success', 'AI analysis complete — scored in 3.2s');
    });
  }

  saveToRoadmap(): void {
    this.toast.show('success', 'Added to Shadow Roadmap — Q3');
  }

  generatePRD(): void {
    if (this.backlogId) {
      this.router.navigate(['/prd-draft', this.backlogId]);
    }
  }

  private buildBacklog(status: any): Backlog {
    const f = this.form();
    return {
      id: 'bl-new-' + Date.now(),
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
      status,
      createdBy: 'user-po-001',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: 'prod-001',
    };
  }
}
