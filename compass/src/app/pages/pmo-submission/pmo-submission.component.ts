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
  template: `
    <div class="p-6 space-y-6 animate-fade-up">
      <!-- Submitted State -->
      @if (submitted()) {
        <div class="text-center py-12 space-y-4">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">Q3 Roadmap Submitted!</h2>
          <p class="text-sm text-gray-500 max-w-md mx-auto">
            Your Q3 2025 roadmap has been submitted to PMO for review. You will be notified once it's approved.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <a routerLink="/roadmap"
              class="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Back to Roadmap
            </a>
            <button (click)="submitted.set(false)"
              class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors">
              View Submission Details
            </button>
          </div>
          <!-- PMO Comment Thread -->
          <div class="mt-8 text-left max-w-2xl mx-auto">
            <h3 class="text-sm font-semibold text-gray-800 mb-3">PMO Comment Thread</h3>
            <div class="space-y-3">
              @for (comment of pmoComments(); track comment.id) {
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-bca-navy flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-bold text-white">{{ comment.author[0] }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-semibold text-gray-800">{{ comment.author }}</span>
                      <span class="text-xs text-gray-400">{{ comment.role }}</span>
                      <span class="text-xs text-gray-300">·</span>
                      <span class="text-xs text-gray-400">{{ comment.timestamp | date:'short' }}</span>
                    </div>
                    <p class="text-sm text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              }
            </div>
            <!-- Reply Input -->
            <div class="mt-3 flex gap-2">
              <input
                [(ngModel)]="replyText"
                (keydown.enter)="sendReply()"
                placeholder="Reply to PMO..."
                class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
              <button (click)="sendReply()"
                [disabled]="!replyText.trim()"
                class="px-4 py-2.5 rounded-xl text-sm font-medium bg-bca-primary text-white hover:bg-bca-hover transition-colors disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Normal Submission View -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900">PMO Submission</h1>
          <p class="text-sm text-gray-500 mt-1">Review and submit Q3 2025 roadmap to PMO for approval</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-5">
            <!-- Readiness Checklist -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
              <h2 class="text-sm font-semibold text-gray-800 mb-4">Submission Checklist</h2>
              <div class="space-y-3">
                @for (item of checklist(); track item.label) {
                  <div class="flex items-center gap-3 p-3 rounded-xl"
                    [class]="item.met ? 'bg-green-50' : 'bg-gray-50'">
                    <div [class]="item.met
                      ? 'w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center flex-shrink-0'
                      : 'w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center flex-shrink-0'">
                      @if (item.met) {
                        <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      }
                    </div>
                    <div class="flex-1">
                      <p [class]="item.met ? 'text-sm font-medium text-gray-800' : 'text-sm font-medium text-gray-500'">{{ item.label }}</p>
                      @if (!item.met && item.hint) {
                        <p class="text-xs text-red-500 mt-0.5">{{ item.hint }}</p>
                      }
                    </div>
                    @if (item.met) {
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Backlog Table -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-gray-800">Q3 Backlog Items ({{ q3Backlogs().length }})</h2>
                <button (click)="showAddPanel.set(true)"
                  class="flex items-center gap-1.5 text-xs font-medium text-bca-primary hover:underline">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Add from Shadow Roadmap
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-50 border-b border-gray-100">
                      <th class="text-left px-4 py-3 text-xs font-semibold text-gray-600">Backlog</th>
                      <th class="text-center px-4 py-3 text-xs font-semibold text-gray-600">MoSCoW</th>
                      <th class="text-center px-4 py-3 text-xs font-semibold text-gray-600">RICE</th>
                      <th class="text-center px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                      <th class="text-center px-4 py-3 text-xs font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (backlog of displayBacklogs(); track backlog.id) {
                      <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        [class.opacity-50]="removedIds().includes(backlog.id)">
                        <td class="px-4 py-3">
                          <a [routerLink]="['/backlog', backlog.id]"
                            class="text-sm font-medium text-gray-800 hover:text-bca-primary transition-colors line-clamp-1">
                            {{ backlog.title }}
                          </a>
                          <p class="text-xs text-gray-400 mt-0.5">{{ backlog.id }}</p>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <app-moscow-tag [moscow]="backlog.aiResult?.moscow ?? 'Should Have'"></app-moscow-tag>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <span class="text-sm font-bold text-gray-700">{{ backlog.aiResult?.riceScore ?? '—' }}</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <app-status-dot [status]="backlog.status"></app-status-dot>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <button (click)="removeBacklog(backlog)"
                            class="text-xs text-red-500 hover:text-red-700 font-medium hover:underline transition-colors">
                            Remove
                          </button>
                        </td>
                      </tr>
                    }
                    @if (displayBacklogs().length === 0) {
                      <tr>
                        <td colspan="5" class="text-center py-8 text-sm text-gray-400">No backlogs in Q3 roadmap</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="space-y-4">
            <!-- Summary Card -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
              <h3 class="text-sm font-semibold text-gray-800 mb-4">Submission Summary</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-xs text-gray-500">Quarter</span>
                  <span class="text-xs font-semibold text-gray-800">Q3 2025</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-xs text-gray-500">Total Items</span>
                  <span class="text-xs font-semibold text-gray-800">{{ activeBacklogCount() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-xs text-gray-500">Must Have</span>
                  <span class="text-xs font-semibold text-red-600">{{ mustHaveCount() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-xs text-gray-500">Should Have</span>
                  <span class="text-xs font-semibold text-yellow-600">{{ shouldHaveCount() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-xs text-gray-500">Ready Items</span>
                  <span class="text-xs font-semibold text-green-600">{{ readyCount() }}</span>
                </div>
                <div class="pt-3 border-t border-gray-100">
                  <div class="flex justify-between mb-1">
                    <span class="text-xs text-gray-500">Submission Readiness</span>
                    <span class="text-xs font-bold text-bca-primary">{{ readinessPercent() }}%</span>
                  </div>
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      [class]="readinessPercent() >= 75 ? 'bg-green-500' : 'bg-yellow-500'"
                      [style.width.%]="readinessPercent()">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button (click)="showConfirmModal.set(true)"
              [disabled]="!canSubmit()"
              [class]="canSubmit()
                ? 'w-full py-3 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-all shadow-blue'
                : 'w-full py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed'">
              Submit Q3 Roadmap to PMO →
            </button>
            @if (!canSubmit()) {
              <p class="text-xs text-gray-500 text-center">Complete all checklist items to submit</p>
            }
          </div>
        </div>
      }

      <!-- Remove Backlog Swap Modal -->
      @if (showRemoveModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="showRemoveModal.set(false)"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-modal-in">
            <h3 class="text-base font-semibold text-gray-800 mb-2">Remove from Q3 Submission?</h3>
            <p class="text-sm text-gray-500 mb-5">
              "<span class="font-medium text-gray-700">{{ removingBacklog()?.title }}</span>" will be removed from this submission. It will remain in the shadow roadmap.
            </p>
            <div class="flex gap-3">
              <button (click)="showRemoveModal.set(false)"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button (click)="confirmRemove()"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Submit Confirmation Modal -->
      @if (showConfirmModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="showConfirmModal.set(false)"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modal-in">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-bca-accent flex items-center justify-center">
                <svg class="w-5 h-5 text-bca-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-800">Submit Q3 Roadmap</h3>
                <p class="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Quarter:</span>
                <span class="font-semibold text-gray-800">Q3 2025</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Items:</span>
                <span class="font-semibold text-gray-800">{{ activeBacklogCount() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Submitted by:</span>
                <span class="font-semibold text-gray-800">Budi Santoso (PO)</span>
              </div>
            </div>
            <div class="flex gap-3">
              <button (click)="showConfirmModal.set(false)"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button (click)="doSubmit()"
                [disabled]="isSubmitting()"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors flex items-center justify-center gap-2">
                @if (isSubmitting()) {
                  <div class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                } @else {
                  Submit to PMO →
                }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Add from Shadow Roadmap Panel -->
      @if (showAddPanel()) {
        <div class="fixed inset-0 z-50 flex justify-end">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" (click)="showAddPanel.set(false)"></div>
          <div class="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl animate-slide-right p-5">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-base font-semibold text-gray-800">Add from Shadow Roadmap</h3>
              <button (click)="showAddPanel.set(false)" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mb-4">Select items from the shadow roadmap to add to this submission</p>
            <div class="space-y-2">
              @for (backlog of unaddedBacklogs(); track backlog.id) {
                <div class="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-bca-primary hover:bg-bca-accent/30 transition-colors cursor-pointer"
                  (click)="addBacklog(backlog)">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ backlog.title }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ backlog.id }} · RICE: {{ backlog.aiResult?.riceScore ?? '—' }}</p>
                  </div>
                  <svg class="w-4 h-4 text-bca-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
              }
              @if (unaddedBacklogs().length === 0) {
                <div class="text-center py-8 text-sm text-gray-400">No additional items available</div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
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
