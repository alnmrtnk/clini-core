import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { addIcons } from 'ionicons';
import {
  add,
  addOutline,
  flaskOutline,
  medicalOutline,
  medkitOutline,
  pulseOutline,
  scanOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedComponentsModule],
  template: `
    <ion-header class="large">
      <ion-toolbar color="primary">
        <ion-title>Medical Records</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addNewRecord()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          placeholder="Search records"
          (ionChange)="searchRecords($event)"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container page-wrapper has-searchbar">
        <ion-segment [(ngModel)]="currentSegment">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="lab">
            <ion-label>Lab Tests</ion-label>
          </ion-segment-button>
          <ion-segment-button value="visits">
            <ion-label>Doctor Visits</ion-label>
          </ion-segment-button>
        </ion-segment>

        <ion-list>
          <ion-item-group>
            <ion-item-divider sticky>
              <ion-label>2025</ion-label>
            </ion-item-divider>

            <ion-item button detail (click)="viewRecord('1')">
              <ion-icon
                name="flask-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>
                <h2>Complete Blood Count</h2>
                <p>March 15, 2025</p>
                <p>Esculab Laboratory</p>
              </ion-label>
            </ion-item>

            <ion-item button detail (click)="viewRecord('2')">
              <ion-icon
                name="medkit-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>
                <h2>Annual Physical Examination</h2>
                <p>February 2, 2025</p>
                <p>Dr. Sarah Johnson</p>
              </ion-label>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider sticky>
              <ion-label>2024</ion-label>
            </ion-item-divider>

            <ion-item button detail (click)="viewRecord('3')">
              <ion-icon
                name="pulse-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>
                <h2>Electrocardiogram (ECG)</h2>
                <p>November 10, 2024</p>
                <p>City Medical Center</p>
              </ion-label>
            </ion-item>

            <ion-item button detail (click)="viewRecord('4')">
              <ion-icon
                name="flask-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>
                <h2>Lipid Panel</h2>
                <p>August 5, 2024</p>
                <p>Esculab Laboratory</p>
              </ion-label>
            </ion-item>
          </ion-item-group>
        </ion-list>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="primary">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button color="light" (click)="addLabResult()">
            <ion-icon name="flask-outline"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="light" (click)="addDoctorVisit()">
            <ion-icon name="medkit-outline"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="light" (click)="scanDocument()">
            <ion-icon name="scan-outline"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
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

      ion-item-divider {
        background-color: var(--ion-color-light);
        color: var(--ion-color-medium);
        font-weight: bold;
      }
    `,
  ],
})
export class MedicalRecordsPage {
  currentSegment = 'all';

  constructor() {
    addIcons({
      addOutline,
      flaskOutline,
      medkitOutline,
      pulseOutline,
      add,
      scanOutline,
    });
  }

  searchRecords(event: any) {
    const query = event.detail.value;
    console.log('Searching for:', query);
    // Implement search functionality
  }

  addNewRecord() {
    console.log('Add new record');
    // Implement add new record functionality
  }

  viewRecord(id: string) {
    console.log('View record:', id);
    // Implement view record functionality
  }

  addLabResult() {
    console.log('Add lab result');
    // Implement add lab result functionality
  }

  addDoctorVisit() {
    console.log('Add doctor visit');
    // Implement add doctor visit functionality
  }

  scanDocument() {
    console.log('Scan document');
    // Implement scan document functionality
  }
}
