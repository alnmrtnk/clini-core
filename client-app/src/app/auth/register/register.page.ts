import { Component } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/auth/login"></ion-back-button>
        </ion-buttons>
        <ion-title>Create Account</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="register-container page-wrapper">
        <div class="form-container">
          <ion-card>
            <ion-card-content>
              <form (ngSubmit)="register()">
                <ion-item>
                  <ion-label position="floating">Full Name</ion-label>
                  <ion-input type="text" [(ngModel)]="fullName" name="fullName" required></ion-input>
                </ion-item>
                
                <ion-item>
                  <ion-label position="floating">Email</ion-label>
                  <ion-input type="email" [(ngModel)]="email" name="email" required></ion-input>
                </ion-item>
                
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input type="password" [(ngModel)]="password" name="password" required></ion-input>
                </ion-item>
                
                <ion-item>
                  <ion-label position="floating">Confirm Password</ion-label>
                  <ion-input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required></ion-input>
                </ion-item>
                
                <ion-item lines="none">
                  <ion-checkbox [(ngModel)]="agreeToTerms" name="agreeToTerms"></ion-checkbox>
                  <ion-label class="ion-padding-start">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </ion-label>
                </ion-item>
                
                <ion-button expand="block" type="submit" color="primary" class="ion-margin-top" [disabled]="!agreeToTerms">
                  Create Account
                </ion-button>
              </form>
              
              <div class="login-link">
                <p>Already have an account? <a (click)="goToLogin()">Log In</a></p>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
    .register-container {
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100%;
      background: radial-gradient(circle, var(--ion-color-primary-tint) 0%, white 100%);
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
    
    .login-link {
      text-align: center;
      margin-top: 16px;
      color: var(--ion-color-medium);
    }
    
    .login-link a {
      color: var(--ion-color-primary);
      cursor: pointer;
    }
  `,
  ],
})
export class RegisterPage {
  fullName = ""
  email = ""
  password = ""
  confirmPassword = ""
  agreeToTerms = false

  constructor(private router: Router) {}

  register() {
    // Implement register functionality
    console.log("Register with:", this.fullName, this.email, this.password)
    this.router.navigateByUrl("/tabs")
  }

  goToLogin() {
    this.router.navigateByUrl("/auth/login")
  }
}

