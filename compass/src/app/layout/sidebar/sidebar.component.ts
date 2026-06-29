import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { appStore } from '../../core/stores/app.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  store = appStore;
  showProductDropdown = signal(false);

  switchProduct(productId: string): void {
    const product = this.store.products().find(item => item.id === productId);
    if (product) this.store.activeProduct.set(product);
    this.showProductDropdown.set(false);
  }
}
