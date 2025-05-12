import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'register.page.html',
  styleUrl: 'register.page.scss',
})
export class RegisterPage {
  authService = inject(AuthService);
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(private router: Router) {}

  register() {
    this.isLoading = true;

    this.authService
      .register(this.email, this.password, this.fullName)
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: () => this.router.navigateByUrl('/auth/login'),
        error: (err) => {
          console.error('Login failed', err);
        },
      });
  }

  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
