import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MOCK_USERS } from '../../core/services/mock-data.service';
import { User, UserRole } from '../../core/models/user.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 animate-fade-up">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Team Members</h1>
          <p class="text-sm text-gray-500 mt-1">Manage team members and their roles</p>
        </div>
        <button (click)="showAddPanel.set(true)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors shadow-blue w-fit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Member
        </button>
      </div>

      <!-- Filter + Search Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
          </svg>
          <input
            [(ngModel)]="searchQuery"
            placeholder="Search members..."
            class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
        </div>
        <select
          [(ngModel)]="roleFilter"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
          <option value="">All Roles</option>
          @for (role of allRoles; track role) {
            <option [value]="role">{{ role }}</option>
          }
        </select>
      </div>

      <!-- Members Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (member of filteredMembers(); track member.id) {
          <div class="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <!-- Avatar -->
                <div [class]="getAvatarClass(member.role)"
                  class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {{ getInitials(member.name) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>
              </div>
              <!-- Actions Dropdown -->
              <div class="relative">
                <button (click)="toggleMemberMenu(member.id)"
                  class="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
                @if (openMenuId() === member.id) {
                  <div class="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 w-32">
                    <button (click)="editMember(member)"
                      class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Edit
                    </button>
                    <button (click)="removeMember(member)"
                      class="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                }
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <!-- Role Badge -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Role</span>
                <span [class]="getRoleBadge(member.role)">{{ member.role }}</span>
              </div>
              <!-- Department -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Department</span>
                <span class="text-xs font-medium text-gray-700">{{ member.department ?? 'Digital Banking' }}</span>
              </div>
              <!-- Status -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Status</span>
                <div class="flex items-center gap-1.5">
                  <div [class]="member.isActive !== false ? 'w-1.5 h-1.5 rounded-full bg-green-500' : 'w-1.5 h-1.5 rounded-full bg-gray-400'"></div>
                  <span class="text-xs text-gray-700">{{ member.isActive !== false ? 'Active' : 'Inactive' }}</span>
                </div>
              </div>
            </div>
          </div>
        }
        @if (filteredMembers().length === 0) {
          <div class="col-span-3 bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div class="w-12 h-12 rounded-xl bg-gray-100 mx-auto flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <p class="text-sm text-gray-500">No members match your search</p>
          </div>
        }
      </div>

      <!-- Add Member Slide Panel -->
      @if (showAddPanel()) {
        <div class="fixed inset-0 z-50 flex justify-end">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" (click)="closeAddPanel()"></div>
          <div class="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl animate-slide-right">
            <div class="p-5">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h3 class="text-base font-semibold text-gray-800">{{ editingMember() ? 'Edit Member' : 'Add Team Member' }}</h3>
                  <p class="text-xs text-gray-500 mt-0.5">{{ editingMember() ? 'Update member details' : 'Add via SSO or manual entry' }}</p>
                </div>
                <button (click)="closeAddPanel()" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- SSO Search (Add mode only) -->
              @if (!editingMember()) {
                <div class="mb-4">
                  <label class="block text-xs font-medium text-gray-600 mb-2">Search by BCA SSO / Email</label>
                  <div class="relative">
                    <input
                      [(ngModel)]="ssoSearch"
                      (input)="onSsoSearch()"
                      placeholder="e.g. johndoe@bca.co.id"
                      class="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary">
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
                      </svg>
                    </div>
                  </div>
                  @if (ssoSearch.trim()) {
                    <div class="mt-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div class="p-3 flex items-center gap-2 hover:bg-bca-accent cursor-pointer transition-colors"
                        (click)="fillFromSso()">
                        <div class="w-7 h-7 rounded-full bg-bca-navy flex items-center justify-center">
                          <span class="text-xs font-bold text-white">JS</span>
                        </div>
                        <div>
                          <p class="text-xs font-semibold text-gray-800">Joko Susanto</p>
                          <p class="text-xs text-gray-400">joko.susanto&#64;bca.co.id</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div class="relative mb-4">
                  <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
                  <div class="relative flex justify-center"><span class="bg-white px-2 text-xs text-gray-400">or fill manually</span></div>
                </div>
              }

              <!-- Form -->
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                  <input [(ngModel)]="formName"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
                    placeholder="Full name">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
                  <input [(ngModel)]="formEmail" type="email"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
                    placeholder="email@bca.co.id">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Role *</label>
                  <select [(ngModel)]="formRole"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 bg-white">
                    @for (role of allRoles; track role) {
                      <option [value]="role">{{ role }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Department</label>
                  <input [(ngModel)]="formDepartment"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bca-primary/30 focus:border-bca-primary"
                    placeholder="e.g. Digital Banking">
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <button (click)="closeAddPanel()"
                  class="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button (click)="saveMember()"
                  [disabled]="!formName.trim() || !formEmail.trim()"
                  class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-bca-primary text-white hover:bg-bca-hover transition-colors disabled:opacity-50">
                  {{ editingMember() ? 'Save Changes' : 'Add Member' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class TeamMembersComponent implements OnInit {
  members = signal<User[]>([]);
  showAddPanel = signal(false);
  editingMember = signal<User | null>(null);
  openMenuId = signal<string | null>(null);
  ssoSearch = '';
  searchQuery = '';
  roleFilter = '';
  formName = '';
  formEmail = '';
  formRole: UserRole = 'Dev';
  formDepartment = '';

  allRoles: UserRole[] = ['PO', 'APO', 'PMO', 'Dev', 'BA', 'QA'];

  filteredMembers = computed(() => {
    let list = this.members();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    if (this.roleFilter) {
      list = list.filter(m => m.role === this.roleFilter);
    }
    return list;
  });

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.members.set([...MOCK_USERS]);
  }

  toggleMemberMenu(id: string) {
    this.openMenuId.set(this.openMenuId() === id ? null : id);
  }

  editMember(member: User) {
    this.editingMember.set(member);
    this.formName = member.name;
    this.formEmail = member.email;
    this.formRole = member.role;
    this.formDepartment = member.department ?? '';
    this.showAddPanel.set(true);
    this.openMenuId.set(null);
  }

  removeMember(member: User) {
    if (confirm(`Remove ${member.name} from the team?`)) {
      this.members.update(list => list.filter(m => m.id !== member.id));
      this.toastService.show('success', `${member.name} removed from team`);
    }
    this.openMenuId.set(null);
  }

  saveMember() {
    if (!this.formName.trim() || !this.formEmail.trim()) return;
    const editing = this.editingMember();
    if (editing) {
      this.members.update(list =>
        list.map(m => m.id === editing.id
          ? { ...m, name: this.formName, email: this.formEmail, role: this.formRole, department: this.formDepartment }
          : m)
      );
      this.toastService.show('success', `${this.formName} updated`);
    } else {
      const newMember: User = {
        id: 'user-' + Date.now(),
        name: this.formName,
        email: this.formEmail,
        role: this.formRole,
        department: this.formDepartment,
        avatar: '',
        isActive: true,
      };
      this.members.update(list => [...list, newMember]);
      this.toastService.show('success', `${this.formName} added to team`);
    }
    this.closeAddPanel();
  }

  closeAddPanel() {
    this.showAddPanel.set(false);
    this.editingMember.set(null);
    this.formName = '';
    this.formEmail = '';
    this.formRole = 'Dev';
    this.formDepartment = '';
    this.ssoSearch = '';
  }

  onSsoSearch() {}

  fillFromSso() {
    this.formName = 'Joko Susanto';
    this.formEmail = 'joko.susanto@bca.co.id';
    this.formRole = 'Dev';
    this.formDepartment = 'Digital Banking';
    this.ssoSearch = '';
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  getAvatarClass(role: UserRole): string {
    const map: Partial<Record<UserRole, string>> = {
      PO: 'bg-bca-navy',
      APO: 'bg-bca-primary',
      PMO: 'bg-purple-600',
      Dev: 'bg-green-600',
      BA: 'bg-yellow-600',
      QA: 'bg-orange-500',
    };
    return map[role] ?? 'bg-gray-500';
  }

  getRoleBadge(role: UserRole): string {
    const map: Partial<Record<UserRole, string>> = {
      PO: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-bca-navy text-white',
      APO: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-bca-primary text-white',
      PMO: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700',
      Dev: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700',
      BA: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700',
      QA: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700',
    };
    return map[role] ?? 'px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600';
  }
}
