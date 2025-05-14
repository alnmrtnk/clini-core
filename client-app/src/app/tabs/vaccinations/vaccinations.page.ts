import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vaccination } from 'src/app/models/vaccination.model';
import { LoadVaccinations, VaccinationsState } from 'src/app/store/vaccination.state';
import { VaccinationCalendarComponent } from './components/vaccinations-calendar/vaccination-calendar.component';

@Component({
  selector: 'app-vaccinations',
  imports: [IonicModule, CommonModule, FormsModule, VaccinationCalendarComponent],
  templateUrl: 'vaccinations.page.html',
  styleUrl: 'vaccinations.page.scss',
})
export class VaccinationsPage implements OnInit {
  private readonly router = inject(Router);
  private readonly store   = inject(Store);

  currentSegment = 'upcoming';

  // streams of all / filtered vaccinations
  vaccinations$!: Observable<Vaccination[]>;
  upcoming$!: Observable<Vaccination[]>;
  completed$!: Observable<Vaccination[]>;

  ngOnInit(): void {
    // 1) dispatch load (replace 'USER_ID' with your actual user id)
    this.store.dispatch(new LoadVaccinations('USER_ID'));

    // 2) grab the array from state
    this.vaccinations$ = this.store.select(VaccinationsState.vaccinations);

    // 3) split into upcoming / completed
    const now = new Date().getTime();
    this.upcoming$ = this.vaccinations$.pipe(
      map(vs =>
        vs.filter(v => new Date(v.dateAdministered).getTime() >= now)
      )
    );
    this.completed$ = this.vaccinations$.pipe(
      map(vs =>
        vs.filter(v => new Date(v.dateAdministered).getTime() < now)
      )
    );
  }

  addVaccination() {
    this.router.navigate(['/tabs/vaccinations/add']);
  }

  scheduleVaccination(id: string) {
    console.log('Schedule vaccination:', id);
    // TODO: implement scheduling
  }

  viewVaccinationDetails(id: string) {
    console.log('View vaccination details:', id);
    // TODO: navigate to detail page
  }

  // helper used in template for "Due in X days"
  dueInDays(dateStr: string): number {
    const then = new Date(dateStr).getTime();
    const now  = new Date().getTime();
    return Math.round((then - now) / (1000 * 60 * 60 * 24));
  }
}
