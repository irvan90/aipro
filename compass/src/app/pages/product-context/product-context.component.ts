import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { appStore } from '../../core/stores/app.store';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-context',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 animate-fade-up">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Product Context</h1>
          <p class="text-sm text-gray-500 mt-1">Define OKRs, strategic goals, and constraints for AI-powered scoring</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="pullFromJira()"
            [disabled]="isPulling()"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            @if (isPulling()) {
              <div class="w-4 h-4 border-2 border-gray-400/40 border-t-gray-600 rounded-full animate-spin"></div>
              Pulling from Jira...
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Pull from Jira
            }
          </button>
          <button (click)="saveChanges()"
            [disabled]="!isDirty()"
            [class]="isDirty()
              ? 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors shadow-blue'
              : 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <!-- Product Selector -->
      <div class="flex items-center gap-3 p-3 bg-bca-accent rounded-xl border border-bca-primary/20">
        <svg class="w-4 h-4 text-bca-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <span class="text-xs text-gray-600">Active product:</span>
        <select
          [value]="activeProductId()"
          (change)="onProductChange($event)"
          class="text-sm font-semibold text-bca-primary bg-transparent border-none outline-none cursor-pointer">
          @for (product of products(); track product.id) {
            <option [value]="product.id">{{ product.name }}</option>
          }
        </select>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Product Info -->
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-5">
          <h2 class="text-sm font-semibold text-gray-800">Product Information</h2>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Product Name</label>
            <input [(ngModel)]="formData.name" (ngModelChange)="markDirty()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Product Description</label>
            <textarea [(ngModel)]="formData.description" (ngModelChange)="markDirty()" rows="3"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
            </textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Product Vision</label>
            <textarea [(ngModel)]="formData.vision" (ngModelChange)="markDirty()" rows="3"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
              placeholder="Long-term vision statement...">
            </textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Target Users (M)</label>
              <input [(ngModel)]="formData.targetUsers" (ngModelChange)="markDirty()" type="number"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Revenue Target (IDR B)</label>
              <input [(ngModel)]="formData.revenueTarget" (ngModelChange)="markDirty()"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
                placeholder="e.g. 500B">
            </div>
          </div>
        </div>

        <!-- OKRs Section -->
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-800">OKRs Q3 2025</h2>
            <button (click)="addOkr()"
              class="text-xs text-bca-primary font-medium hover:underline flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add OKR
            </button>
          </div>

          @if (formData.okrs.length === 0) {
            <div class="text-center py-8 text-sm text-gray-400">
              No OKRs defined yet. Click "Add OKR" to start.
            </div>
          }

          @for (okr of formData.okrs; track okr.id; let i = $index) {
            <div class="border border-gray-200 rounded-xl p-4 space-y-3">
              <div class="flex items-start justify-between">
                <span class="text-xs font-semibold text-bca-primary bg-bca-accent px-2 py-0.5 rounded-full">O{{ i + 1 }}</span>
                <button (click)="removeOkr(i)" class="text-gray-300 hover:text-red-400 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <input [(ngModel)]="okr.objective" (ngModelChange)="markDirty()"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
                placeholder="Objective...">
              @for (kr of okr.keyResults; track kr.id; let j = $index) {
                <div class="flex items-center gap-2 ml-3">
                  <div class="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></div>
                  <input [(ngModel)]="kr.description" (ngModelChange)="markDirty()"
                    class="flex-1 px-2 py-1.5 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-bca-primary/30 bg-gray-50"
                    placeholder="Key Result {{ j + 1 }}...">
                  <button (click)="removeKr(i, j)" class="text-gray-300 hover:text-red-400 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              }
              <button (click)="addKr(i)"
                class="ml-3 text-xs text-gray-500 hover:text-bca-primary flex items-center gap-1 transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Key Result
              </button>
            </div>
          }
        </div>

        <!-- Strategic Constraints -->
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-800">Strategic Constraints</h2>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Budget Ceiling</label>
            <input [(ngModel)]="formData.budgetCeiling" (ngModelChange)="markDirty()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
              placeholder="e.g. IDR 2.5B per quarter">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Regulatory Constraints</label>
            <textarea [(ngModel)]="formData.regulatoryConstraints" (ngModelChange)="markDirty()" rows="3"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
              placeholder="OJK compliance requirements, BI directives...">
            </textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Technical Constraints</label>
            <textarea [(ngModel)]="formData.technicalConstraints" (ngModelChange)="markDirty()" rows="3"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
              placeholder="Legacy system dependencies, API limitations...">
            </textarea>
          </div>
        </div>

        <!-- AI Context Hints -->
        <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-semibold text-gray-800">AI Scoring Context</h2>
            <span class="text-xs bg-gradient-to-r from-bca-navy to-bca-primary text-white px-2 py-0.5 rounded-full">Used by AI</span>
          </div>
          <p class="text-xs text-gray-500">These hints guide the AI when scoring RICE and MoSCoW for new backlogs</p>

          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Business Priority Focus</label>
            <textarea [(ngModel)]="formData.aiPriorityHints" (ngModelChange)="markDirty()" rows="3"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
              placeholder="e.g. Prioritize features that increase transaction volume and reduce churn...">
            </textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">Risk Tolerance</label>
            <div class="flex gap-2">
              @for (level of riskLevels; track level) {
                <button
                  (click)="formData.riskTolerance = level; markDirty()"
                  [class]="formData.riskTolerance === level
                    ? 'flex-1 py-2 rounded-xl text-xs font-semibold bg-bca-primary text-white border border-bca-primary'
                    : 'flex-1 py-2 rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:border-bca-primary hover:text-bca-primary transition-colors'">
                  {{ level }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Jira Preview Modal -->
      @if (showJiraPreview()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="showJiraPreview.set(false)"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-modal-in">
            <h3 class="text-base font-semibold text-gray-800 mb-4">Jira Import Preview</h3>
            <p class="text-sm text-gray-500 mb-4">The following data was found in your Jira project. Review before applying:</p>
            <div class="bg-gray-50 rounded-xl p-4 space-y-2 mb-5 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Project:</span><span class="font-medium">myBCA Mobile - Core</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Open Epics:</span><span class="font-medium">12</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Target Quarter:</span><span class="font-medium">Q3 2025</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Team Size:</span><span class="font-medium">18 engineers</span></div>
            </div>
            <div class="flex gap-3">
              <button (click)="showJiraPreview.set(false)"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button (click)="applyJiraData()"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors">
                Apply Data
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductContextComponent implements OnInit {
  products = appStore.products;
  activeProductId = computed(() => appStore.activeProduct().id);
  isPulling = signal(false);
  showJiraPreview = signal(false);
  isDirty = signal(false);
  riskLevels = ['Low', 'Medium', 'High'];

  formData = {
    name: '',
    description: '',
    vision: '',
    targetUsers: 30,
    revenueTarget: '',
    budgetCeiling: '',
    regulatoryConstraints: '',
    technicalConstraints: '',
    aiPriorityHints: '',
    riskTolerance: 'Medium',
    okrs: [] as Array<{ id: string; objective: string; keyResults: Array<{ id: string; description: string }> }>,
  };

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.loadProduct(appStore.activeProduct());
  }

  private loadProduct(product: Product) {
    this.formData.name = product.name;
    this.formData.description = product.description;
    this.formData.vision = product.vision ?? '';
    this.formData.targetUsers = product.targetUsers ?? 30;
    this.formData.revenueTarget = product.revenueTarget ?? '';
    this.formData.budgetCeiling = 'IDR 2.5B per quarter';
    this.formData.regulatoryConstraints = 'OJK compliance required for all payment features.\nBI directive on open banking API integration.';
    this.formData.technicalConstraints = 'Legacy core banking system (CICS) — API integration via middleware only.\nMax 3 concurrent major releases per quarter.';
    this.formData.aiPriorityHints = 'Prioritize features that increase MAU and transaction volume.\nWeight customer retention features higher than acquisition.';
    this.formData.riskTolerance = 'Medium';
    this.formData.okrs = [
      {
        id: 'okr-1',
        objective: 'Grow myBCA active users by 20% in Q3',
        keyResults: [
          { id: 'kr-1', description: 'Onboard 2M new users via referral program' },
          { id: 'kr-2', description: 'Increase 30-day retention from 68% to 78%' },
        ],
      },
      {
        id: 'okr-2',
        objective: 'Increase digital transaction volume by 35%',
        keyResults: [
          { id: 'kr-3', description: 'Launch QRIS split-pay feature (June)' },
          { id: 'kr-4', description: 'Enable scheduled recurring payments' },
        ],
      },
    ];
    this.isDirty.set(false);
  }

  onProductChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const product = this.products().find(p => p.id === select.value);
    if (product) {
      appStore.activeProduct.set(product);
      this.loadProduct(product);
    }
  }

  markDirty() {
    this.isDirty.set(true);
  }

  saveChanges() {
    this.isDirty.set(false);
    this.toastService.show('success', 'Product context saved');
  }

  pullFromJira() {
    this.isPulling.set(true);
    setTimeout(() => {
      this.isPulling.set(false);
      this.showJiraPreview.set(true);
    }, 2000);
  }

  applyJiraData() {
    this.showJiraPreview.set(false);
    this.toastService.show('success', 'Jira data applied to product context');
    this.isDirty.set(true);
  }

  addOkr() {
    this.formData.okrs.push({
      id: 'okr-' + Date.now(),
      objective: '',
      keyResults: [{ id: 'kr-' + Date.now(), description: '' }],
    });
    this.markDirty();
  }

  removeOkr(index: number) {
    this.formData.okrs.splice(index, 1);
    this.markDirty();
  }

  addKr(okrIndex: number) {
    this.formData.okrs[okrIndex].keyResults.push({ id: 'kr-' + Date.now(), description: '' });
    this.markDirty();
  }

  removeKr(okrIndex: number, krIndex: number) {
    this.formData.okrs[okrIndex].keyResults.splice(krIndex, 1);
    this.markDirty();
  }
}
