import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { VaccinationsState } from '../store/vaccination.state';
import { MeasurementsState } from '../store/health-measurement.state';
import { RecordsState } from '../store/medical-record.state';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([VaccinationsState, RecordsState])
          ),
        ],
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('./medical-records/medical-records.page').then(
            (m) => m.MedicalRecordsPage
          ),
      },
      {
        path: 'vaccinations',
        loadComponent: () =>
          import('./vaccinations/vaccinations.page').then(
            (m) => m.VaccinationsPage
          ),
      },
      {
        path: 'vaccinations/add',
        loadComponent: () =>
          import(
            './vaccinations/components/add-vaccination/add-vaccination.component'
          ).then((m) => m.AddVaccinationComponent),
      },
      {
        path: 'health-tracking',
        loadComponent: () =>
          import('./health-tracking/health-tracking.page').then(
            (m) => m.HealthTrackingPage
          ),
      },
      {
        path: 'doctor-access',
        loadComponent: () =>
          import('./doctor-access/doctor-access.page').then(
            (m) => m.DoctorAccessPage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
