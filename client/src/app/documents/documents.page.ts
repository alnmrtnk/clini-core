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
  IonFab,
  IonFabButton,
  IonButton,
} from "@ionic/angular/standalone"
import { NgFor } from "@angular/common"
import { addIcons } from "ionicons"
import { documentText, image, document, download, share, filter, add } from "ionicons/icons"

interface Document {
  id: number
  name: string
  type: "pdf" | "image" | "doc"
  date: string
  provider: string
  category: string
  size: string
}

@Component({
  selector: "app-documents",
  templateUrl: "./documents.page.html",
  styleUrls: ["./documents.page.scss"],
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
    IonFab,
    IonFabButton,
    IonButton,
    NgFor,
  ],
})
export class DocumentsPage implements OnInit {
  documents: Document[] = [
    {
      id: 1,
      name: "Annual Physical Report",
      type: "pdf",
      date: "2025-02-15",
      provider: "Dr. Smith",
      category: "Reports",
      size: "1.2 MB",
    },
    {
      id: 2,
      name: "Chest X-Ray",
      type: "image",
      date: "2025-02-15",
      provider: "City Medical Center",
      category: "Imaging",
      size: "3.5 MB",
    },
    {
      id: 3,
      name: "Vaccination Record",
      type: "pdf",
      date: "2024-10-10",
      provider: "Health Department",
      category: "Immunizations",
      size: "0.8 MB",
    },
    {
      id: 4,
      name: "Medical History Summary",
      type: "doc",
      date: "2024-09-05",
      provider: "Dr. Johnson",
      category: "Reports",
      size: "0.5 MB",
    },
  ]

  constructor() {
    addIcons({ documentText, image, document, download, share, filter, add })
  }

  ngOnInit() {}

  getIconForType(type: string) {
    switch (type) {
      case "pdf":
        return "document-text"
      case "image":
        return "image"
      case "doc":
        return "document"
      default:
        return "document"
    }
  }
}

