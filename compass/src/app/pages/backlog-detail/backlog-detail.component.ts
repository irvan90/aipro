import { Component, computed, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgClass, DecimalPipe } from '@angular/common';
import { backlogStore } from '../../core/stores/backlog.store';
import { MOCK_ACTIVITIES } from '../../core/services/mock-data.service';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { CompletenessBarComponent } from '../../shared/components/completeness-bar/completeness-bar.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { ToastService } from '../../core/services/toast.service';
import { AiService } from '../../core/services/ai.service';

@Component({
  selector: 'app-backlog-detail',
  standalone: true,
  imports: [RouterLink, NgClass, DecimalPipe, MoscowTagComponent, StatusDotComponent, CompletenessBarComponent, RelativeTimePipe],
  templateUrl: './backlog-detail.component.html',
  styleUrl: './backlog-detail.component.css',
})
export class BacklogDetailComponent implements OnInit {
  tabs = ['Overview', 'AI Scoring', 'Impact', 'PRD Draft', 'Audit Trail'];
  activeTab = signal('Overview');
  showReasoning = signal(false);

  backlog = computed(() => backlogStore.selectedBacklog());
  filteredActivities = computed(() =>
    MOCK_ACTIVITIES.filter(a => a.backlogId === backlogStore.selectedBacklogId())
  );

  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    private ai: AiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) backlogStore.selectedBacklogId.set(id);
  }

  getDimensions() {
    const r = this.backlog()?.aiResult;
    if (!r) return [];
    const lp: Record<string, number> = { Minimal: 10, Low: 25, Medium: 50, High: 75, Massive: 100 };
    return [
      { label: 'Reach', dimLabel: r.reach.label, pct: lp[r.reach.label] ?? 50, reasoning: r.reach.reasoning },
      { label: 'Impact', dimLabel: r.impact.label, pct: lp[r.impact.label] ?? 50, reasoning: r.impact.reasoning },
      { label: 'Confidence', dimLabel: `${r.confidenceLevel}%`, pct: r.confidenceLevel, reasoning: r.confidence.reasoning },
      { label: 'Effort', dimLabel: r.effort.label, pct: lp[r.effort.label] ?? 50, reasoning: r.effort.reasoning },
    ];
  }

  getDependencyTitle(id: string): string {
    return backlogStore.all().find(b => b.id === id)?.title ?? id;
  }

  reanalyze(): void {
    this.toast.show('info', 'Re-analysis triggered — see AI Scoring tab');
  }
}
