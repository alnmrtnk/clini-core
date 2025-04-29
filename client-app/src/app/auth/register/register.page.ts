import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  agreeToTerms = false;

  constructor(private router: Router) {}

  register() {
    // Implement register functionality

    this.authService.register(this.email, this.password, this.fullName).subscribe(() => {
      console.log('something happened');
    });

    // console.log('Register with:', this.fullName, this.email, this.password);
    // this.router.navigateByUrl('/tabs');
  }

  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
