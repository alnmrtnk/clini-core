import { Component, computed, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EsculabOrderDto } from 'src/app/models/esculab.model';

interface LabResult {
  id: number;
  name: string;
  date: Date;
  resultCount: number;
}

@Component({
  selector: 'app-esculab-dashboard-card',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  styleUrls: ['./esculab-dashboard-card.component.scss'],
  templateUrl: './esculab-dashboard-card.component.html',
})
export class EsculabDashboardCardComponent {
  readonly isConnected = input(false);
  readonly recentResults = input<EsculabOrderDto[]>([]);

  readonly topResults = computed(() => this.recentResults().slice(0, 3));

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
