import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ScreenService } from '../services/screen.service';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  fitnessOutline,
  homeOutline,
  peopleOutline,
  pulseOutline,
  settingsOutline,
  menuOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  imports: [IonicModule, CommonModule],
  templateUrl: 'tabs.page.html',
  styleUrl: 'tabs.page.scss',
})
export class TabsPage implements OnInit {
  private screenService = inject(ScreenService);
  isDesktop = false;
  public readonly tabs: { label: string; icon: string; id: string }[] = [
    { label: 'Dashboard', icon: 'home-outline', id: 'dashboard' },
    { label: 'Records', icon: 'document-text-outline', id: 'medical-records' },
    { label: 'Vaccinations', icon: 'fitness-outline', id: 'vaccinations' },
    { label: 'Health', icon: 'pulse-outline', id: 'health-tracking' },
    { label: 'Doctors', icon: 'people-outline', id: 'doctor-access' },
    { label: 'Settings', icon: 'settings-outline', id: 'settings' },
  ];
  public expanded = false;

  constructor() {
    addIcons({
      homeOutline,
      pulseOutline,
      peopleOutline,
      documentTextOutline,
      settingsOutline,
      fitnessOutline,
      menuOutline
    });
  }

  ngOnInit() {
    this.screenService.isDesktop$.subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
    });
  }
}
