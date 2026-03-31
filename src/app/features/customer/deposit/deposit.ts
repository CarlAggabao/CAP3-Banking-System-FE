import { Component, OnInit, signal } from '@angular/core';  
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { Account } from '../../../shared/models/account';
import { Navbar } from '../../../shared/components/navbar/navbar';


@Component({
  selector: 'app-deposit',
  imports: [Navbar, RouterModule, FormsModule],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
})
export class Deposit {
  accounts = signal<Account[]>([]);
  selectedAccountId = signal<number | null>(null);
  amount: number | null = null;
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  loading = signal<boolean>(false);


  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ){}


  ngOnInit(): void {
      this.loadAccounts();
  }

  loadAccounts(): void {
      this.accountService.getMyAccounts().subscribe({
          next: (data) => {
              this.accounts.set(data);
              const accountId = this.route.snapshot.queryParamMap.get('accountId');
              if (accountId) {
                  this.selectedAccountId.set(Number(accountId));
              }
          },
          error: (err) => {
              this.errorMessage.set(err.error?.message || 'Failed to load accounts');
          }
      });
  }

  getSelectedAccount(): Account | undefined {
      return this.accounts().find(acc => acc.id === this.selectedAccountId());
  }

  onSubmit(): void {
      if (!this.selectedAccountId() || !this.amount) {
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

      this.accountService.depositBalance(this.selectedAccountId()!, this.amount).subscribe({
          next: () => {
              this.loading.set(false);
              this.successMessage.set('Deposit successful!');
              setTimeout(() => this.router.navigate(['customer/dashboard']), 2000);
          },
          error: (err) => {
              this.loading.set(false);
              this.errorMessage.set(err.error?.message || 'Deposit failed');
          }
      });
  }

  formatBalance(balance: number): string {
      return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
