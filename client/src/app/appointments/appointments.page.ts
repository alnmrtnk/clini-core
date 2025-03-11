import { Component, type OnInit } from "@angular/core"
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonList,
  IonItemSliding,
  IonItem,
  IonIcon,
  IonLabel,
  IonBadge,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonButton,
} from "@ionic/angular/standalone"
import { NgFor, NgIf } from "@angular/common"
import { addIcons } from "ionicons"
import { calendar, checkmarkCircle, closeCircle, create, trash, add, addCircle } from "ionicons/icons"

interface Appointment {
  id: number
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  notes?: string
  status: "upcoming" | "completed" | "cancelled"
}

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.page.html",
  styleUrls: ["./appointments.page.scss"],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
    IonSegment,
    IonSegmentButton,
    IonButton,
    NgFor,
    NgIf,
  ],
})
export class AppointmentsPage implements OnInit {
  appointments: Appointment[] = [
    {
      id: 1,
      doctor: "Dr. Smith",
      specialty: "Cardiologist",
      date: "2025-03-15",
      time: "10:00 AM",
      location: "Heart Health Clinic",
      notes: "Annual heart checkup",
      status: "upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Johnson",
      specialty: "General Practitioner",
      date: "2025-03-20",
      time: "2:30 PM",
      location: "City Medical Center",
      status: "upcoming",
    },
    {
      id: 3,
      doctor: "Dr. Williams",
      specialty: "Dermatologist",
      date: "2024-12-05",
      time: "9:15 AM",
      location: "Skin Care Clinic",
      notes: "Skin examination",
      status: "completed",
    },
  ]

  segment = "upcoming"

  constructor() {
    addIcons({ calendar, checkmarkCircle, closeCircle, create, trash, add, addCircle })
  }

  ngOnInit() {}

  getFilteredAppointments() {
    if (this.segment === "all") {
      return this.appointments
    } else {
      return this.appointments.filter((a) => a.status === this.segment)
    }
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value
  }
}

