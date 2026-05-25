import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="text-5xl mb-4">{{ icon }}</div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 mb-6 max-w-xs">{{ description }}</p>
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = '📋';
  @Input() title = 'Nothing here yet';
  @Input() description = '';
}
