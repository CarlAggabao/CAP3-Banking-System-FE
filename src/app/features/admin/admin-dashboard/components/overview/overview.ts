import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserService } from '../../../../../core/services/user';
import { AccountService } from '../../../../../core/services/account';
import { TransactionService } from '../../../../../core/services/transaction';
import { User } from '../../../../../shared/models/user';
import { Account } from '../../../../../shared/models/account';
import { Transaction } from '../../../../../shared/models/transaction';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview implements OnInit {
  users = signal<User[]>([]);
  accounts = signal<Account[]>([]);
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  error = signal('');
  volumeRange = signal<'weekly' | 'monthly'>('weekly');

  private refreshSubscription?: Subscription;
  private routerSubscription?: Subscription;

  // ── KPI ──────────────────────────────────────────────
  totalUsers = computed(() => this.users().length);
  totalAccounts = computed(() => this.accounts().length);
  totalTransactions = computed(() => this.transactions().length);
  successfulVolume = computed(() =>
    this.transactions()
      .filter(t => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // ── Transaction Status Donut ──────────────────────────
  transactionStatusData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Success', 'Pending', 'Failed'],
    datasets: [{
      data: [
        this.transactions().filter(t => t.status === 'SUCCESS').length,
        this.transactions().filter(t => t.status === 'PENDING').length,
        this.transactions().filter(t => t.status === 'FAILED').length,
      ],
      backgroundColor: ['#198754', '#ffc107', '#dc3545'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }));

  // ── Account Status Donut ──────────────────────────────
  accountStatusData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [
        this.accounts().filter(a => a.status === 'ACTIVE').length,
        this.accounts().filter(a => a.status === 'INACTIVE').length,
      ],
      backgroundColor: ['#198754', '#dc3545'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }));

  // ── Transaction Volume Bar ────────────────────────────
  volumeChartData = computed<ChartData<'bar'>>(() => {
    const days = this.volumeRange() === 'weekly' ? 7 : 30;
    const grouped = new Map<string, number>();

    // Pre-fill all days with 0 so empty days still show
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().substring(0, 10);
      grouped.set(key, 0);
    }

    // Fill in actual transaction amounts
    this.transactions()
      .filter(t => t.status === 'SUCCESS')
      .forEach(t => {
        const day = t.createdAt.substring(0, 10);
        if (grouped.has(day)) {
          grouped.set(day, (grouped.get(day) ?? 0) + t.amount);
        }
      });

    return {
      labels: Array.from(grouped.keys()).map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'Successful Volume (₱)',
        data: Array.from(grouped.values()),
        backgroundColor: 'rgba(13, 110, 253, 0.75)',
        borderColor: '#0d6efd',
        borderWidth: 1,
        borderRadius: 6,
      }]
    };
  });

  // ── Chart Options ─────────────────────────────────────
  donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 12 }, padding: 16 }
      }
    }
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ₱${Number(ctx.raw).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₱${Number(value).toLocaleString('en-PH')}`
        },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private router: Router  
  ) {}



  ngOnInit(): void {
    this.loadOverview();

    // Reload when navigating to overview tab
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(event => (event as NavigationEnd).urlAfterRedirects.includes('overview'))
    ).subscribe(() => this.loadOverview());

    // Auto refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadOverview();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  loadOverview(): void {
    this.loading.set(true);
    this.error.set('');

    this.userService.getAllUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.error.set('Failed to load user data.')
    });

    this.accountService.getAllAccounts().subscribe({
      next: (data) => this.accounts.set(data),
      error: () => this.error.set('Failed to load account data.')
    });

    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load transaction data.');
        this.loading.set(false);
      }
    });
  }
}