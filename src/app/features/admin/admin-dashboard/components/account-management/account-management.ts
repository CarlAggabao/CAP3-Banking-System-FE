import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../../core/services/account';
import { Account } from '../../../../../shared/models/account';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-management.html',
  styleUrl: './account-management.css'
})
export class AccountManagement implements OnInit {
  accounts = signal<Account[]>([]);
  loading = signal(true);
  actionLoading = signal(false);
  error = signal('');
  successMessage = signal('');

  searchTerm = signal('');
  statusFilter = signal('ALL');
  typeFilter = signal('ALL');

  filteredAccounts = computed(() => {
    let result = this.accounts();
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    const type = this.typeFilter();

    if (term) {
      result = result.filter(a =>
        a.accountNumber.toLowerCase().includes(term) ||
        a.firstName.toLowerCase().includes(term) ||
        a.lastName.toLowerCase().includes(term) ||
        a.username.toLowerCase().includes(term)
      );
    }

    if (status !== 'ALL') {
      result = result.filter(a => a.status === status);
    }

    if (type !== 'ALL') {
      result = result.filter(a => a.accountType === type);
    }

    return result;
  });

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading.set(true);
    this.error.set('');
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load accounts.');
        this.loading.set(false);
      }
    });
  }

  toggleAccountStatus(account: Account): void {
    this.actionLoading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const action = account.status === 'ACTIVE'
      ? this.accountService.deactivateAccount(account.id)
      : this.accountService.activateAccount(account.id);

    action.subscribe({
      next: (updated) => {
        this.accounts.update(accounts =>
          accounts.map(a => a.id === updated.id ? updated : a)
        );
        this.actionLoading.set(false);
        this.successMessage.set(
          `Account ${updated.accountNumber} ${updated.status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully.`
        );
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Failed to update account status.');
        this.actionLoading.set(false);
      }
    });
  }
}