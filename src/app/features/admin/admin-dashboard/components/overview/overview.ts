import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../core/services/user';
import { AccountService } from '../../../../../core/services/account';
import { TransactionService } from '../../../../../core/services/transaction';
import { User } from '../../../../../shared/models/user';
import { Account } from '../../../../../shared/models/account';
import { Transaction } from '../../../../../shared/models/transaction';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview implements OnInit {
  // Signals
  users = signal<User[]>([]);
  accounts = signal<Account[]>([]);
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  error = signal('');

  // Computed signals — auto update when source signals change
  totalUsers = computed(() => this.users().length);
  activeUsers = computed(() => this.users().filter(u => u.status === 'ACTIVE').length);
  inactiveUsers = computed(() => this.users().filter(u => u.status === 'INACTIVE').length);

  totalAccounts = computed(() => this.accounts().length);
  activeAccounts = computed(() => this.accounts().filter(a => a.status === 'ACTIVE').length);
  inactiveAccounts = computed(() => this.accounts().filter(a => a.status === 'INACTIVE').length);

  totalTransactions = computed(() => this.transactions().length);
  successTransactions = computed(() => this.transactions().filter(t => t.status === 'SUCCESS').length);
  failedTransactions = computed(() => this.transactions().filter(t => t.status === 'FAILED').length);
  pendingTransactions = computed(() => this.transactions().filter(t => t.status === 'PENDING').length);

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
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