import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarModule, DateAdapter } from 'angular-calendar';
import { Vaccination } from 'src/app/models/vaccination.model';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vaccination-calendar',
  imports: [CommonModule, CalendarModule],
  providers: [{ provide: DateAdapter, useFactory: adapterFactory }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="calendar-wrapper">
      <mwl-calendar-month-view
        [viewDate]="viewDate"
        [events]="events"
        [weekStartsOn]="1"
        [refresh]="refresh"
      >
      </mwl-calendar-month-view>
    </div>
  `,
  styles: `
    .calendar-wrapper {
      height: 100%;
      mwl-calendar-month-view {
        border: 1px solid var(--ion-color-medium);
        border-radius: 8px;
        --cell-height: 2.5rem;
      }
    }
  `,
})
export class VaccinationCalendarComponent implements OnChanges {
  @Input() vaccinations: { dateAdministered: string; vaccineName: string }[] =
    [];

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  ngOnChanges() {
    if (!this.vaccinations) return;

    this.events = this.vaccinations.map((v) => {
      // normalize to midnight so it shows on the correct day
      const d = new Date(v.dateAdministered);
      d.setHours(0, 0, 0, 0);

      return {
        start: d,
        title: v.vaccineName,
        allDay: true,
        color: {
          primary: '#1e90ff',
          secondary: '#D1E8FF',
        },
      } as CalendarEvent;
    });

    // kick the calendar to re-render
    this.refresh.next(undefined);
  }
}
