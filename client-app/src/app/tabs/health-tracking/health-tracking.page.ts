import { Component, type OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { addIcons } from 'ionicons';
import { add, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-health-tracking',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedComponentsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Health Tracking</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addMeasurement()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container  page-wrapper">
        <ion-segment
          [(ngModel)]="currentParameter"
          (ionChange)="parameterChanged()"
        >
          <ion-segment-button value="bloodPressure">
            <ion-label>Blood Pressure</ion-label>
          </ion-segment-button>
          <ion-segment-button value="bloodSugar">
            <ion-label>Blood Sugar</ion-label>
          </ion-segment-button>
          <ion-segment-button value="weight">
            <ion-label>Weight</ion-label>
          </ion-segment-button>
        </ion-segment>

        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ getParameterTitle() }}</ion-card-title>
            <ion-card-subtitle>Last 30 days</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <div class="chart-container">
              <app-parameter-chart
                [parameter]="currentParameter"
              ></app-parameter-chart>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Recent Measurements</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="full">
              <ion-item *ngFor="let measurement of recentMeasurements">
                <ion-label>
                  <h2>{{ measurement.value }}</h2>
                  <p>{{ measurement.date | date : 'medium' }}</p>
                </ion-label>
                <ion-note slot="end" [color]="measurement.status">
                  {{ measurement.statusText }}
                </ion-note>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button color="primary" (click)="addMeasurement()">
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
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

      .chart-container {
        height: 250px;
        width: 100%;
      }
    `,
  ],
})
export class HealthTrackingPage implements OnInit {
  currentParameter = 'bloodPressure';
  recentMeasurements: any[] = [];

  constructor() {
    addIcons({
      addOutline,
      add,
    });
  }

  ngOnInit() {
    this.loadMeasurements();
  }

  parameterChanged() {
    this.loadMeasurements();
  }

  getParameterTitle() {
    switch (this.currentParameter) {
      case 'bloodPressure':
        return 'Blood Pressure';
      case 'bloodSugar':
        return 'Blood Sugar';
      case 'weight':
        return 'Weight';
      default:
        return '';
    }
  }

  loadMeasurements() {
    // This would normally fetch from a service
    if (this.currentParameter === 'bloodPressure') {
      this.recentMeasurements = [
        {
          value: '120/80 mmHg',
          date: new Date(),
          status: 'success',
          statusText: 'Normal',
        },
        {
          value: '125/82 mmHg',
          date: new Date(Date.now() - 86400000),
          status: 'success',
          statusText: 'Normal',
        },
        {
          value: '135/85 mmHg',
          date: new Date(Date.now() - 172800000),
          status: 'warning',
          statusText: 'Elevated',
        },
      ];
    } else if (this.currentParameter === 'bloodSugar') {
      this.recentMeasurements = [
        {
          value: '95 mg/dL',
          date: new Date(),
          status: 'success',
          statusText: 'Normal',
        },
        {
          value: '105 mg/dL',
          date: new Date(Date.now() - 86400000),
          status: 'success',
          statusText: 'Normal',
        },
        {
          value: '120 mg/dL',
          date: new Date(Date.now() - 172800000),
          status: 'warning',
          statusText: 'Elevated',
        },
      ];
    } else if (this.currentParameter === 'weight') {
      this.recentMeasurements = [
        {
          value: '70 kg',
          date: new Date(),
          status: 'success',
          statusText: 'Normal',
        },
        {
          value: '70.5 kg',
          date: new Date(Date.now() - 86400000),
          status: 'success',
          statusText: 'Normal',
        },
        {
          value: '71 kg',
          date: new Date(Date.now() - 172800000),
          status: 'success',
          statusText: 'Normal',
        },
      ];
    }
  }

  addMeasurement() {
    console.log('Add measurement');
    // Implement add measurement functionality
  }
}
