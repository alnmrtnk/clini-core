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
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content>
      <div class="tabs-container" [class.desktop]="isDesktop">
        <ion-tabs>
          <ion-tab-bar
            [slot]="isDesktop ? 'start' : 'bottom'"
            class="ion-tab-bar"
            [class.vertical]="isDesktop"
          >
            <ion-tab-button
              tab="dashboard"
              [layout]="isDesktop ? 'icon-start' : 'icon-top'"
            >
              <ion-icon name="home-outline"></ion-icon>
              <ion-label>Dashboard</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="medical-records"
              [layout]="isDesktop ? 'icon-start' : 'icon-top'"
            >
              <ion-icon name="document-text-outline"></ion-icon>
              <ion-label>Records</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="vaccinations"
              [layout]="isDesktop ? 'icon-start' : 'icon-top'"
            >
              <ion-icon name="fitness-outline"></ion-icon>
              <ion-label>Vaccinations</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="health-tracking"
              [layout]="isDesktop ? 'icon-start' : 'icon-top'"
            >
              <ion-icon name="pulse-outline"></ion-icon>
              <ion-label>Health</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="doctor-access"
              [layout]="isDesktop ? 'icon-start' : 'icon-top'"
            >
              <ion-icon name="people-outline"></ion-icon>
              <ion-label>Doctors</ion-label>
            </ion-tab-button>

            <ion-tab-button
              tab="settings"
              [layout]="isDesktop ? 'icon-start' : 'icon-top'"
            >
              <ion-icon name="settings-outline"></ion-icon>
              <ion-label>Settings</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .tabs-container {
        height: 100%;
        width: 100%;
        display: flex;
      }

      .tabs-container.desktop {
        flex-direction: row;
      }

      ion-tabs {
        width: 100%;
        height: 100%;
      }

      .ion-tab-bar.vertical {
        height: 100%;
        width: 168px;
        flex-direction: column;
        align-items: flex-start;
        border-right: 1px solid var(--ion-color-light);
        background-color: rgba(255, 255, 255, 0.9);
      }

      .vertical ion-tab-button {
        width: 100%;
        justify-content: flex-start;
        padding-left: 16px;
        height: 56px;
      }
    `,
  ],
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
