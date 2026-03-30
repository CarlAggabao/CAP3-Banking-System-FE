import { Component, signal } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account';

@Component({
  selector: 'app-apply-savings',
  imports: [Navbar, RouterModule],
  templateUrl: './apply-savings.html',
  styleUrl: './apply-savings.css',
})
export class ApplySavings {
    loading = signal<boolean>(false);
    errorMessage = signal<string>('');
    successMessage = signal<string>('');
    showConfirmModal = signal<boolean>(false);

    constructor(
        private accountService: AccountService,
        private router: Router
    ) {}

    openConfirmModal(): void {
        this.showConfirmModal.set(true);
    }

    closeConfirmModal(): void {
        this.showConfirmModal.set(false);
    }

    confirmApply(): void {
        this.loading.set(true);
        this.errorMessage.set('');
        this.closeConfirmModal();

        this.accountService.applyForSavingsAccount().subscribe({
            next: () => {
                this.loading.set(false);
                this.successMessage.set('Your savings account has been successfully opened!');
                setTimeout(() => this.router.navigate(['customer/dashboard']), 2000);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.message || 'Failed to open savings account');
            }
        });
    }
}
