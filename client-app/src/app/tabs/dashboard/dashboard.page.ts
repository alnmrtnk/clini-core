import { Component, computed, inject, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
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
import { MainDashboardRecordsComponent } from './components/main-dashboard-records/main-dashboard-records.component';
import { AccessState, LoadAccesses } from 'src/app/store/doctor-access.state';
import { DoctorAccess } from 'src/app/models/doctor-access.model';
import { EsculabDashboardCardComponent } from './components/esculab-dashboard-card/esculab-dashboard-card.component';
import { DoctorAccessCardComponent } from '../shared/doctor-access-card/doctor-access-card.component';
import { Router } from '@angular/router';
import {
  EsculabState,
  FindPatient,
  GetAllOrders,
} from 'src/app/store/esculab.state';
import { EsculabOrderDto } from 'src/app/models/esculab.model';
import { HealthChartComponent } from 'src/app/shared/components/health-chart/health-chart.component';

interface LabResult {
  id: number;
  name: string;
  date: Date;
  resultCount: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [IonicModule, CommonModule, RouterLink, HealthChartComponent],
  templateUrl: 'dashboard.page.html',
  styleUrl: 'dashboard.page.scss',
})
export class DashboardPage {
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // перетворюємо селектор NGXS на Signal
  readonly recordsSignal: Signal<MedicalRecord[]> = toSignal(
    this.store.select(RecordsState.records),
    { initialValue: [] }
  );
  readonly vaccinationsSignal: Signal<Vaccination[]> = toSignal(
    this.store.select(VaccinationsState.vaccinations),
    { initialValue: [] }
  );

  private readonly doctorAccesses = toSignal(
    this.store.select(AccessState.accesses),
    {
      initialValue: [],
    }
  );

  private readonly esculabResults = toSignal(
    this.store.select(EsculabState.getAllOrders),
    {
      initialValue: [],
    }
  );
  private readonly patient = toSignal(
    this.store.select(EsculabState.getPatient),
    { initialValue: null }
  );

  readonly recentRecords = computed<MedicalRecord[]>(() => {
    const arr = this.recordsSignal();
    return [...arr]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
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

  readonly recentAccesses = computed<DoctorAccess[]>(() => {
    const arr = this.doctorAccesses();

    return [...arr]
      .sort(
        (a, b) =>
          new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()
      )
      .slice(0, 4);
  });

  readonly recentEsculabResults = computed<EsculabOrderDto[]>(() => {
    const arr = this.esculabResults();
    return [...arr]
      .sort((a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime())
      .slice(0, 4);
  });

  isEsculabConnected = computed(
    () => this.patient() !== null && this.patient() !== undefined
  );

  ngOnInit() {
    const userId = this.auth.currentUserId();

    if (userId) {
      this.store.dispatch(new LoadVaccinations(userId));
      this.store.dispatch(new LoadRecords());
      this.store.dispatch(new LoadAccesses());
      this.store.dispatch(new GetAllOrders());
      this.store.dispatch(new FindPatient());
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
