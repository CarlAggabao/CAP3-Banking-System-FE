import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard, adminGuard } from './guards/auth-guard';
import { Dashboard } from './features/customer/dashboard/dashboard';

export const routes: Routes = [
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./features/admin/admin-dashboard/components/overview/overview')
        .then(m => m.Overview)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/admin-dashboard/components/user-management/user-management')
          .then(m => m.UserManagement)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/admin/admin-dashboard/components/account-management/account-management')
          .then(m => m.AccountManagement)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/admin/admin-dashboard/components/transaction-list/transaction-list')
          .then(m => m.TransactionList)
      },
      {
        path: 'audit-log',
        loadComponent: () => import('./features/admin/admin-dashboard/components/audit-log/audit-log')
          .then(m => m.AuditLogManagement)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];