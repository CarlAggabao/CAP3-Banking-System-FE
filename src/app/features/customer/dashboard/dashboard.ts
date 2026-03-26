import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account';
import { Account } from '../../../shared/models/account';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  accounts: Account[] = [];
  errorMessage: string = '';

  constructor(private accountService: AccountService){}

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.accountService.getAccountsByUserId(user.id).subscribe({
            next: (data) => {
                this.accounts = data;
            },
            error: (err) => {
                this.errorMessage = err.error.message || 'Failed to load accounts';
            }
        });
    }
}
