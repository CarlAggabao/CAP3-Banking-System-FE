import { Component, OnInit, signal, computed} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction';
import { AccountService } from '../../../core/services/account';
import { NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../../shared/models/account';
import { Transaction } from '../../../shared/models/transaction';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-transactions',
  imports: [NgClass, RouterModule, FormsModule, DatePipe, Navbar],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit{

  accounts = signal<Account[]>([]);
  transactions = signal<Transaction[]>([]);
  errorMessage = signal<string>('');

  filterAccountNumber = signal<string>('');
  filterType = signal<string>('');
  filterDateFrom = signal<string>('');
  filterDateTo = signal<string>('');

  constructor (
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  //Determines which filters are used.
  filteredTransactions = computed(() => {
      return this.transactions().filter(t => {
          const matchesType = this.filterType()
              ? t.transactionType === this.filterType()
              : true;
          const matchesDateFrom = this.filterDateFrom()
              ? new Date(t.createdAt) >= new Date(this.filterDateFrom())
              : true;
          const matchesDateTo = this.filterDateTo()
              ? new Date(t.createdAt) <= new Date(this.filterDateTo() + 'T23:59:59')
              : true;
          const matchesAccount = this.filterAccountNumber()
              ? t.senderAccountNumber === this.filterAccountNumber() || t.receiverAccountNumber === this.filterAccountNumber()
              : true;
          return matchesType && matchesDateFrom && matchesDateTo && matchesAccount;
      });
  });
  
  loadTransactions(): void {
    console.log('loadTransactions called');
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) =>{
        console.log('accounts:', accounts);
        this.accounts.set(accounts);
        const allTransactions: Transaction[] = [];
        let completed = 0;

        accounts.forEach(account => {
          this.transactionService.getMyTransactions(account.accountNumber).subscribe({
            next: (data) =>{
              allTransactions.push(...data);
              completed++;
              if (completed === accounts.length){
                const sorted = allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                const unique = sorted.filter((t, index, self) =>
                    index === self.findIndex(x => x.id === t.id)
                );
                this.transactions.set(unique);
              }

            },
            error:() => {completed ++; }
          });

        });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || "Failed to Load Transactions");
      }
    });
  }

  isSent(transaction: Transaction): boolean {
      return this.accounts().some(acc => acc.accountNumber === transaction.senderAccountNumber);
  }

  resetFilters(): void {
      this.filterType.set('');
      this.filterDateFrom.set('');
      this.filterDateTo.set('');
      this.filterAccountNumber.set(''); 
  }

  formatBalance(balance: number): string {
      return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }


  
}
