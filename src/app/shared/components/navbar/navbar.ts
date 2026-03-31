import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
    username: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.username = this.authService.getUsername();
    }

    // logout(): void {
    //     this.authService.logout();
    //     this.router.navigate(['/login']);
    // }

    logout(): void {
        this.authService.logout().subscribe({
            next: () => this.router.navigate(['/login']),
            error: () => this.router.navigate(['/login'])
        });
    }
}