import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vaccinations',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'vaccinations.page.html',
  styleUrl: 'vaccinations.page.scss',
})
export class VaccinationsPage {
  private readonly router = inject(Router);
  currentSegment = 'upcoming';

  addVaccination() {
    this.router.navigate(['/tabs/vaccinations/add']);
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
