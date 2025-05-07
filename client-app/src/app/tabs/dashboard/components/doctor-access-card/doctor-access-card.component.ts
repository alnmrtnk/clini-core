import { Component, computed, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorAccess } from 'src/app/models/doctor-access.model';

@Component({
  selector: 'app-doctor-access-card',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  styleUrls: ['./doctor-access-card.component.scss'],
  templateUrl: './doctor-access-card.component.html',
})
export class DoctorAccessCardComponent {
  readonly access = input.required<DoctorAccess>();

  readonly revoked = computed(() => {
    const a = this.access();
    return a.revoked || new Date(a.expiresAt) < new Date();
  })

  readonly statusText = computed(() => {
    const a = this.access();
    if (a.revoked) return 'Revoked';

    return new Date(a.expiresAt) < new Date() ? 'Expired' : 'Active';
  });

  readonly statusColor = computed(() => {
    const a = this.access();
    if (a.revoked) return 'danger';

    const now = new Date();
    const expiresAt = new Date(a.expiresAt);
    if (expiresAt < now) return 'danger';

    const days = Math.floor((expiresAt.getTime() - now.getTime()) / 86400000);
    return days <= 3 ? 'warning' : 'success';
  });

  readonly expirationText = computed(() => {
    const a = this.access();
    if (a.revoked) return 'Access revoked';

    const now = new Date();
    const expiresAt = new Date(a.expiresAt);

    if (expiresAt < now) return `Expired on ${this.formatDate(expiresAt)}`;

    const days = Math.floor((expiresAt.getTime() - now.getTime()) / 86400000);
    if (days === 0) return 'Expires';
    if (days === 1) return 'Expires tomorrow';
    if (days < 7) return `Expires in ${days} days`;

    return `Expires on ${this.formatDate(expiresAt)}`;
  });

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
