import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'backlog',
        loadComponent: () => import('./pages/backlog-list/backlog-list.component').then(m => m.BacklogListComponent)
      },
      {
        path: 'backlog/new',
        loadComponent: () => import('./pages/backlog-input/backlog-input.component').then(m => m.BacklogInputComponent)
      },
      {
        path: 'backlog/:id/edit',
        loadComponent: () => import('./pages/backlog-input/backlog-input.component').then(m => m.BacklogInputComponent)
      },
      {
        path: 'backlog/:id',
        loadComponent: () => import('./pages/backlog-detail/backlog-detail.component').then(m => m.BacklogDetailComponent)
      },
      {
        path: 'roadmap',
        loadComponent: () => import('./pages/roadmap/roadmap.component').then(m => m.RoadmapComponent)
      },
      {
        path: 'impact-analysis',
        loadComponent: () => import('./pages/impact-analysis/impact-analysis.component').then(m => m.ImpactAnalysisComponent)
      },
      {
        path: 'prd-draft',
        loadComponent: () => import('./pages/prd-draft/prd-draft.component').then(m => m.PrdDraftComponent)
      },
      {
        path: 'prd-draft/:backlogId',
        loadComponent: () => import('./pages/prd-draft/prd-draft.component').then(m => m.PrdDraftComponent)
      },
      {
        path: 'pmo-submission',
        loadComponent: () => import('./pages/pmo-submission/pmo-submission.component').then(m => m.PmoSubmissionComponent)
      },
      {
        path: 'audit-trail',
        loadComponent: () => import('./pages/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent)
      },
      {
        path: 'team-members',
        loadComponent: () => import('./pages/team-members/team-members.component').then(m => m.TeamMembersComponent)
      },
      {
        path: 'product-context',
        loadComponent: () => import('./pages/product-context/product-context.component').then(m => m.ProductContextComponent)
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
