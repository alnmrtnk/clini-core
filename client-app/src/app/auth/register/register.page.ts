import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'register.page.html',
  styleUrl: 'register.page.scss',
})
export class RegisterPage {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreeToTerms = false;

  constructor(private router: Router) {}

  register() {
    // Implement register functionality
    console.log('Register with:', this.fullName, this.email, this.password);
    this.router.navigateByUrl('/tabs');
  }

  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
