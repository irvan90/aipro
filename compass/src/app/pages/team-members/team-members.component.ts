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
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.css',
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
