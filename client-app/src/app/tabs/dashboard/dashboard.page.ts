import { Component, computed, inject, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadRecords } from '../../store/medical-record.state';
import { LoadVaccinations } from '../../store/vaccination.state';
import { RecordsState } from '../../store/medical-record.state';
import { VaccinationsState } from '../../store/vaccination.state';
import { MedicalRecord } from '../../models/medical-record.model';
import { Vaccination } from '../../models/vaccination.model';
import { of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [IonicModule, CommonModule, SharedComponentsModule, RouterLink],
  templateUrl: 'dashboard.page.html',
  styleUrl: 'dashboard.page.scss',
})
export class DashboardPage {
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);

  // перетворюємо селектор NGXS на Signal
  readonly recordsSignal: Signal<MedicalRecord[]> = toSignal(
    this.store.select(RecordsState.getRecords),
    { initialValue: [] }
  );
  readonly vaccinationsSignal: Signal<Vaccination[]> = toSignal(
    this.store.select(VaccinationsState.vaccinations),
    { initialValue: [] }
  );

  readonly recentRecords = computed<MedicalRecord[]>(() => {
    const arr = this.recordsSignal();
    return [...arr]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  readonly upcomingVaccinations: Signal<(Vaccination & { dueDate: Date })[]> =
    computed(() => {
      const arr = this.vaccinationsSignal();
      return arr
        .map((v) => ({
          ...v,
          // приклад обчислення dueDate: через 30 днів після admin
          dueDate: new Date(
            new Date(v.dateAdministered).getTime() + 1000 * 60 * 60 * 24 * 30
          ),
        }))
        .filter((v) => v.dueDate > new Date())
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, 5);
    });

  ngOnInit() {
    const userId = this.auth.currentUserId();
    
    if (userId) {
      this.store.dispatch([
        new LoadRecords(userId),
        new LoadVaccinations(userId),
      ]);
    }
  }
}
