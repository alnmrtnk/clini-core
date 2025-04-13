import { Component } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content>
      <div class="login-container page-wrapper">
        <div class="logo-container">
          <h1 class="app-name">CliniCore</h1>
          <p class="app-tagline">Your Medical Data, Simplified</p>
        </div>
        
        <div class="form-container">
          <ion-card>
            <ion-card-content>
              <form (ngSubmit)="login()">
                <ion-item>
                  <ion-label position="floating">Email</ion-label>
                  <ion-input type="email" [(ngModel)]="email" name="email" required></ion-input>
                </ion-item>
                
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input type="password" [(ngModel)]="password" name="password" required></ion-input>
                </ion-item>
                
                <ion-button expand="block" type="submit" color="primary" class="ion-margin-top">
                  Log In
                </ion-button>
              </form>
              
              <div class="forgot-password">
                <ion-button fill="clear" size="small" (click)="forgotPassword()">
                  Forgot Password?
                </ion-button>
              </div>
              
              <div class="divider">
                <span>OR</span>
              </div>
              
              <ion-button expand="block" fill="outline" color="primary" (click)="register()">
                Create Account
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
    .login-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 16px;
      background: radial-gradient(circle, var(--ion-color-primary-tint) 0%, white 100%);
    }
    
    .logo-container {
      margin-bottom: 32px;
      text-align: center;
    }
    
    .app-name {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--ion-color-primary);
      margin-bottom: 8px;
    }
    
    .app-tagline {
      color: var(--ion-color-medium);
      font-size: 1rem;
    }
    
    .form-container {
      width: 100%;
      max-width: 400px;
    }
    
    ion-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 255, 255, 0.9);
    }
    
    .forgot-password {
      text-align: center;
      margin-top: 16px;
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--ion-color-light);
    }
    
    .divider span {
      padding: 0 16px;
      color: var(--ion-color-medium);
      font-size: 0.8rem;
    }
  `,
  ],
})
export class LoginPage {
  email = ""
  password = ""

  constructor(private router: Router) {}

  login() {
    // Implement login functionality
    console.log("Login with:", this.email, this.password)
    this.router.navigateByUrl("/tabs")
  }

  forgotPassword() {
    console.log("Forgot password")
    // Implement forgot password functionality
  }

  register() {
    console.log("Register")
    this.router.navigateByUrl("/auth/register")
  }
}

