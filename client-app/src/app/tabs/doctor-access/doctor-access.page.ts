import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { mailOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-doctor-access',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'doctor-access.page.html',
  styleUrl: 'doctor-access.page.scss',
})
export class DoctorAccessPage {
  showQRCode = false;
  activeGrants: any[] = [];
  accessHistory: any[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      avatar: '/placeholder.svg?height=40&width=40',
      accessedAt: new Date(Date.now() - 604800000), // 7 days ago
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      avatar: '/placeholder.svg?height=40&width=40',
      accessedAt: new Date(Date.now() - 2592000000), // 30 days ago
    },
  ];

  constructor() {
    addIcons({
      qrCodeOutline,
      mailOutline,
    });
  }

  generateQRCode() {
    this.showQRCode = true;
    // Implement QR code generation
  }

  sendEmailInvitation() {
    console.log('Send email invitation');
    // Implement email invitation functionality
  }

  revokeAccess(id: string) {
    console.log('Revoke access:', id);
    // Implement revoke access functionality
  }
}
