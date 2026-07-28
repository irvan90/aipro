import { Component, computed, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Backlog, BacklogStatus } from '../../core/models/backlog.model';
import { backlogStore } from '../../core/stores/backlog.store';

interface DailyInsight {
  type: 'market' | 'dependency' | 'performance';
  eyebrow: string;
  title: string;
  body: string;
  source: string;
  severity: 'high' | 'medium' | 'info';
  backlogId: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  searchValue = signal('');
  statusFilter = signal<BacklogStatus | 'all'>('all');
  sortBy = signal<'date'>('date');

  allBacklogs = backlogStore.all;
  fromMyService = computed(() => this.allBacklogs().filter(item => item.source === 'myservice' && (item.status === 'new' || !item.aiResult)));
  totalCount = computed(() => this.allBacklogs().length);
  doneCount = computed(() => this.allBacklogs().filter(item => item.status === 'delivered' || item.status === 'submitted').length);
  onProgressCount = computed(() => this.totalCount() - this.doneCount());

  filteredBacklogs = computed(() => {
    const query = this.searchValue().trim().toLowerCase();
    const status = this.statusFilter();
    let items = this.allBacklogs().filter(item => {
      const matchesQuery = !query || `${item.title} ${item.description}`.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || item.status === status;
      return matchesQuery && matchesStatus;
    });
    return [...items].sort((a, b) => {
      if (a.status === 'new' && b.status !== 'new') return -1;
      if (a.status !== 'new' && b.status === 'new') return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  });

  dailyInsights = computed<DailyInsight[]>(() => {
    const insights: DailyInsight[] = [];
    const pocketRupiah = this.allBacklogs().find(b => b.id === 'pocket-rupiah');
    
    if (pocketRupiah && pocketRupiah.status !== 'new' && pocketRupiah.status !== 'draft') {
      insights.push({
        type: 'market', eyebrow: 'Internet signal · High', title: 'Pocket Rupiah tertinggal dari ekspektasi pasar',
        body: 'Pemantauan fitur publik menemukan pola pocket/goal saving telah digunakan Jenius dan blu. AIPRO merekomendasikan review prioritas.',
        source: 'Public product pages · dipindai hari ini', severity: 'high', backlogId: 'pocket-rupiah',
      });
    }

    insights.push({
      type: 'market', eyebrow: 'News signal · High', title: 'Berita: Fitur Alokasi Dana Semakin Diminati',
      body: 'Media teknologi melaporkan bahwa fitur tabungan pos/pocket semakin diminati nasabah gen-Z. Tren digital banking mempercepat adopsi fitur ini.',
      source: 'Top tech media · 2 jam yang lalu', severity: 'high', backlogId: 'pocket-rupiah',
    });

    insights.push(
      {
        type: 'market', eyebrow: 'Industry News · Info', title: 'Tren: Personalisasi UI Meningkatkan Konversi',
        body: 'Studi terbaru menunjukkan bahwa UI aplikasi banking yang dapat dipersonalisasi sesuai kebutuhan user mampu meningkatkan engagement secara signifikan.',
        source: 'Fintech UX Report · Hari ini', severity: 'info', backlogId: 'pocket-rupiah',
      },
      {
        type: 'market', eyebrow: 'Productivity Insight · Medium', title: 'Adopsi AI Mempercepat Penyusunan Backlog',
        body: 'Riset menunjukkan tim Scrum yang menggunakan AI assistance mengalami peningkatan kecepatan hingga 20% dalam penyusunan acceptance criteria.',
        source: 'Agile Product Management Report · 1 hari yang lalu', severity: 'medium', backlogId: 'qris-retry',
      },
      {
        type: 'market', eyebrow: 'Industry News · Info', title: 'Peningkatan Adopsi QRIS di Kalangan UMKM',
        body: 'Laporan terbaru mencatat pertumbuhan volume transaksi QRIS lebih dari 130% tahun-ke-tahun, didorong oleh akselerasi digital UMKM.',
        source: 'Berita Ekonomi Nasional · 5 jam yang lalu', severity: 'info', backlogId: 'qris-retry',
      }
    );

    return insights;
  });

  statusLabel(status: BacklogStatus): string {
    return {
      new: 'New', draft: 'Draft', ai_scored: 'AI Scored', ready: 'Ready', not_ready: 'Not Ready',
      submitted: 'Submitted', archived: 'Archived', delivered: 'Done',
    }[status];
  }

  statusClass(status: BacklogStatus): string {
    if (status === 'delivered' || status === 'submitted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'ai_scored' || status === 'ready') return 'bg-blue-50 text-bca-primary border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  }

  insightClass(severity: DailyInsight['severity']): string {
    return {
      high: 'border-red-200 bg-red-50/60',
      medium: 'border-amber-200 bg-amber-50/60',
      info: 'border-blue-200 bg-blue-50/60',
    }[severity];
  }

  trackByBacklog(_: number, backlog: Backlog): string { return backlog.id; }
}
