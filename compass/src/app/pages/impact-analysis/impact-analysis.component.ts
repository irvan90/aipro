import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { backlogStore } from '../../core/stores/backlog.store';
import { AiService } from '../../core/services/ai.service';
import { ToastService } from '../../core/services/toast.service';
import { MOCK_IMPACT_RESULT } from '../../core/services/mock-data.service';
import { Backlog, Quarter, BacklogStatus } from '../../core/models/backlog.model';
import { MoscowTagComponent } from '../../shared/components/moscow-tag/moscow-tag.component';
import { StatusDotComponent } from '../../shared/components/status-dot/status-dot.component';
import { AiBadgeComponent } from '../../shared/components/ai-badge/ai-badge.component';
import { MoSCoW } from '../../core/models/backlog.model';

interface ImpactStateDisplay {
  riceScore: number;
  quarter: Quarter;
  status: BacklogStatus;
  dependencies: string[];
  revenueImpact: string;
  revenueChange?: number;
}

interface ImpactRoadmapDisplay {
  affectedItems: number;
  severity: string;
  items: Array<{ id: string; title: string; description: string; type: string }>;
}

interface ImpactDependencyDisplay {
  blockedItems: number;
  severity: string;
  details: Array<{ id: string; title: string; reason: string; status: BacklogStatus }>;
}

interface ImpactKPIDisplay {
  severity: string;
  metrics: Array<{ name: string; current: string; projected: string; change: number }>;
}

interface ImpactRecommendation {
  title: string;
  reasoning: string;
  risks: string[];
}

interface ImpactDisplayResult {
  currentState: ImpactStateDisplay;
  whatIfState: ImpactStateDisplay;
  roadmapImpact: ImpactRoadmapDisplay;
  dependencyImpact: ImpactDependencyDisplay;
  kpiImpact: ImpactKPIDisplay;
  recommendation: ImpactRecommendation;
}

