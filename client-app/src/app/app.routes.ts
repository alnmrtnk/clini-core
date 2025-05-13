import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AccessState } from './store/doctor-access.state';
import { DoctorCommentState } from './store/doctor-comment.state';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'medical-records/:token', //  medical-records/1x8m2d6sokeu8gjp/aLbHg==
    loadComponent: () =>
      import(
        './doctor-tabs/shared-medical-records/shared-medical-records.component'
      ).then((m) => m.SharedMedicalRecordsComponent),
    providers: [importProvidersFrom(NgxsModule.forFeature([AccessState, DoctorCommentState]))],
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: 'tabs',
  },
];
