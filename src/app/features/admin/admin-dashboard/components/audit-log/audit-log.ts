import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../../../../core/services/audit-log';
import { AuditLog, AuditLogPage } from '../../../../../shared/models/audit-log';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.css'
})
export class AuditLogManagement implements OnInit {
  logs = signal<AuditLog[]>([]);
  loading = signal(true);
  error = signal('');

  // Filters
  actorSearch = signal('');
  actionFilter = signal('');
  fromDate = signal('');
  toDate = signal('');

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 20;

  // All available actions for dropdown
  actions = [
    { value: '', label: 'All Actions' },
    { value: 'LOGIN_SUCCESS', label: 'Login Success' },
    { value: 'LOGIN_FAILED_INVALID_PASSWORD', label: 'Login Failed (Wrong Password)' },
    { value: 'LOGIN_FAILED_USER_NOT_FOUND', label: 'Login Failed (User Not Found)' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'USER_UPDATED', label: 'User Updated' },
    { value: 'USER_DEACTIVATED', label: 'User Deactivated' },
    { value: 'USER_RESTORED', label: 'User Restored' },
    { value: 'ACCOUNT_ACTIVATED', label: 'Account Activated' },
    { value: 'ACCOUNT_DEACTIVATED', label: 'Account Deactivated' },
  ];

  hasActiveFilters = computed(() =>
    this.actorSearch() !== '' ||
    this.actionFilter() !== '' ||
    this.fromDate() !== '' ||
    this.toDate() !== ''
  );

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page: number = 0): void {
    this.loading.set(true);
    this.error.set('');

    // Convert date strings to ISO format for backend
    const from = this.fromDate() ? `${this.fromDate()}T00:00:00` : undefined;
    const to = this.toDate() ? `${this.toDate()}T23:59:59` : undefined;

    this.auditLogService.search(
      this.actorSearch() || undefined,
      this.actionFilter() || undefined,
      from,
      to,
      page,
      this.pageSize
    ).subscribe({
      next: (data: AuditLogPage) => {
        this.logs.set(data.content);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.currentPage.set(data.number);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load audit logs.');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.loadLogs(0);
  }

  clearFilters(): void {
    this.actorSearch.set('');
    this.actionFilter.set('');
    this.fromDate.set('');
    this.toDate.set('');
    this.loadLogs(0);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadLogs(page);
  }

  getStatusClass(status: string): string {
    return status === 'SUCCESS' ? 'bg-success' : 'bg-danger';
  }

  getActionClass(action: string): string {
    if (action.includes('FAILED')) return 'text-danger';
    if (action.includes('DEACTIVATED')) return 'text-warning';
    if (action.includes('SUCCESS') || action.includes('RESTORED') || action.includes('ACTIVATED')) return 'text-success';
    return 'text-muted';
  }

  formatAction(action: string): string {
    return action.replace(/_/g, ' ');
  }

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i)
  );
}