import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../../../core/services/transaction';
import { Transaction } from '../../../../../shared/models/transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css'
})
export class TransactionList implements OnInit {
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  error = signal('');

  searchTerm = signal('');
  statusFilter = signal('ALL');
  typeFilter = signal('ALL');

  filteredTransactions = computed(() => {
    let result = this.transactions();
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    const type = this.typeFilter();

    if (term) {
      result = result.filter(t =>
        t.senderAccountNumber.toLowerCase().includes(term) ||
        t.receiverAccountNumber.toLowerCase().includes(term) ||
        (t.transactionDescription?.toLowerCase().includes(term) ?? false)
      );
    }

    if (status !== 'ALL') {
      result = result.filter(t => t.status === status);
    }

    if (type !== 'ALL') {
      result = result.filter(t => t.transactionType === type);
    }

    return result;
  });

  totalAmount = computed(() =>
    this.filteredTransactions()
      .filter(t => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading.set(true);
    this.error.set('');
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load transactions.');
        this.loading.set(false);
      }
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('ALL');
    this.typeFilter.set('ALL');
  }

  hasActiveFilters = computed(() =>
    this.searchTerm() !== '' ||
    this.statusFilter() !== 'ALL' ||
    this.typeFilter() !== 'ALL'
  );
}