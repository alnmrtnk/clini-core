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
  personOutline,
  pulseOutline,
  shareOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'settings.page.html',
  styleUrl: 'settings.page.scss',
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
      logOutOutline,
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
