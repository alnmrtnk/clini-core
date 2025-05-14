import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { VaccinationsState } from '../store/vaccination.state';
import { MeasurementsState } from '../store/health-measurement.state';
import { RecordsState } from '../store/medical-record.state';
import { EsculabState } from '../store/esculab.state';
import { AccessState } from '../store/doctor-access.state';

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
            NgxsModule.forFeature([
              RecordsState,
              AccessState,
              EsculabState,
              VaccinationsState,
            ])
          ),
        ],
      },
      {
        path: 'medical-records',
        loadComponent: () =>
          import('./medical-records/medical-records.page').then(
            (m) => m.MedicalRecordsPage
          ),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([EsculabState, RecordsState])
          ),
        ],
      },
      {
        path: 'medical-records/add',
        loadComponent: () =>
          import('./medical-record-add/medical-record-add.component').then(
            (m) => m.MedicalRecordAddComponent
          ),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([EsculabState, RecordsState])
          ),
        ],
      },
      {
        path: 'medical-records/:id',
        loadComponent: () =>
          import('./medical-record-page/medical-record-page.component').then(
            (m) => m.MedicalRecordPageComponent
          ),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([EsculabState, RecordsState])
          ),
        ],
      },
      {
        path: 'vaccinations',
        loadComponent: () =>
          import('./vaccinations/vaccinations.page').then(
            (m) => m.VaccinationsPage
          ),
        providers: [
          importProvidersFrom(NgxsModule.forFeature([VaccinationsState])),
        ],
      },
      {
        path: 'vaccinations/add',
        loadComponent: () =>
          import(
            './vaccinations/components/add-vaccination/add-vaccination.component'
          ).then((m) => m.AddVaccinationComponent),
        providers: [
          importProvidersFrom(NgxsModule.forFeature([VaccinationsState])),
        ],
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
        providers: [importProvidersFrom(NgxsModule.forFeature([AccessState]))],
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
