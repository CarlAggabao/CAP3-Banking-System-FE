import { Component, OnInit, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account';
import { Account } from '../../../shared/models/account';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, RouterModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  accounts = signal<Account[]>([]);
  errorMessage = signal<string>('');

  totalBalance = computed(() =>
    this.accounts().reduce((sum, acc) => sum + acc.balance, 0)
    );

    activeAccounts = computed(() =>
        this.accounts().filter(acc => acc.status === 'ACTIVE').length
    );

  constructor(private accountService: AccountService){}

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.accountService.getMyAccounts().subscribe({
            next: (data) => {
                console.log('accounts data:', data);
                this.accounts.set(data)
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to load accounts';
            }
        });
    }

    formatBalance(balance: number): string {
        return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }   
    
    hasSavingsAccount = computed(() =>
    this.accounts().some(acc => acc.accountType === 'SAVINGS')
    );
}
