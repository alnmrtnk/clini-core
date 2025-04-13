import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { checkmarkCircle, time } from 'ionicons/icons';

@Component({
  selector: 'app-vaccinations',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'vaccinations.page.html',
  styleUrl: 'vaccinations.page.scss',
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
