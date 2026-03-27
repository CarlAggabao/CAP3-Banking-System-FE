import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../../core/services/user';
import { User } from '../../../../../shared/models/user';
import { UpdateUserRequest } from '../../../../../shared/models/update-user-request';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  loading = signal(true);
  actionLoading = signal(false);
  error = signal('');
  successMessage = signal('');
  searchTerm = signal('');
  statusFilter = signal('ALL');

  filteredUsers = computed(() => {
    let result = this.users();
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();

    if (term) {
      result = result.filter(u =>
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term)
      );
    }

    if (status !== 'ALL') {
      result = result.filter(u => u.status === status);
    }

    return result;
  });

  editForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      firstName:  ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      lastName:   ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load users.');
        this.loading.set(false);
      }
    });
  }

  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.successMessage.set('');
    this.error.set('');
    this.editForm.patchValue({
      firstName:  user.firstName,
      middleName: user.middleName ?? '',
      lastName:   user.lastName
    });
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.selectedUser()) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.actionLoading.set(true);
    const payload: UpdateUserRequest = this.editForm.value;
    const user = this.selectedUser()!;

    this.userService.updateUser(user.id, payload).subscribe({
      next: (updated) => {
        this.users.update(users =>
          users.map(u => u.id === updated.id ? updated : u)
        );
        this.actionLoading.set(false);
        this.successMessage.set('User updated successfully.');
        this.closeModal();
      },
      error: () => {
        this.error.set('Failed to update user.');
        this.actionLoading.set(false);
      }
    });
  }

  toggleUserStatus(user: User): void {
    this.actionLoading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const action = user.status === 'ACTIVE'
      ? this.userService.deactivateUser(user.id)
      : this.userService.restoreUser(user.id);

    action.subscribe({
      next: (updated) => {
        this.users.update(users =>
          users.map(u => u.id === updated.id ? updated : u)
        );
        this.actionLoading.set(false);
        this.successMessage.set(
          `User ${updated.status === 'ACTIVE' ? 'restored' : 'deactivated'} successfully.`
        );
      },
      error: () => {
        this.error.set('Failed to update user status.');
        this.actionLoading.set(false);
      }
    });
  }

  closeModal(): void {
    this.selectedUser.set(null);
    this.editForm.reset();
  }

  get firstName() { return this.editForm.get('firstName')!; }
  get middleName() { return this.editForm.get('middleName')!; }
  get lastName()   { return this.editForm.get('lastName')!; }
}