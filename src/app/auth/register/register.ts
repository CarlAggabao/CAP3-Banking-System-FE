import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';

const NAME_PATTERN = /^[a-zA-ZÀ-ÿ '-]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  errorMessage = signal('');
  successMessage = signal('');
  loading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(NAME_PATTERN)
      ]],
      middleName: ['', [
        Validators.maxLength(50),
        Validators.pattern(NAME_PATTERN)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(NAME_PATTERN)
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.pattern(USERNAME_PATTERN)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ]]
    });
  }

  get firstName()  { return this.registerForm.get('firstName')!; }
  get middleName() { return this.registerForm.get('middleName')!; }
  get lastName()   { return this.registerForm.get('lastName')!; }
  get username()   { return this.registerForm.get('username')!; }
  get password()   { return this.registerForm.get('password')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set(
          `Account created! Welcome, ${res.firstName}. Redirecting to login...`
        );
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Registration failed. Please try again.'
        );
      }
    });
  }
}