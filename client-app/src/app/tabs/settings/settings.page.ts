import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    labResultsNotifications: true,
    esculabConnected: false,
  };

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
