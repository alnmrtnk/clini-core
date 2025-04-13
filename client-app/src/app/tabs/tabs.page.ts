import { Component, inject, type OnInit } from '@angular/core';
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

  constructor() {
    addIcons({
      homeOutline,
      pulseOutline,
      peopleOutline,
      documentTextOutline,
      settingsOutline,
      fitnessOutline,
    });
  }

  ngOnInit() {
    this.screenService.isDesktop$.subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
    });
  }
}
