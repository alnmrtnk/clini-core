import { Component, type OnInit } from "@angular/core"
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
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonButton,
} from "@ionic/angular/standalone"
import { NgFor } from "@angular/common"
import { addIcons } from "ionicons"
import { pulse, fitness, medkit, calendar } from "ionicons/icons"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
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
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonList,
    IonButton,
    NgFor,
  ],
})
export class DashboardPage implements OnInit {
  upcomingAppointments = [
    {
      doctor: "Dr. Smith",
      specialty: "Cardiologist",
      date: "2025-03-15",
      time: "10:00 AM",
      location: "Heart Health Clinic",
    },
    {
      doctor: "Dr. Johnson",
      specialty: "General Practitioner",
      date: "2025-03-20",
      time: "2:30 PM",
      location: "City Medical Center",
    },
  ]

  upcomingVaccinations = [
    {
      name: "Flu Vaccine",
      dueDate: "2025-04-01",
      location: "City Medical Center",
    },
  ]

  recentPrescriptions = [
    {
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      refillDate: "2025-03-25",
    },
    {
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      refillDate: "2025-04-05",
    },
  ]

  constructor() {
    addIcons({ pulse, fitness, medkit, calendar })
  }

  ngOnInit() {}
}

