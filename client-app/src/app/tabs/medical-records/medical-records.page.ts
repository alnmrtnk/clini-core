import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class MedicalRecordsPage implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly records = toSignal<MedicalRecord[]>(
    this.store.select(RecordsState.records)
  );

  @ViewChild('seg', { read: ElementRef }) segEl!: ElementRef<HTMLElement>;

  currentSegment: 'personal' | 'esculab' = 'personal';

  readonly groupedRecords = computed(() => this.groupByMonth(this.records()));

  getIcon(record: MedicalRecord): string {
    return getIcon(record.recordType.name);
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

  ngAfterViewInit() {
    setTimeout(() => this.updateBg(), 0);
  }

  segmentChanged(ev: CustomEvent<SegmentChangeEventDetail>) {
    const newSeg = ev.detail.value as 'personal' | 'esculab';

    this.currentSegment = newSeg;

    if (newSeg === 'personal' || newSeg === 'esculab') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { segment: newSeg },
        queryParamsHandling: 'merge',
      });
    }

    setTimeout(() => this.updateBg(), 0);
  }

  private updateBg() {
    const host = this.segEl.nativeElement;
    const active = host.querySelector<HTMLElement>('.segment-button-checked');
    if (!active) {
      const btn = host.querySelector<HTMLElement>('.in-segment');
      console.log(btn!.getBoundingClientRect().width)
      host.style.setProperty('--bg-left', `4px`);
      host.style.setProperty(
        '--bg-width',
        `${btn!.getBoundingClientRect().width}px`
      );
      return;
    }

    const hostRect = host.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();

    const left = btnRect.left - hostRect.left;
    const width = btnRect.width;

    host.style.setProperty('--bg-left', `${left}px`);
    host.style.setProperty('--bg-width', `${width}px`);
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
