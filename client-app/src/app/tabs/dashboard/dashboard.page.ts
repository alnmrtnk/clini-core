import { Component, computed, inject, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadRecords } from '../../store/medical-record.state';
import { RecordsState } from '../../store/medical-record.state';
import { MedicalRecord } from '../../models/medical-record.model';
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

  readonly recordsSignal: Signal<MedicalRecord[]> = toSignal(
    this.store.select(RecordsState.records),
    { initialValue: [] }
  );

  readonly recentRecords = computed<MedicalRecord[]>(() => {
    const arr = this.recordsSignal();
    return [...arr]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });


  ngOnInit() {
    const userId = this.auth.currentUserId();

    if (userId) {
      this.store.dispatch(new LoadRecords());
    }
  }
}
