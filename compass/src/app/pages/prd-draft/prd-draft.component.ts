import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { backlogStore } from '../../core/stores/backlog.store';
import { ToastService } from '../../core/services/toast.service';
import { MOCK_PRD_SECTIONS } from '../../core/services/mock-data.service';
import { AiBadgeComponent } from '../../shared/components/ai-badge/ai-badge.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';

interface PRDSection {
  id: string;
  title: string;
  content: string;
  reviewed: boolean;
}

@Component({
  selector: 'app-prd-draft',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AiBadgeComponent, StatusDotComponent],
  template: `
    <div class="h-screen flex flex-col animate-fade-up overflow-hidden">
      <!-- Header Bar -->
      <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <a routerLink="/backlog" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </a>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ backlogTitle() }}</p>
            <p class="text-xs text-gray-500">PRD Draft</p>
          </div>
        </div>
        <!-- Status Bar -->
        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span class="text-xs text-gray-500">{{ reviewedCount() }}/{{ sections().length }} reviewed</span>
            </div>
            <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 rounded-full transition-all duration-300"
                [style.width.%]="reviewProgress()">
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="exportDraft()"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </button>
            <button (click)="markAsFinal()"
              [disabled]="!allReviewed()"
              [class]="allReviewed()
                ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors'
                : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Mark as Final
            </button>
          </div>
        </div>
      </div>

      <!-- Main Split Editor -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Left Panel: Section Navigator + AI Draft -->
        <div class="w-1/2 flex flex-col border-r border-gray-200 overflow-hidden">
          <!-- Section Navigator -->
          <div class="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0">
            <app-ai-badge type="AI Draft"></app-ai-badge>
            <div class="h-4 w-px bg-gray-300"></div>
            @for (section of sections(); track section.id) {
              <button
                (click)="activeSection.set(section.id)"
                [class]="activeSection() === section.id
                  ? 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-bca-primary text-white whitespace-nowrap'
                  : 'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 whitespace-nowrap transition-colors'">
                @if (section.reviewed) {
                  <svg class="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                }
                {{ section.title }}
              </button>
            }
          </div>

          <!-- AI Draft Content -->
          <div class="flex-1 overflow-y-auto p-5">
            @if (activeSectionData()) {
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-800">{{ activeSectionData()!.title }}</h3>
                  <div class="flex items-center gap-2">
                    <button (click)="acceptSection()"
                      class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-bca-accent text-bca-primary hover:bg-bca-primary hover:text-white transition-colors border border-bca-primary/20">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                      Accept Section
                    </button>
                  </div>
                </div>
                <div class="bg-bca-accent/50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono text-xs">
                  {{ activeSectionData()!.content }}
                </div>
              </div>
            }
            <!-- Accept All -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <button (click)="acceptAll()"
                class="flex items-center gap-2 text-xs font-medium text-bca-primary hover:underline">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Accept All Sections →
              </button>
            </div>
          </div>
        </div>

        <!-- Right Panel: Editable Draft -->
        <div class="w-1/2 flex flex-col overflow-hidden">
          <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-700">Your Draft</span>
              <span class="text-xs text-gray-400">· editable</span>
            </div>
            @if (activeSectionData()) {
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox"
                  [checked]="activeSectionData()!.reviewed"
                  (change)="toggleReviewed()"
                  class="w-3.5 h-3.5 accent-green-500">
                <span class="text-xs text-gray-600">Mark reviewed</span>
              </label>
            }
          </div>

          <!-- Editable Textarea -->
          <div class="flex-1 overflow-y-auto p-5">
            @if (activeSectionData()) {
              <textarea
                [value]="editedContent()"
                (input)="onContentEdit($event)"
                class="w-full h-full min-h-64 text-sm text-gray-700 leading-relaxed font-mono resize-none outline-none border-none bg-transparent"
                placeholder="Start editing the AI draft here...">
              </textarea>
            } @else {
              <div class="flex items-center justify-center h-full text-gray-400 text-sm">
                Select a section to edit
              </div>
            }
          </div>

          <!-- PO Notes -->
          <div class="border-t border-gray-200 p-4 flex-shrink-0">
            <label class="block text-xs font-semibold text-gray-700 mb-2">Personal PO Notes</label>
            <textarea
              [(ngModel)]="poNotes"
              rows="3"
              class="w-full text-xs text-gray-700 leading-relaxed border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
              placeholder="Add your private notes about this PRD... (not included in export)">
            </textarea>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrdDraftComponent implements OnInit {
  backlogId = signal<string>('');
  poNotes = '';

  backlogTitle = computed(() => {
    const id = this.backlogId();
    return backlogStore.all().find((b: {id: string; title: string}) => b.id === id)?.title ?? 'PRD Draft';
  });

  sections = signal<PRDSection[]>([]);
  activeSection = signal<string>('overview');

  editedContents = signal<Record<string, string>>({});

  activeSectionData = computed(() => {
    return this.sections().find(s => s.id === this.activeSection()) ?? null;
  });

  editedContent = computed(() => {
    const id = this.activeSection();
    return this.editedContents()[id] ?? this.activeSectionData()?.content ?? '';
  });

  reviewedCount = computed(() => this.sections().filter(s => s.reviewed).length);
  reviewProgress = computed(() => {
    const total = this.sections().length;
    return total === 0 ? 0 : Math.round((this.reviewedCount() / total) * 100);
  });
  allReviewed = computed(() => this.reviewedCount() === this.sections().length && this.sections().length > 0);

  constructor(private route: ActivatedRoute, private toastService: ToastService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('backlogId') ?? 'bl-001';
    this.backlogId.set(id);
    this.initSections();
  }

  private initSections() {
    const prd = MOCK_PRD_SECTIONS;
    this.sections.set([
      { id: 'overview', title: 'Overview', content: prd.overview, reviewed: false },
      { id: 'problem', title: 'Problem Statement', content: prd.problemStatement, reviewed: false },
      { id: 'goals', title: 'Goals & KPIs', content: prd.goalsAndKPIs, reviewed: false },
      { id: 'scope', title: 'Scope', content: prd.scope, reviewed: false },
      { id: 'requirements', title: 'Requirements', content: prd.requirements, reviewed: false },
      { id: 'risks', title: 'Risks', content: prd.risks, reviewed: false },
    ]);
    this.activeSection.set('overview');
  }

  onContentEdit(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const id = this.activeSection();
    this.editedContents.update(m => ({ ...m, [id]: textarea.value }));
  }

  acceptSection() {
    const id = this.activeSection();
    const content = this.editedContents()[id] ?? this.activeSectionData()?.content ?? '';
    this.sections.update(sections =>
      sections.map(s => s.id === id ? { ...s, content, reviewed: true } : s)
    );
    this.toastService.show('success', `Section "${this.activeSectionData()?.title}" accepted`);
    // Move to next section
    const idx = this.sections().findIndex(s => s.id === id);
    if (idx < this.sections().length - 1) {
      this.activeSection.set(this.sections()[idx + 1].id);
    }
  }

  acceptAll() {
    this.sections.update(sections =>
      sections.map(s => ({
        ...s,
        content: this.editedContents()[s.id] ?? s.content,
        reviewed: true,
      }))
    );
    this.toastService.show('success', 'All sections accepted');
  }

  toggleReviewed() {
    const id = this.activeSection();
    this.sections.update(sections =>
      sections.map(s => s.id === id ? { ...s, reviewed: !s.reviewed } : s)
    );
  }

  markAsFinal() {
    if (!this.allReviewed()) return;
    this.toastService.show('success', 'PRD marked as Final — ready for PMO submission');
  }

  exportDraft() {
    this.toastService.show('info', 'Exporting PRD as PDF...');
    setTimeout(() => this.toastService.show('success', 'PRD exported successfully'), 1500);
  }
}
