import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { take, finalize, debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'login.page.html',
  styleUrl: 'login.page.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  isLoading = false;

  async login() {
    this.isLoading = true;

    this.authService
      .login(this.email, this.password)
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: () => this.router.navigateByUrl('/tabs/dashboard'),
        error: (err) => {
          console.error('Login failed', err);
        },
      });
  }

  forgotPassword() {
    console.log('Forgot password');
  }

  register() {
    this.router.navigateByUrl('/auth/register');
  }
}
