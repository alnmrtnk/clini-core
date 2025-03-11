import { Component, type OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonIcon
} from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { create } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
    IonLabel,
    IonButton,
    NgFor,
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonIcon
  ],
})
export class ProfilePage implements OnInit {
  profile = {
    name: 'John Doe',
    dateOfBirth: '1980-05-15',
    gender: 'Male',
    bloodType: 'O+',
    height: '180 cm',
    weight: '75 kg',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 123-4567',
    },
    primaryPhysician: {
      name: 'Dr. Smith',
      specialty: 'Family Medicine',
      phone: '(555) 987-6543',
      address: '123 Medical Center Dr, Anytown, USA',
    },
    insurance: {
      provider: 'Health Plus',
      policyNumber: 'HP12345678',
      groupNumber: 'G9876',
      phone: '(800) 555-1234',
    },
  };

  constructor() {
    addIcons({ create });
  }

  ngOnInit() {}
}
