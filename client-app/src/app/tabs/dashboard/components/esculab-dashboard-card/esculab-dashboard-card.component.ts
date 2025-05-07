import { Component, computed, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  readonly recentResults = input<LabResult[]>([]);

  readonly topResults = computed(() => this.recentResults().slice(0, 3));

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
