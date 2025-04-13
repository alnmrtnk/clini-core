import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../shared/shared-components.module';

@Component({
  selector: 'app-dashboard',
  imports: [IonicModule, CommonModule, SharedComponentsModule],
  templateUrl: 'dashboard.page.html',
  styleUrl: 'dashboard.page.scss',
})
export class DashboardPage {}
