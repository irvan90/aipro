import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Backlog } from '../../../core/models/backlog.model';
import { backlogStore } from '../../../core/stores/backlog.store';

@Component({
  selector: 'app-dependency-chips',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dependency-chips.component.html',
  styleUrl: './dependency-chips.component.scss',
})
export class DependencyChipsComponent {
  @Input() selectedIds: string[] = [];
  @Input() currentBacklogId = '';
  @Output() selectedIdsChange = new EventEmitter<string[]>();

  searchQuery = '';
  showDropdown = signal(false);

  allBacklogs = computed(() => backlogStore.all());

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showDropdown.set(false);
    }
  }

  get filteredBacklogs(): Backlog[] {
    const q = this.searchQuery.toLowerCase();
    return this.allBacklogs()
      .filter(b =>
        b.id !== this.currentBacklogId &&
        !this.selectedIds.includes(b.id) &&
        (b.title.toLowerCase().includes(q) || !q)
      )
      .slice(0, 8);
  }

  get selectedBacklogs(): Backlog[] {
    return this.selectedIds.map(id => this.allBacklogs().find(b => b.id === id)).filter(Boolean) as Backlog[];
  }

  onSearch(): void {
    this.showDropdown.set(true);
  }

  addDependency(backlog: Backlog, event?: MouseEvent): void {
    if (event) {
      event.preventDefault(); // Prevent input blur
    }
    if (!this.selectedIds) {
      this.selectedIds = [];
    }
    if (!this.selectedIds.includes(backlog.id)) {
      const newIds = [...this.selectedIds, backlog.id];
      this.selectedIds = newIds;
      this.selectedIdsChange.emit(newIds);
    }
    this.searchQuery = '';
    this.showDropdown.set(false);
  }

  removeDependency(id: string, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    if (!this.selectedIds) {
      this.selectedIds = [];
    }
    const newIds = this.selectedIds.filter(i => i !== id);
    this.selectedIds = newIds;
    this.selectedIdsChange.emit(newIds);
  }

  hasConflict(id: string): boolean {
    const backlog = this.allBacklogs().find((b: Backlog) => b.id === id);
    return backlog?.status === 'not_ready' ? true : false;
  }

  getRank(backlog: Backlog): string {
    return backlog.targetQuarter;
  }
}
