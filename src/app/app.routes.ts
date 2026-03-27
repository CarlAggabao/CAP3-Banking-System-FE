import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
import { Dashboard } from './features/customer/dashboard/dashboard';
import { Transactions } from './features/customer/transactions/transactions';
import { Transfer } from './features/customer/transfer/transfer';

export const routes: Routes = [
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'transactions', component: Transactions},
  { path: 'customer/transfer', component: Transfer},

  // Add your dashboard routes here later
  // { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];