@Component({
  selector: 'app-impact-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, MoscowTagComponent, StatusDotComponent, AiBadgeComponent],
  template: `
    <div class="p-6 space-y-6 animate-fade-up">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Impact Analysis</h1>
        <p class="text-sm text-gray-500 mt-1">Simulate what-if scenarios before committing changes to your roadmap</p>
      </div>

      <!-- Analysis Setup Card -->
      <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
        <h2 class="text-base font-semibold text-gray-800 mb-4">Configure Analysis</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <!-- Backlog Selector -->
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-2">Select Backlog to Analyze</label>
            <div class="relative">
              <select
                [value]="selectedBacklogId()"
                (change)="onBacklogChange($event)"
                class="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary appearance-none cursor-pointer">
                <option value="">-- Choose a backlog item --</option>
                @for (backlog of backlogs(); track backlog.id) {
                  <option [value]="backlog.id">{{ backlog.title }} (RICE: {{ backlog.aiResult?.riceScore ?? 'N/A' }})</option>
                }
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Quarter Selector -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Target Quarter</label>
            <div class="flex gap-2">
              @for (q of quarters; track q) {
                <button
                  (click)="selectedQuarter.set(q)"
                  [class]="selectedQuarter() === q
                    ? 'flex-1 py-2.5 text-xs font-semibold rounded-xl bg-bca-primary text-white border border-bca-primary'
                    : 'flex-1 py-2.5 text-xs font-medium rounded-xl bg-gray-50 text-gray-600 border border-gray-200 hover:border-bca-primary hover:text-bca-primary transition-colors'">
                  {{ q }}
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Run Button -->
        <div class="mt-4 flex justify-end">
          <button
            (click)="runAnalysis()"
            [disabled]="!selectedBacklogId() || isAnalyzing()"
            [class]="(!selectedBacklogId() || isAnalyzing())
              ? 'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-all duration-200 shadow-blue'">
            @if (isAnalyzing()) {
              <div class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Run Analysis →
            }
          </button>
        </div>
      </div>

      <!-- AI Loading Steps -->
      @if (isAnalyzing()) {
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-bca-navy to-bca-primary flex items-center justify-center">
              <svg class="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">AI Impact Analysis Running</p>
              <p class="text-xs text-gray-500">This takes about 3 seconds...</p>
            </div>
          </div>
          <div class="space-y-3">
            @for (step of analysisSteps; track step.label; let i = $index) {
              <div class="flex items-center gap-3">
                <div [class]="i < currentStepIndex()
                  ? 'w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0'
                  : i === currentStepIndex()
                    ? 'w-5 h-5 rounded-full bg-bca-primary flex items-center justify-center flex-shrink-0 animate-pulse'
                    : 'w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'">
                  @if (i < currentStepIndex()) {
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  } @else if (i === currentStepIndex()) {
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                  }
                </div>
                <span [class]="i <= currentStepIndex() ? 'text-sm text-gray-800 font-medium' : 'text-sm text-gray-400'">
                  {{ step.label }}
                </span>
              </div>
            }
          </div>
          <!-- Progress Bar -->
          <div class="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-bca-primary to-blue-400 rounded-full transition-all duration-500"
              [style.width.%]="(currentStepIndex() / analysisSteps.length) * 100">
            </div>
          </div>
        </div>
      }

      <!-- Analysis Results -->
      @if (showResults() && analysisResult()) {
        <div class="animate-fade-up space-y-6">
          <!-- Selected Backlog Info -->
          <div class="bg-bca-accent border border-bca-primary/20 rounded-2xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-bca-primary/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-bca-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">{{ selectedBacklogTitle() }}</p>
                <p class="text-xs text-gray-500">Moving to {{ selectedQuarter() }} — analyzing cascading impacts</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <app-moscow-tag [moscow]="selectedBacklogMoscow()"></app-moscow-tag>
            </div>
          </div>

          <!-- Split View -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Current State -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                  <h3 class="text-sm font-semibold text-gray-800">Current State</h3>
                </div>
                <span class="text-xs text-gray-500">Before move</span>
              </div>
              <div class="p-5 space-y-4">
                <div class="grid grid-cols-3 gap-3">
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <p class="text-xl font-bold text-gray-800">{{ analysisResult()!.currentState.riceScore }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">RICE Score</p>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <p class="text-xl font-bold text-gray-800">{{ analysisResult()!.currentState.quarter }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">Quarter</p>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <p class="text-xl font-bold" [class]="getStatusColor(analysisResult()!.currentState.status)">
                      {{ formatStatus(analysisResult()!.currentState.status) }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">Status</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-600 mb-2">Dependencies</p>
                  <div class="flex flex-wrap gap-1.5">
                    @for (dep of analysisResult()!.currentState.dependencies; track dep) {
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">{{ dep }}</span>
                    }
                    @if (!analysisResult()!.currentState.dependencies.length) {
                      <span class="text-xs text-gray-400 italic">No dependencies</span>
                    }
                  </div>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-600 mb-1">Estimated Revenue Impact</p>
                  <p class="text-sm font-semibold text-green-600">+{{ analysisResult()!.currentState.revenueImpact }}</p>
                </div>
              </div>
            </div>

            <!-- What-If State -->
            <div class="bg-white rounded-2xl shadow-card border border-bca-primary/30 overflow-hidden">
              <div class="px-5 py-4 border-b border-bca-primary/20 flex items-center justify-between bg-bca-accent/50">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-bca-primary animate-pulse"></div>
                  <h3 class="text-sm font-semibold text-bca-primary">What-If State</h3>
                </div>
                <span class="text-xs text-bca-primary font-medium">→ Move to {{ selectedQuarter() }}</span>
              </div>
              <div class="p-5 space-y-4">
                <div class="grid grid-cols-3 gap-3">
                  <div class="text-center p-3 bg-bca-accent rounded-xl">
                    <p class="text-xl font-bold text-bca-primary">{{ analysisResult()!.whatIfState.riceScore }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">RICE Score</p>
                  </div>
                  <div class="text-center p-3 bg-bca-accent rounded-xl">
                    <p class="text-xl font-bold text-bca-primary">{{ analysisResult()!.whatIfState.quarter }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">Quarter</p>
                  </div>
                  <div class="text-center p-3 bg-bca-accent rounded-xl">
                    <p class="text-xl font-bold" [class]="getStatusColor(analysisResult()!.whatIfState.status)">
                      {{ formatStatus(analysisResult()!.whatIfState.status) }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">Status</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-600 mb-2">Dependencies</p>
                  <div class="flex flex-wrap gap-1.5">
                    @for (dep of analysisResult()!.whatIfState.dependencies; track dep) {
                      <span class="px-2 py-1 bg-bca-primary/10 text-bca-primary rounded-lg text-xs">{{ dep }}</span>
                    }
                    @if (!analysisResult()!.whatIfState.dependencies.length) {
                      <span class="text-xs text-gray-400 italic">No dependencies</span>
                    }
                  </div>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-600 mb-1">Projected Revenue Impact</p>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold text-green-600">+{{ analysisResult()!.whatIfState.revenueImpact }}</p>
                    @if ((analysisResult()!.whatIfState.revenueChange ?? 0) > 0) {
                      <span class="text-xs text-green-600 font-medium">▲ {{ analysisResult()!.whatIfState.revenueChange }}%</span>
                    } @else if ((analysisResult()!.whatIfState.revenueChange ?? 0) < 0) {
                      <span class="text-xs text-red-500 font-medium">▼ {{ -(analysisResult()!.whatIfState.revenueChange ?? 0) }}%</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Impact Accordion Cards -->
          <div class="space-y-3">
            <!-- Roadmap Impact -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <button
                (click)="toggleAccordion('roadmap')"
                class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-semibold text-gray-800">Roadmap Impact</p>
                    <p class="text-xs text-gray-500">{{ analysisResult()!.roadmapImpact.affectedItems }} items affected</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span [class]="getSeverityBadge(analysisResult()!.roadmapImpact.severity)">
                    {{ analysisResult()!.roadmapImpact.severity }}
                  </span>
                  <svg [class]="accordionOpen() === 'roadmap' ? 'w-4 h-4 text-gray-400 rotate-180' : 'w-4 h-4 text-gray-400'"
                    class="transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
              @if (accordionOpen() === 'roadmap') {
                <div class="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3 animate-fade-up">
                  @for (item of analysisResult()!.roadmapImpact.items; track item.id) {
                    <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div [class]="item.type === 'conflict' ? 'w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5'
                        : 'w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5'">
                        <svg [class]="item.type === 'conflict' ? 'w-3 h-3 text-red-500' : 'w-3 h-3 text-yellow-600'"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            [attr.d]="item.type === 'conflict' ? 'M6 18L18 6M6 6l12 12' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-xs font-semibold text-gray-700">{{ item.title }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ item.description }}</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Dependency Impact -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <button
                (click)="toggleAccordion('dependency')"
                class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-semibold text-gray-800">Dependency Impact</p>
                    <p class="text-xs text-gray-500">{{ analysisResult()!.dependencyImpact.blockedItems }} items at risk</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span [class]="getSeverityBadge(analysisResult()!.dependencyImpact.severity)">
                    {{ analysisResult()!.dependencyImpact.severity }}
                  </span>
                  <svg [class]="accordionOpen() === 'dependency' ? 'w-4 h-4 text-gray-400 rotate-180' : 'w-4 h-4 text-gray-400'"
                    class="transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
              @if (accordionOpen() === 'dependency') {
                <div class="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3 animate-fade-up">
                  @for (dep of analysisResult()!.dependencyImpact.details; track dep.id) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p class="text-xs font-semibold text-gray-700">{{ dep.title }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ dep.reason }}</p>
                      </div>
                      <app-status-dot [status]="dep.status"></app-status-dot>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- KPI Impact -->
            <div class="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <button
                (click)="toggleAccordion('kpi')"
                class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-semibold text-gray-800">KPI Impact</p>
                    <p class="text-xs text-gray-500">{{ analysisResult()!.kpiImpact.metrics.length }} metrics affected</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span [class]="getSeverityBadge(analysisResult()!.kpiImpact.severity)">
                    {{ analysisResult()!.kpiImpact.severity }}
                  </span>
                  <svg [class]="accordionOpen() === 'kpi' ? 'w-4 h-4 text-gray-400 rotate-180' : 'w-4 h-4 text-gray-400'"
                    class="transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
              @if (accordionOpen() === 'kpi') {
                <div class="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3 animate-fade-up">
                  @for (metric of analysisResult()!.kpiImpact.metrics; track metric.name) {
                    <div class="p-3 bg-gray-50 rounded-xl">
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-xs font-semibold text-gray-700">{{ metric.name }}</p>
                        <span [class]="metric.change > 0 ? 'text-xs font-medium text-green-600' : 'text-xs font-medium text-red-500'">
                          {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
                        </span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-xs text-gray-500">Current: {{ metric.current }}</span>
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span [class]="metric.change > 0 ? 'text-xs text-green-600 font-medium' : 'text-xs text-red-500 font-medium'">
                          Projected: {{ metric.projected }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- AI Recommendation Panel -->
          <div class="bg-gradient-to-r from-bca-navy to-bca-primary rounded-2xl p-6 text-white">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <app-ai-badge type="Recommendation"></app-ai-badge>
                  <span class="text-xs text-white/60">Generated just now</span>
                </div>
                <p class="text-sm font-semibold mb-1">{{ analysisResult()!.recommendation.title }}</p>
                <p class="text-xs text-white/80 leading-relaxed">{{ analysisResult()!.recommendation.reasoning }}</p>

                <!-- Risk Factors -->
                @if (analysisResult()!.recommendation.risks.length > 0) {
                  <div class="mt-3 space-y-1">
                    @for (risk of analysisResult()!.recommendation.risks; track risk) {
                      <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0"></div>
                        <span class="text-xs text-white/75">{{ risk }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-5">
              <button
                (click)="acceptRecommendation()"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white text-bca-primary hover:bg-gray-50 transition-colors text-center">
                ✓ Keep — Recommended
              </button>
              <button
                (click)="overrideRecommendation()"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors text-center">
                ↗ Move — Override
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Empty State (no analysis yet) -->
      @if (!isAnalyzing() && !showResults()) {
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
          <div class="w-16 h-16 rounded-2xl bg-bca-accent mx-auto flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-bca-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-gray-800 mb-1">No Analysis Yet</h3>
          <p class="text-sm text-gray-500 max-w-sm mx-auto">
            Select a backlog item and target quarter above, then click "Run Analysis" to simulate the impact of moving it.
          </p>
        </div>
      }
    </div>
  `
})
export class ImpactAnalysisComponent implements OnInit {
  backlogs = computed(() => backlogStore.all());
  selectedBacklogId = signal<string>('');
  selectedQuarter = signal<Quarter>('Q3');
  quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  isAnalyzing = signal(false);
  currentStepIndex = signal(0);
  showResults = signal(false);
  analysisResult = signal<ImpactDisplayResult | null>(null);
  accordionOpen = signal<string | null>('roadmap');

