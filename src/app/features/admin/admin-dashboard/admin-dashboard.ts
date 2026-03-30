import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername();
  }

  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }

  logout(): void {
  this.authService.logout().subscribe({
    next: () => this.router.navigate(['/login']),
    error: () => this.router.navigate(['/login'])
  });
}
}