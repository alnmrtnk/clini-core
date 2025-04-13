import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { checkmarkCircle, time } from 'ionicons/icons';

@Component({
  selector: 'app-vaccinations',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Vaccinations</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addVaccination()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container page-wrapper">
        <ion-segment [(ngModel)]="currentSegment">
          <ion-segment-button value="upcoming">
            <ion-label>Upcoming</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Completed</ion-label>
          </ion-segment-button>
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div [ngSwitch]="currentSegment">
          <div *ngSwitchCase="'upcoming'">
            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>Due in 14 days</ion-card-subtitle>
                <ion-card-title>Flu Vaccine</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>Annual influenza vaccination</p>
                <p>Recommended date: April 10, 2025</p>
                <ion-button
                  expand="block"
                  color="primary"
                  (click)="scheduleVaccination('flu')"
                >
                  Schedule Appointment
                </ion-button>
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>Due in 45 days</ion-card-subtitle>
                <ion-card-title>Tetanus Booster</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>10-year tetanus booster shot</p>
                <p>Recommended date: May 15, 2025</p>
                <ion-button
                  expand="block"
                  color="primary"
                  (click)="scheduleVaccination('tetanus')"
                >
                  Schedule Appointment
                </ion-button>
              </ion-card-content>
            </ion-card>
          </div>

          <div *ngSwitchCase="'completed'">
            <ion-list>
              <ion-item>
                <ion-icon
                  name="checkmark-circle"
                  color="success"
                  slot="start"
                ></ion-icon>
                <ion-label>
                  <h2>COVID-19 Booster</h2>
                  <p>January 5, 2025</p>
                  <p>City Medical Center</p>
                </ion-label>
                <ion-button
                  fill="clear"
                  slot="end"
                  (click)="viewVaccinationDetails('covid')"
                >
                  Details
                </ion-button>
              </ion-item>

              <ion-item>
                <ion-icon
                  name="checkmark-circle"
                  color="success"
                  slot="start"
                ></ion-icon>
                <ion-label>
                  <h2>Hepatitis B (3rd dose)</h2>
                  <p>October 12, 2024</p>
                  <p>Community Health Clinic</p>
                </ion-label>
                <ion-button
                  fill="clear"
                  slot="end"
                  (click)="viewVaccinationDetails('hepb')"
                >
                  Details
                </ion-button>
              </ion-item>
            </ion-list>
          </div>

          <div *ngSwitchCase="'all'">
            <!-- Combined view of upcoming and completed vaccinations -->
            <ion-list-header>
              <ion-label>Upcoming</ion-label>
            </ion-list-header>

            <ion-item>
              <ion-icon name="time" color="warning" slot="start"></ion-icon>
              <ion-label>
                <h2>Flu Vaccine</h2>
                <p>Due: April 10, 2025</p>
              </ion-label>
              <ion-button
                fill="clear"
                slot="end"
                (click)="scheduleVaccination('flu')"
              >
                Schedule
              </ion-button>
            </ion-item>

            <ion-item>
              <ion-icon name="time" color="warning" slot="start"></ion-icon>
              <ion-label>
                <h2>Tetanus Booster</h2>
                <p>Due: May 15, 2025</p>
              </ion-label>
              <ion-button
                fill="clear"
                slot="end"
                (click)="scheduleVaccination('tetanus')"
              >
                Schedule
              </ion-button>
            </ion-item>

            <ion-list-header>
              <ion-label>Completed</ion-label>
            </ion-list-header>

            <ion-item>
              <ion-icon
                name="checkmark-circle"
                color="success"
                slot="start"
              ></ion-icon>
              <ion-label>
                <h2>COVID-19 Booster</h2>
                <p>January 5, 2025</p>
              </ion-label>
              <ion-button
                fill="clear"
                slot="end"
                (click)="viewVaccinationDetails('covid')"
              >
                Details
              </ion-button>
            </ion-item>

            <ion-item>
              <ion-icon
                name="checkmark-circle"
                color="success"
                slot="start"
              ></ion-icon>
              <ion-label>
                <h2>Hepatitis B (3rd dose)</h2>
                <p>October 12, 2024</p>
              </ion-label>
              <ion-button
                fill="clear"
                slot="end"
                (click)="viewVaccinationDetails('hepb')"
              >
                Details
              </ion-button>
            </ion-item>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .container {
        padding: 16px;
      }

      ion-segment {
        margin-bottom: 16px;
      }

      ion-card {
        margin-bottom: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.9);
      }
    `,
  ],
})
export class VaccinationsPage {
  currentSegment = 'upcoming';

  onstructor() {
    addIcons({
      checkmarkCircle,
      time,
    });
  }

  addVaccination() {
    console.log('Add vaccination');
    // Implement add vaccination functionality
  }

  scheduleVaccination(type: string) {
    console.log('Schedule vaccination:', type);
    // Implement schedule vaccination functionality
  }

  viewVaccinationDetails(id: string) {
    console.log('View vaccination details:', id);
    // Implement view vaccination details functionality
  }
}
