import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest{
  username: string;
  password: string;
}

export interface LoginResponse{
  token: string;
}

export interface RegisterRequest{
  firstName: string;
  middleName?: string;
  lastName: string
  username: string;
  password: string;
}

export interface RegisterResponse{
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  role: 'CUSTOMER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
//Renamed Auth to Authservices
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        const decoded = JSON.parse(atob(res.token.split('.')[1]));
        localStorage.setItem('role', decoded.role ?? '');
        localStorage.setItem('username', decoded.sub ?? '');
      })
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, payload);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string {
    return localStorage.getItem('role') ?? '';
  }

  isAdmin(): boolean {
    return this.getRole().includes('ADMIN');
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }
}
