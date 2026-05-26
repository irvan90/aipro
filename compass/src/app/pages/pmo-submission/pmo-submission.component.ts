import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { backlogStore } from '../../core/stores/backlog.store';
import { PmoService, PMOComment } from '../../core/services/pmo.service';
import { ToastService } from '../../core/services/toast.service';
import { MOCK_USERS } from '../../core/services/mock-data.service';
import { Backlog } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';

@Component({
  selector: 'app-pmo-submission',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MoscowTagComponent, StatusDotComponent, DatePipe],
  templateUrl: './pmo-submission.component.html',
  styleUrl: './pmo-submission.component.css',
})
export class PmoSubmissionComponent implements OnInit {
  q3Backlogs = signal<Backlog[]>([]);
  removedIds = signal<string[]>([]);
  addedIds = signal<string[]>([]);

  displayBacklogs = computed(() =>
    this.q3Backlogs().filter(b => !this.removedIds().includes(b.id))
  );

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

  canSubmit = computed(() => this.checklist().every(c => c.met));

  submitted = signal(false);
  showConfirmModal = signal(false);
  showRemoveModal = signal(false);
  showAddPanel = signal(false);
  isSubmitting = signal(false);
  removingBacklog = signal<Backlog | null>(null);
  replyText = '';

  pmoComments = computed(() => this.pmoService.comments as PMOComment[]);

  unaddedBacklogs = computed(() => {
    const q3Ids = this.q3Backlogs().map(b => b.id);
    return backlogStore.all().filter(b => !q3Ids.includes(b.id));
  });

  constructor(private pmoService: PmoService, private toastService: ToastService) {}

  ngOnInit() {
    const q3 = backlogStore.all().filter(b => b.targetQuarter === 'Q3');
    this.q3Backlogs.set(q3);
  }

  removeBacklog(backlog: Backlog) {
    this.removingBacklog.set(backlog);
    this.showRemoveModal.set(true);
  }

  confirmRemove() {
    const b = this.removingBacklog();
    if (b) {
      this.removedIds.update(ids => [...ids, b.id]);
      this.toastService.show('info', `${b.title} removed from submission`);
    }
    this.showRemoveModal.set(false);
    this.removingBacklog.set(null);
  }

  addBacklog(backlog: Backlog) {
    this.q3Backlogs.update(list => [...list, backlog]);
    this.showAddPanel.set(false);
    this.toastService.show('success', `${backlog.title} added to Q3 submission`);
  }

  doSubmit() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.showConfirmModal.set(false);
      this.submitted.set(true);
      this.toastService.show('success', 'Q3 Roadmap submitted to PMO!');
    }, 1500);
  }

  sendReply() {
    if (!this.replyText.trim()) return;
    this.pmoService.sendComment(this.replyText.trim());
    this.replyText = '';
    this.toastService.show('success', 'Reply sent to PMO');
  }
}
