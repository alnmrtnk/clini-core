import { Component, computed, effect, inject, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadRecords } from '../../store/medical-record.state';
import { RecordsState } from '../../store/medical-record.state';
import {
  MedicalRecord,
  MedicalRecordGroupDto,
} from '../../models/medical-record.model';
import { AuthService } from 'src/app/services/auth.service';
import { MainDashboardRecordsComponent } from './components/main-dashboard-records/main-dashboard-records.component';
import {
  AccessState,
  LoadAccesses,
  LoadSharedRecords,
} from 'src/app/store/doctor-access.state';
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

@Component({
  selector: 'app-dashboard',
  imports: [
    IonicModule,
    CommonModule,
    MainDashboardRecordsComponent,
    DoctorAccessCardComponent,
    EsculabDashboardCardComponent,
  ],
  templateUrl: 'dashboard.page.html',
  styleUrl: 'dashboard.page.scss',
})
export class DashboardPage {
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly recordsSignal: Signal<MedicalRecord[]> = toSignal(
    this.store.select(RecordsState.records),
    { initialValue: [] }
  );

  readonly sharedGroups = toSignal(
    this.store.select(AccessState.sharedRecords),
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

  isShareVisible = computed(() => !!this.sharedGroups().length);

  readonly sharedRecordsCount = computed(() =>
    this.sharedGroups().reduce((sum, group) => sum + group.records.length, 0)
  );

  readonly sharedRecordsLabel = computed(() =>
    this.sharedRecordsCount() === 1 ? 'record' : 'records'
  );

  constructor() {
    effect(() => {
      const userId = this.auth.currentUserId();

      if (userId) {
        this.store.dispatch(new LoadRecords());
        this.store.dispatch(new LoadAccesses());
        this.store.dispatch(new GetAllOrders());
        this.store.dispatch(new FindPatient());
        this.store.dispatch(new LoadSharedRecords(null));
      }
    });
  }

  trackByOwner(_: number, g: MedicalRecordGroupDto) {
    return g.ownerEmail;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
