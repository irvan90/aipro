import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rice-score',
  standalone: true,
  templateUrl: './rice-score.component.html',
  styleUrl: './rice-score.component.css',
  imports: [DecimalPipe],
})
export class RiceScoreComponent {
  @Input() score = 0;
  @Input() maxScore = 0;
  @Input() showBar = true;
}
