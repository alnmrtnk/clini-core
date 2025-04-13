import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'login.page.html',
  styleUrl: 'login.page.scss',
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Implement login functionality
    console.log('Login with:', this.email, this.password);
    this.router.navigateByUrl('/tabs');
  }

  forgotPassword() {
    console.log('Forgot password');
    // Implement forgot password functionality
  }

  register() {
    console.log('Register');
    this.router.navigateByUrl('/auth/register');
  }
}
