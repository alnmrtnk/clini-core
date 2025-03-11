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
import { checkmarkCircle, time, create, trash, add, addCircle } from "ionicons/icons"

interface Vaccination {
  id: number
  name: string
  date: string
  provider: string
  location: string
  nextDose?: string
  status: "completed" | "scheduled" | "due"
}

@Component({
  selector: "app-vaccinations",
  templateUrl: "./vaccinations.page.html",
  styleUrls: ["./vaccinations.page.scss"],
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
export class VaccinationsPage implements OnInit {
  vaccinations: Vaccination[] = [
    {
      id: 1,
      name: "Influenza (Flu)",
      date: "2024-10-15",
      provider: "Dr. Johnson",
      location: "City Medical Center",
      nextDose: "2025-10-15",
      status: "completed",
    },
    {
      id: 2,
      name: "COVID-19 Booster",
      date: "2024-08-22",
      provider: "Dr. Smith",
      location: "Community Health Clinic",
      status: "completed",
    },
    {
      id: 3,
      name: "Tetanus/Diphtheria (Td)",
      date: "2020-05-10",
      provider: "Dr. Williams",
      location: "University Hospital",
      nextDose: "2030-05-10",
      status: "completed",
    },
    {
      id: 4,
      name: "Pneumococcal",
      date: "2025-04-01",
      provider: "Dr. Johnson",
      location: "City Medical Center",
      status: "scheduled",
    },
    {
      id: 5,
      name: "Shingles (Shingrix)",
      date: "",
      provider: "",
      location: "",
      status: "due",
    },
  ]

  segment = "all"

  constructor() {
    addIcons({ checkmarkCircle, time, create, trash, add, addCircle })
  }

  ngOnInit() {}

  getFilteredVaccinations() {
    if (this.segment === "all") {
      return this.vaccinations
    } else if (this.segment === "completed") {
      return this.vaccinations.filter((v) => v.status === "completed")
    } else if (this.segment === "upcoming") {
      return this.vaccinations.filter((v) => v.status === "scheduled" || v.status === "due")
    }
    return this.vaccinations
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value
  }
}

