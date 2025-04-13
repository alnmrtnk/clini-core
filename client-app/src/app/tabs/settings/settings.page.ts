import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  cloudUploadOutline,
  documentOutline,
  documentTextOutline,
  downloadOutline,
  fitnessOutline,
  flaskOutline,
  informationCircleOutline,
  linkOutline,
  lockClosedOutline,
  logOutOutline,
  logOutSharp,
  personOutline,
  pulseOutline,
  shareOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container page-wrapper">
        <ion-list>
          <ion-item-group>
            <ion-item-divider>
              <ion-label>Account</ion-label>
            </ion-item-divider>

            <ion-item button detail (click)="editProfile()">
              <ion-icon
                name="person-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Edit Profile</ion-label>
            </ion-item>

            <ion-item button detail (click)="changePassword()">
              <ion-icon
                name="lock-closed-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Change Password</ion-label>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider>
              <ion-label>Data & Privacy</ion-label>
            </ion-item-divider>

            <ion-item>
              <ion-icon
                name="cloud-upload-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Automatic Backup</ion-label>
              <ion-toggle [(ngModel)]="settings.automaticBackup"></ion-toggle>
            </ion-item>

            <ion-item button detail (click)="manageDataSharing()">
              <ion-icon
                name="share-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Data Sharing Preferences</ion-label>
            </ion-item>

            <ion-item button detail (click)="exportData()">
              <ion-icon
                name="download-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Export Medical Data</ion-label>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider>
              <ion-label>Notifications</ion-label>
            </ion-item-divider>

            <ion-item>
              <ion-icon
                name="calendar-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Appointment Reminders</ion-label>
              <ion-toggle
                [(ngModel)]="settings.appointmentReminders"
              ></ion-toggle>
            </ion-item>

            <ion-item>
              <ion-icon
                name="fitness-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Vaccination Reminders</ion-label>
              <ion-toggle
                [(ngModel)]="settings.vaccinationReminders"
              ></ion-toggle>
            </ion-item>

            <ion-item>
              <ion-icon
                name="flask-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Lab Results Notifications</ion-label>
              <ion-toggle
                [(ngModel)]="settings.labResultsNotifications"
              ></ion-toggle>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider>
              <ion-label>Integrations</ion-label>
            </ion-item-divider>

            <ion-item button detail (click)="connectLab('esculab')">
              <ion-icon
                name="link-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Connect to Esculab</ion-label>
              <ion-note
                slot="end"
                *ngIf="settings.esculabConnected"
                color="success"
                >Connected</ion-note
              >
            </ion-item>

            <ion-item button detail (click)="connectHealthDevice()">
              <ion-icon
                name="pulse-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Connect Health Devices</ion-label>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider>
              <ion-label>About</ion-label>
            </ion-item-divider>

            <ion-item button detail (click)="showAbout()">
              <ion-icon
                name="information-circle-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>About CliniCore</ion-label>
            </ion-item>

            <ion-item button detail (click)="showPrivacyPolicy()">
              <ion-icon
                name="document-text-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Privacy Policy</ion-label>
            </ion-item>

            <ion-item button detail (click)="showTermsOfService()">
              <ion-icon
                name="document-outline"
                slot="start"
                color="primary"
              ></ion-icon>
              <ion-label>Terms of Service</ion-label>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <div class="logout-container">
          <ion-button expand="block" color="danger" (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Log Out
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .container {
        padding: 16px;
      }

      ion-item-divider {
        background-color: var(--ion-color-light);
        color: var(--ion-color-medium);
        font-weight: bold;
      }

      .logout-container {
        margin-top: 32px;
        margin-bottom: 32px;
      }
    `,
  ],
})
export class SettingsPage {
  settings = {
    automaticBackup: true,
    appointmentReminders: true,
    vaccinationReminders: true,
    labResultsNotifications: true,
    esculabConnected: false,
  };

  constructor() {
    addIcons({
      personOutline,
      lockClosedOutline,
      cloudUploadOutline,
      shareOutline,
      downloadOutline,
      calendarOutline,
      fitnessOutline,
      flaskOutline,
      linkOutline,
      pulseOutline,
      informationCircleOutline,
      documentTextOutline,
      documentOutline,
      logOutOutline
    });
  }

  editProfile() {
    console.log('Edit profile');
    // Implement edit profile functionality
  }

  changePassword() {
    console.log('Change password');
    // Implement change password functionality
  }

  manageDataSharing() {
    console.log('Manage data sharing');
    // Implement manage data sharing functionality
  }

  exportData() {
    console.log('Export data');
    // Implement export data functionality
  }

  connectLab(lab: string) {
    console.log('Connect to lab:', lab);
    // Implement connect to lab functionality
  }

  connectHealthDevice() {
    console.log('Connect health device');
    // Implement connect health device functionality
  }

  showAbout() {
    console.log('Show about');
    // Implement show about functionality
  }

  showPrivacyPolicy() {
    console.log('Show privacy policy');
    // Implement show privacy policy functionality
  }

  showTermsOfService() {
    console.log('Show terms of service');
    // Implement show terms of service functionality
  }

  logout() {
    console.log('Logout');
    // Implement logout functionality
  }
}
