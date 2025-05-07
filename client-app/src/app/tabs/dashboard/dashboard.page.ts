import { Component, computed, inject, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadRecords } from '../../store/medical-record.state';
import { RecordsState } from '../../store/medical-record.state';
import { MedicalRecord } from '../../models/medical-record.model';
import { AuthService } from 'src/app/services/auth.service';
import { MainDashboardRecordsComponent } from './components/main-dashboard-records/main-dashboard-records.component';
import { AccessState, LoadAccesses } from 'src/app/store/doctor-access.state';
import { DoctorAccess } from 'src/app/models/doctor-access.model';
import { DoctorAccessCardComponent } from './components/doctor-access-card/doctor-access-card.component';
import { EsculabDashboardCardComponent } from './components/esculab-dashboard-card/esculab-dashboard-card.component';

interface LabResult {
  id: number;
  name: string;
  date: Date;
  resultCount: number;
}

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

  readonly recordsSignal: Signal<MedicalRecord[]> = toSignal(
    this.store.select(RecordsState.records),
    { initialValue: [] }
  );

  private readonly doctorAccesses = toSignal(
    this.store.select(AccessState.accesses),
    {
      initialValue: [],
    }
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

  isEsculabConnected(): boolean {
    return true;
  }

  // Mock data for recent lab results
  recentLabResults: LabResult[] = [
    {
      id: 1,
      name: 'Complete Blood Count',
      date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      resultCount: 12,
    },
    {
      id: 2,
      name: 'Lipid Panel',
      date: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
      resultCount: 5,
    },
    {
      id: 3,
      name: 'Thyroid Function',
      date: new Date(),
      resultCount: 3,
    },
  ];

  ngOnInit() {
    const userId = this.auth.currentUserId();

    if (userId) {
      this.store.dispatch(new LoadRecords());
      this.store.dispatch(new LoadAccesses());
    }
  }

  revokeAccess(accessId: string) {
    console.log('Revoking access:', accessId);
  }
}
