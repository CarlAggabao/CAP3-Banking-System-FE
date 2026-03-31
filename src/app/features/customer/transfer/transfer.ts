import { Component, OnInit, signal} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { TransactionService } from '../../../core/services/transaction'
import { Account } from '../../../shared/models/account';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-transfer',
  imports: [ RouterModule, FormsModule, Navbar],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css',
})
export class Transfer implements OnInit {

  accounts = signal<Account[]>([]);
  selectedAccountNumber = signal<string>('');
  receiverAccountNumber: string = '';
  amount: number | null = null;
  description: string = '';
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  loading = signal<boolean>(false);

    constructor(
        private accountService: AccountService,
        private transactionService: TransactionService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.accountService.getMyAccounts().subscribe({
            next: (data) => {
                this.accounts.set(data);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message || 'Failed to load accounts');
            }
        });
    }

    getSelectedAccount(): Account | undefined {
      return this.accounts().find(account => account.accountNumber === this.selectedAccountNumber());
    }

    onSubmit(): void {
        if (!this.selectedAccountNumber() || !this.receiverAccountNumber || !this.amount) {
            this.errorMessage.set('Please fill in all required fields');
            return;
        }

        if (this.amount <= 0) {
            this.errorMessage.set('Amount must be greater than zero');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        this.transactionService.transfer({
            senderAccountNumber: this.selectedAccountNumber(),
            receiverAccountNumber: this.receiverAccountNumber,
            amount: this.amount,
            transactionDescription: this.description
        }).subscribe({
            next: () => {
                this.successMessage.set('Transfer successful!');
                setTimeout(() => {
                    this.loading.set(false);
                    this.router.navigate(['customer/dashboard']);
                }, 2000);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.message || 'Transfer failed');
            }
        });
    }

    formatBalance(balance: number): string {
        return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

}
