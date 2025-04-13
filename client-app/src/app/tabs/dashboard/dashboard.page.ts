import { Component } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { SharedComponentsModule } from "../../shared/shared-components.module"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [IonicModule, CommonModule, SharedComponentsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="container page-wrapper">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Welcome to CliniCore</ion-card-title>
            <ion-card-subtitle>Your medical data in one place</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>Access all your medical information, track your health, and manage your vaccinations.</p>
          </ion-card-content>
        </ion-card>
        
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Recent Medical Records</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-list lines="full">
                    <ion-item>
                      <ion-label>
                        <h3>Blood Test</h3>
                        <p>March 15, 2025</p>
                      </ion-label>
                      <ion-button slot="end" fill="clear">View</ion-button>
                    </ion-item>
                    <ion-item>
                      <ion-label>
                        <h3>Annual Checkup</h3>
                        <p>February 2, 2025</p>
                      </ion-label>
                      <ion-button slot="end" fill="clear">View</ion-button>
                    </ion-item>
                  </ion-list>
                </ion-card-content>
              </ion-card>
            </ion-col>
            
            <ion-col size="12" size-md="6">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Upcoming Vaccinations</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-list lines="full">
                    <ion-item>
                      <ion-label>
                        <h3>Flu Vaccine</h3>
                        <p>Due in 14 days</p>
                      </ion-label>
                      <ion-button slot="end" fill="clear">Schedule</ion-button>
                    </ion-item>
                  </ion-list>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
          
          <ion-row>
            <ion-col size="12">
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Health Trends</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <app-health-chart></app-health-chart>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  `,
  styles: [
    `
    .container {
      padding: 16px;
    }
    
    ion-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 255, 255, 0.9);
    }
  `,
  ],
})
export class DashboardPage {}

