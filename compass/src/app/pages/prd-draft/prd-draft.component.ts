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
  templateUrl: './prd-draft.component.html',
  styleUrl: './prd-draft.component.css',
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
