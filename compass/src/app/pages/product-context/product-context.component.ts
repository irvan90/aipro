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
  templateUrl: './product-context.component.html',
  styleUrl: './product-context.component.css',
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
