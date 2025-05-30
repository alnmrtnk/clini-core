import { Component, inject, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MedicalRecord } from 'src/app/models/medical-record.model';
import { recordIconMap } from 'src/app/data/record-icon-map';
import { Router } from '@angular/router';
import { getIcon } from 'src/app/utils/record.utils';

@Component({
  selector: 'app-main-dashboard-records',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'main-dashboard-records.component.html',
  styleUrl: 'main-dashboard-records.component.scss',
})
export class MainDashboardRecordsComponent {
  private readonly router = inject(Router);

  readonly records = input.required<MedicalRecord[]>();

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  getIcon(record: MedicalRecord): string {
    return getIcon(record.recordType.name);
  }

  viewDocument(record: MedicalRecord) {
    this.router.navigate(['/tabs/medical-records', record.id]);
  }

  navigateToAll() {
    this.router.navigate(['/tabs/medical-records'])
  }

  navigateToAdd() {
    this.router.navigate(['/tabs/medical-records/add']);
  }
}
