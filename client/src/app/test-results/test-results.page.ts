import { Component, type OnInit } from "@angular/core"
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonListHeader,
  IonBadge,
  IonButton,
  IonFab,
  IonFabButton,
} from "@ionic/angular/standalone"
import { NgFor, NgIf, NgClass } from "@angular/common"
import { addIcons } from "ionicons"
import { documentText, arrowBack, chevronForward, filter, add } from "ionicons/icons"

interface TestResult {
  id: number
  name: string
  date: string
  category: string
  provider: string
  location: string
  results: TestResultItem[]
  notes?: string
}

interface TestResultItem {
  name: string
  value: string
  unit: string
  referenceRange: string
  flag?: "normal" | "high" | "low" | "critical"
}

@Component({
  selector: "app-test-results",
  templateUrl: "./test-results.page.html",
  styleUrls: ["./test-results.page.scss"],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonListHeader,
    IonBadge,
    IonButton,
    IonFab,
    IonFabButton,
    NgFor,
    NgIf,
    NgClass,
  ],
})
export class TestResultsPage implements OnInit {
  testResults: TestResult[] = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      date: "2025-02-15",
      category: "Blood",
      provider: "Dr. Smith",
      location: "City Medical Center",
      results: [
        {
          name: "White Blood Cell Count",
          value: "7.5",
          unit: "K/uL",
          referenceRange: "4.5-11.0",
          flag: "normal",
        },
        {
          name: "Red Blood Cell Count",
          value: "5.2",
          unit: "M/uL",
          referenceRange: "4.5-5.9",
          flag: "normal",
        },
        {
          name: "Hemoglobin",
          value: "14.2",
          unit: "g/dL",
          referenceRange: "13.5-17.5",
          flag: "normal",
        },
        {
          name: "Hematocrit",
          value: "42",
          unit: "%",
          referenceRange: "41-50",
          flag: "normal",
        },
        {
          name: "Platelet Count",
          value: "350",
          unit: "K/uL",
          referenceRange: "150-450",
          flag: "normal",
        },
      ],
    },
    {
      id: 2,
      name: "Lipid Panel",
      date: "2025-02-15",
      category: "Blood",
      provider: "Dr. Smith",
      location: "City Medical Center",
      results: [
        {
          name: "Total Cholesterol",
          value: "210",
          unit: "mg/dL",
          referenceRange: "<200",
          flag: "high",
        },
        {
          name: "HDL Cholesterol",
          value: "45",
          unit: "mg/dL",
          referenceRange: ">40",
          flag: "normal",
        },
        {
          name: "LDL Cholesterol",
          value: "130",
          unit: "mg/dL",
          referenceRange: "<100",
          flag: "high",
        },
        {
          name: "Triglycerides",
          value: "150",
          unit: "mg/dL",
          referenceRange: "<150",
          flag: "normal",
        },
      ],
      notes: "Follow up in 3 months. Consider dietary changes to lower cholesterol.",
    },
    {
      id: 3,
      name: "Comprehensive Metabolic Panel",
      date: "2024-11-10",
      category: "Blood",
      provider: "Dr. Johnson",
      location: "Community Health Clinic",
      results: [
        {
          name: "Glucose",
          value: "95",
          unit: "mg/dL",
          referenceRange: "70-99",
          flag: "normal",
        },
        {
          name: "BUN",
          value: "15",
          unit: "mg/dL",
          referenceRange: "7-20",
          flag: "normal",
        },
        {
          name: "Creatinine",
          value: "0.9",
          unit: "mg/dL",
          referenceRange: "0.6-1.2",
          flag: "normal",
        },
        {
          name: "Sodium",
          value: "140",
          unit: "mmol/L",
          referenceRange: "136-145",
          flag: "normal",
        },
        {
          name: "Potassium",
          value: "4.0",
          unit: "mmol/L",
          referenceRange: "3.5-5.1",
          flag: "normal",
        },
      ],
    },
  ]

  selectedResult: TestResult | null = null

  constructor() {
    addIcons({ documentText, arrowBack, chevronForward, filter, add })
  }

  ngOnInit() {}

  viewDetails(result: TestResult) {
    this.selectedResult = result
  }

  closeDetails() {
    this.selectedResult = null
  }
}

