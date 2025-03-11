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
import { medkit, alertCircle, checkmarkCircle, refresh, create, trash, add, addCircle } from "ionicons/icons"

interface Prescription {
  id: number
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  refillDate?: string
  doctor: string
  pharmacy: string
  instructions: string
  status: "active" | "completed" | "refill-needed"
}

@Component({
  selector: "app-prescriptions",
  templateUrl: "./prescriptions.page.html",
  styleUrls: ["./prescriptions.page.scss"],
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
export class PrescriptionsPage implements OnInit {
  prescriptions: Prescription[] = [
    {
      id: 1,
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2024-01-15",
      refillDate: "2025-03-25",
      doctor: "Dr. Smith",
      pharmacy: "City Pharmacy",
      instructions: "Take in the morning with food",
      status: "active",
    },
    {
      id: 2,
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2024-02-10",
      refillDate: "2025-04-05",
      doctor: "Dr. Johnson",
      pharmacy: "MedPlus Pharmacy",
      instructions: "Take with meals",
      status: "active",
    },
    {
      id: 3,
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      startDate: "2024-11-05",
      endDate: "2024-11-15",
      doctor: "Dr. Williams",
      pharmacy: "Health First Pharmacy",
      instructions: "Take until completed",
      status: "completed",
    },
    {
      id: 4,
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      startDate: "2024-01-20",
      refillDate: "2025-03-15",
      doctor: "Dr. Smith",
      pharmacy: "City Pharmacy",
      instructions: "Take at night",
      status: "refill-needed",
    },
  ]

  segment = "active"

  constructor() {
    addIcons({ medkit, alertCircle, checkmarkCircle, refresh, create, trash, add, addCircle })
  }

  ngOnInit() {}

  getFilteredPrescriptions() {
    if (this.segment === "all") {
      return this.prescriptions
    } else {
      return this.prescriptions.filter((p) => p.status === this.segment)
    }
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value
  }
}

