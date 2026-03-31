import { Component, OnInit, signal } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router} from '@angular/router';
import { AccountService } from '../../../core/services/account';
import { TransactionService } from '../../../core/services/transaction';
import { Account } from '../../../shared/models/account';
import { Transaction } from '../../../shared/models/transaction';
import { Navbar } from '../../../shared/components/navbar/navbar';


@Component({
  selector: 'app-account-details',
  imports: [Navbar, RouterModule, NgClass, DatePipe],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})
export class AccountDetails {
  account = signal<Account | null>(null);
  transactions = signal<Transaction[]>([]);
  errorMessage = signal<string>('');

  constructor(
      private accountService: AccountService,
      private transactionService: TransactionService,
      private route: ActivatedRoute,
      private router: Router
  ) {}


  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.loadAccount(Number(id));
      }
  }

  loadAccount(id: number): void {
      this.accountService.getAccountById(id).subscribe({
          next: (data) => {
              this.account.set(data);
              this.loadRecentTransactions(data.accountNumber);
          },
          error: (err) => {
              this.errorMessage.set(err.error?.message || 'Failed to load account');
          }
      });
  }

  loadRecentTransactions(accountNumber: string): void {
      this.transactionService.getMyTransactions(accountNumber).subscribe({
          next: (data) => {
              this.transactions.set(data.slice(0, 5));
          },
          error: (err) => {
              this.errorMessage.set(err.error?.message || 'Failed to load transactions');
          }
      });
  }

  isSent(transaction: Transaction): boolean {
      return transaction.senderAccountNumber === this.account()?.accountNumber;
  }

  formatBalance(balance: number): string {
      return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
