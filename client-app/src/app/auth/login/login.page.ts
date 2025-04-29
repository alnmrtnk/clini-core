import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'login.page.html',
  styleUrl: 'login.page.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);

  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(() => {
      console.log('u are logged into this fucking app :)');
    })
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
