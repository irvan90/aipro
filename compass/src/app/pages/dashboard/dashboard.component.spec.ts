import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MOCK_BACKLOGS } from '../../core/services/mock-data.service';
import { backlogStore } from '../../core/stores/backlog.store';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    backlogStore.all.set([...MOCK_BACKLOGS]);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the operational homepage with myService, stats, daily AI radar, and four backlogs', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('1 backlog masuk dari myService');
    expect(element.textContent).toContain('Total Backlog');
    expect(element.textContent).toContain('On Progress');
    expect(element.textContent).toContain('Done');
    expect(element.textContent).toContain('Product & Productivity News');
    expect(element.querySelectorAll('.backlog-row')).toHaveLength(4);
  });
});
