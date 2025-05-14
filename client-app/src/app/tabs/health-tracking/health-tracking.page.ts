import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { add, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-health-tracking',
  imports: [IonicModule, CommonModule, FormsModule, SharedComponentsModule],
  templateUrl: 'health-tracking.page.html',
  styleUrl: 'health-tracking.page.scss',
})
export class HealthTrackingPage implements OnInit {
  currentParameter = 'bloodPressure';
  recentMeasurements: any[] = [];

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
