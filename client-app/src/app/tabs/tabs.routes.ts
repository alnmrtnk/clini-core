import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
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
            NgxsModule.forFeature([RecordsState, AccessState])
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