  analysisSteps = [
    { label: 'Mapping dependency chain…' },
    { label: 'Analyzing roadmap consequences…' },
    { label: 'Checking dependency readiness…' },
    { label: 'Generating recommendations…' },
  ];

  selectedBacklogTitle = computed(() => {
    const id = this.selectedBacklogId();
    return this.backlogs().find(b => b.id === id)?.title ?? '';
  });

  selectedBacklogMoscow = computed<MoSCoW>(() => {
    const id = this.selectedBacklogId();
    return this.backlogs().find(b => b.id === id)?.aiResult?.moscow ?? 'Should Have';
  });

  constructor(private aiService: AiService, private toastService: ToastService) {}

  ngOnInit() {
    if (this.backlogs().length > 0) {
      this.selectedBacklogId.set(this.backlogs()[0].id);
    }
  }

  onBacklogChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedBacklogId.set(select.value);
    this.showResults.set(false);
    this.analysisResult.set(null);
  }

  runAnalysis() {
    if (!this.selectedBacklogId()) return;
    this.isAnalyzing.set(true);
    this.showResults.set(false);
    this.currentStepIndex.set(0);

    const stepInterval = setInterval(() => {
      const next = this.currentStepIndex() + 1;
      if (next <= this.analysisSteps.length) {
        this.currentStepIndex.set(next);
      } else {
        clearInterval(stepInterval);
      }
    }, 750);

    setTimeout(() => {
      clearInterval(stepInterval);
      this.currentStepIndex.set(this.analysisSteps.length);
      this.isAnalyzing.set(false);
      this.analysisResult.set(this.buildResult());
      this.showResults.set(true);
    }, 3000);
  }

  private buildResult(): ImpactDisplayResult {
    const backlog = backlogStore.all().find(b => b.id === this.selectedBacklogId());
    const toQuarter = this.selectedQuarter();
    const fromQuarter = backlog?.targetQuarter ?? 'Q3';
    return {
      currentState: {
        riceScore: backlog?.aiResult?.riceScore ?? 72,
        quarter: fromQuarter,
        status: backlog?.status ?? 'ai_scored',
        dependencies: backlog?.dependency ?? [],
        revenueImpact: 'Rp 4.2B',
      },
      whatIfState: {
        riceScore: Math.round((backlog?.aiResult?.riceScore ?? 72) * 0.85),
        quarter: toQuarter,
        status: 'ai_scored',
        dependencies: (backlog?.dependency ?? []).slice(0, 1),
        revenueImpact: 'Rp 3.6B',
        revenueChange: -14,
      },
      roadmapImpact: {
        affectedItems: MOCK_IMPACT_RESULT.roadmapImpacts.length,
        severity: 'High',
        items: MOCK_IMPACT_RESULT.roadmapImpacts.map(r => ({
          id: r.affectedBacklogId,
          title: r.affectedBacklogTitle,
          description: r.description,
          type: r.severity === 'high' ? 'conflict' : 'warning',
        })),
      },
      dependencyImpact: {
        blockedItems: MOCK_IMPACT_RESULT.dependencyImpacts.filter(d => d.isBlocker).length,
        severity: 'Medium',
        details: MOCK_IMPACT_RESULT.dependencyImpacts.map(d => ({
          id: d.dependencyId,
          title: d.dependencyTitle,
          reason: d.description,
          status: d.isBlocker ? 'not_ready' : 'ai_scored',
        })),
      },
      kpiImpact: {
        severity: 'High',
        metrics: MOCK_IMPACT_RESULT.kpiImpacts.map(k => ({
          name: k.kpi,
          current: '91.5%',
          projected: '88.2%',
          change: -3,
        })),
      },
      recommendation: {
        title: MOCK_IMPACT_RESULT.recommendedAction === 'keep'
          ? `Keep in ${fromQuarter} — Recommended`
          : `Move to ${toQuarter}`,
        reasoning: MOCK_IMPACT_RESULT.aiRecommendation,
        risks: [
          'Revenue target for Q3 may be missed',
          `${MOCK_IMPACT_RESULT.estimatedDelayInSprints} sprint delay estimated`,
        ],
      },
    };
  }

  toggleAccordion(key: string) {
    this.accordionOpen.set(this.accordionOpen() === key ? null : key);
  }

  acceptRecommendation() {
    this.toastService.show('success', 'Decision recorded: Keep in current quarter');
    this.showResults.set(false);
    this.analysisResult.set(null);
  }

  overrideRecommendation() {
    this.toastService.show('warning', `Override applied: Moving to ${this.selectedQuarter()}`);
    this.showResults.set(false);
    this.analysisResult.set(null);
  }

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = {
      Low: 'px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
      Medium: 'px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700',
      High: 'px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700',
    };
    return map[severity] ?? map['Medium'];
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      draft: 'text-gray-500',
      ai_scored: 'text-blue-500',
      ready: 'text-green-600',
      not_ready: 'text-red-500',
      submitted: 'text-purple-600',
      archived: 'text-gray-400',
    };
    return map[status] ?? 'text-gray-700';
  }

  formatStatus(status: string): string {
    const map: Record<string, string> = {
      draft: 'Draft',
      ai_scored: 'Scored',
      ready: 'Ready',
      not_ready: 'Not Ready',
      submitted: 'Submitted',
      archived: 'Archived',
    };
    return map[status] ?? status;
  }
}
