import { Component, computed, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EsculabIntegrationComponent } from './components/esculab-integration/esculab-integration.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Store } from '@ngxs/store';
import { LoadRecords, RecordsState } from 'src/app/store/medical-record.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { MedicalRecord } from 'src/app/models/medical-record.model';
import { getIcon } from 'src/app/utils/record.utils';

type RecordGroup = {
  label: string;
  records: MedicalRecord[];
};

@Component({
  selector: 'app-medical-records',
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EsculabIntegrationComponent,
  ],
  templateUrl: 'medical-records.page.html',
  styleUrl: 'medical-records.page.scss',
})
export class MedicalRecordsPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly records = toSignal<MedicalRecord[]>(
    this.store.select(RecordsState.records)
  );

  currentSegment: 'personal' | 'esculab' = 'personal';

  readonly groupedRecords = computed(() => this.groupByMonth(this.records()));

  getIcon(record: MedicalRecord): string {
    return getIcon(record.recordTypeName);
  }

  ngOnInit() {
    this.store.dispatch(new LoadRecords());

    this.route.queryParamMap.subscribe((params) => {
      const newSeg = params.get('segment');
      if (newSeg === 'personal' || newSeg === 'esculab') {
        this.currentSegment = newSeg;
      }
    });
  }

  onSegmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    const newSeg = event.detail.value;

    if (newSeg === 'personal' || newSeg === 'esculab') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { segment: newSeg },
        queryParamsHandling: 'merge',
      });
      this.currentSegment = newSeg;
    }
  }

  searchRecords(event: any) {
    const query = event.detail.value;
    console.log('Searching for:', query);
  }

  viewRecord(id: string) {
    this.router.navigate(['/tabs/medical-records', id]);
  }

  addNewRecord() {
    this.router.navigate(['/tabs/medical-records/add']);
  }

  addDoctorVisit() {
    this.router.navigate(['/tabs/doctor-access'], {
      queryParams: {
        segment: 'create',
      },
    });
  }

  private groupByMonth(all: MedicalRecord[] | undefined): RecordGroup[] {
    if (!all) return [];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const map = all.reduce((acc, rec) => {
      const d = new Date(rec.date);
      const year = d.getFullYear();
      const month = monthNames[d.getMonth()];
      const key = `${year}-${month}`;
      (acc[key] = acc[key] || []).push(rec);
      return acc;
    }, {} as Record<string, MedicalRecord[]>);

    return Object.entries(map)
      .map(([key, list]) => {
        const [year, month] = key.split('-');
        return {
          label: `${month} ${year}`,
          records: list.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        };
      })
      .sort((a, b) => {
        const da = new Date(a.records[0].date);
        const db = new Date(b.records[0].date);
        return db.getTime() - da.getTime();
      });
  }
}
