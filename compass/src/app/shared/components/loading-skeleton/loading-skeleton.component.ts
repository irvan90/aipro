import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="animate-pulse">
      @for (row of rows; track $index) {
        <div class="h-4 bg-gray-200 rounded mb-3" [style.width]="row"></div>
      }
    </div>
  `,
})
export class LoadingSkeletonComponent {
  @Input() rows: string[] = ['100%', '85%', '60%'];
}
