import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Backlog } from '../../../core/models/backlog.model';
import { backlogStore } from '../../../core/stores/backlog.store';

@Component({
  selector: 'app-dependency-chips',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormsModule, DecimalPipe],
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

  filteredBacklogs = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.allBacklogs()
      .filter(b =>
        b.id !== this.currentBacklogId &&
        !this.selectedIds.includes(b.id) &&
        (b.title.toLowerCase().includes(q) || !q)
      )
      .slice(0, 8);
  });

  selectedBacklogs = computed(() =>
    this.selectedIds.map(id => this.allBacklogs().find(b => b.id === id)).filter(Boolean) as Backlog[]
  );

  onSearch(): void {
    this.showDropdown.set(true);
  }

  addDependency(backlog: Backlog): void {
    if (!this.selectedIds.includes(backlog.id)) {
      const newIds = [...this.selectedIds, backlog.id];
      this.selectedIdsChange.emit(newIds);
    }
    this.searchQuery = '';
    this.showDropdown.set(false);
  }

  removeDependency(id: string): void {
    this.selectedIdsChange.emit(this.selectedIds.filter(i => i !== id));
  }

  hasConflict(id: string): boolean {
    const backlog = this.allBacklogs().find((b: Backlog) => b.id === id);
    return backlog?.status === 'not_ready' ? true : false;
  }

  getRank(backlog: Backlog): string {
    return '-';
  }
}
