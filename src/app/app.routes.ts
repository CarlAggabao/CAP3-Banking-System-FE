import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
import { Dashboard } from './features/customer/dashboard/dashboard';

export const routes: Routes = [
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },

  // Add your dashboard routes here later
  // { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];