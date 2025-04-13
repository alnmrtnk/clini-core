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
  imports: [IonicModule, CommonModule, FormsModule, SharedComponentsModule],
  templateUrl: 'medical-records.page.html',
  styleUrl: 'medical-records.page.scss',
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
