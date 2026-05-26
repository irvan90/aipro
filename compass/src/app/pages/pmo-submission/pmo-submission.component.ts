import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { backlogStore } from '../../core/stores/backlog.store';
import { PmoService, PMOComment } from '../../core/services/pmo.service';
import { ToastService } from '../../core/services/toast.service';
import { Backlog, Quarter } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';

@Component({
  selector: 'app-pmo-submission',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MoscowTagComponent, StatusDotComponent, DatePipe],
  templateUrl: './pmo-submission.component.html',
  styleUrl: './pmo-submission.component.scss',
})
export class PmoSubmissionComponent {
  readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
  selectedQuarter = signal<string>('Q2');

  // Per-quarter session state (reset when switching tabs)
  removedIds = signal<string[]>([]);
  extraBacklogs = signal<Backlog[]>([]);

  quarterBacklogs = computed(() =>
    backlogStore.all().filter(b => b.targetQuarter === this.selectedQuarter())
  );

  displayBacklogs = computed(() => {
    const removed = this.removedIds();
    const base = this.quarterBacklogs().filter(b => !removed.includes(b.id));
    const extras = this.extraBacklogs().filter(b => !removed.includes(b.id));
    return [...base, ...extras];
  });

  activeBacklogCount = computed(() => this.displayBacklogs().length);
  mustHaveCount = computed(() => this.displayBacklogs().filter(b => b.aiResult?.moscow === 'Must Have').length);
  shouldHaveCount = computed(() => this.displayBacklogs().filter(b => b.aiResult?.moscow === 'Should Have').length);
  readyCount = computed(() => this.displayBacklogs().filter(b => b.status === 'ready').length);

  readinessPercent = computed(() => {
    const total = this.activeBacklogCount();
    if (total === 0) return 0;
    return Math.round((this.readyCount() / total) * 100);
  });

  checklist = computed(() => [
    { label: 'At least 1 Must Have item', met: this.mustHaveCount() > 0, hint: 'Add a Must Have item to proceed' },
    { label: 'At least 3 backlog items', met: this.activeBacklogCount() >= 3, hint: 'Minimum 3 items required' },
    { label: 'No Not Ready items', met: this.displayBacklogs().filter(b => b.status === 'not_ready').length === 0, hint: 'Resolve not-ready items first' },
    { label: 'All items AI scored', met: this.displayBacklogs().every(b => b.aiResult !== undefined), hint: 'Run AI analysis on all items' },
  ]);

  isCurrentQuarterSubmitted = computed(() =>
    this.pmoService.quarterSubmitted()[this.selectedQuarter()] ?? false
  );

  canSubmit = computed(() =>
    this.checklist().every(c => c.met) && !this.isCurrentQuarterSubmitted()
  );

  pmoComments = computed<PMOComment[]>(() =>
    this.pmoService.getComments(this.selectedQuarter())
  );

  unaddedBacklogs = computed(() => {
    const currentIds = new Set([
      ...this.quarterBacklogs().map(b => b.id),
      ...this.extraBacklogs().map(b => b.id),
    ]);
    return backlogStore.all().filter(b => !currentIds.has(b.id));
  });

  showConfirmModal = signal(false);
  showRemoveModal = signal(false);
  showAddPanel = signal(false);
  isSubmitting = signal(false);
  removingBacklog = signal<Backlog | null>(null);
  replyText = '';

  constructor(private pmoService: PmoService, private toastService: ToastService) {}

  selectQuarter(q: string): void {
    this.selectedQuarter.set(q);
    this.removedIds.set([]);
    this.extraBacklogs.set([]);
    this.showAddPanel.set(false);
    this.showConfirmModal.set(false);
    this.replyText = '';
  }

  isQuarterSubmitted(q: string): boolean {
    return this.pmoService.quarterSubmitted()[q] ?? false;
  }

  removeBacklog(backlog: Backlog): void {
    this.removingBacklog.set(backlog);
    this.showRemoveModal.set(true);
  }

  confirmRemove(): void {
    const b = this.removingBacklog();
    if (b) {
      this.removedIds.update(ids => [...ids, b.id]);
      this.toastService.show('info', `${b.title} removed from submission`);
    }
    this.showRemoveModal.set(false);
    this.removingBacklog.set(null);
  }

  addBacklog(backlog: Backlog): void {
    this.extraBacklogs.update(list => [...list, backlog]);
    this.showAddPanel.set(false);
    this.toastService.show('success', `${backlog.title} added to ${this.selectedQuarter()} submission`);
  }

  doSubmit(): void {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.pmoService.submitQuarter(this.selectedQuarter() as Quarter);
      this.isSubmitting.set(false);
      this.showConfirmModal.set(false);
      this.toastService.show('success', `${this.selectedQuarter()} Roadmap submitted to PMO!`);
    }, 1500);
  }

  sendReply(): void {
    if (!this.replyText.trim()) return;
    this.pmoService.sendComment(this.selectedQuarter(), this.replyText.trim());
    this.replyText = '';
  }
}
