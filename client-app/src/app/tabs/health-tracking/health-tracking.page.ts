import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';

type Measurement = {
  value: string;
  date: string;        // ISO string
  status: string;
  statusText: string;
};

@Component({
  selector: 'app-health-tracking',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedComponentsModule],
  templateUrl: 'health-tracking.page.html',
  styleUrls: ['health-tracking.page.scss'],
})
export class HealthTrackingPage implements OnInit {
  currentParameter: 'bloodPressure' | 'bloodSugar' | 'weight' = 'bloodPressure';
  recentMeasurements: Measurement[] = [];

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadMeasurements(this.currentParameter);
  }

  parameterChanged() {
    this.loadMeasurements(this.currentParameter);
  }

  private loadMeasurements(param: string) {
    const raw = localStorage.getItem(param) || '[]';
    const all: Measurement[] = JSON.parse(raw);
    // filter last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.recentMeasurements = all
      .map(m => ({ ...m, date: m.date }))
      .filter(m => new Date(m.date).getTime() >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addMeasurement() {
    const alert = await this.alertCtrl.create({
      header: `New ${this.getParameterTitle()}`,
      inputs: [
        { name: 'value', type: 'text', placeholder: 'Enter value (e.g. 120/80 or 5.5)' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            if (data.value) {
              this.saveMeasurement(data.value);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private saveMeasurement(value: string) {
    const param = this.currentParameter;
    const raw = localStorage.getItem(param) || '[]';
    const all: Measurement[] = JSON.parse(raw);

    const newEntry: Measurement = {
      value,
      date: new Date().toISOString(),
      status: 'primary',
      statusText: 'Recorded',
    };

    all.push(newEntry);
    localStorage.setItem(param, JSON.stringify(all));
    this.loadMeasurements(param);
  }

  getParameterTitle(): string {
    switch (this.currentParameter) {
      case 'bloodPressure': return 'Blood Pressure';
      case 'bloodSugar':   return 'Blood Sugar';
      case 'weight':       return 'Weight';
      default:             return '';
    }
  }
}
