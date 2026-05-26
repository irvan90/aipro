import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.css',
})
export class LoadingSkeletonComponent {
  @Input() rows: string[] = ['100%', '85%', '60%'];
}
