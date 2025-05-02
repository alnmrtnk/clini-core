import { Component } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"

interface MedicalDocument {
  id: string
  title: string
  date: Date
  type: "report" | "image" | "prescription" | "form" | "other"
  icon: string
  thumbnail?: string
}

@Component({
  selector: "app-document-gallery",
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <div class="gallery-container">
      <div class="gallery-header">
        <h3>Medical Documents</h3>
        <ion-button fill="clear" size="small">
          <ion-icon name="add-outline" slot="start"></ion-icon>
          Add New
        </ion-button>
      </div>
      
      <div class="document-grid">
        <div class="document-card" *ngFor="let doc of documents" (click)="viewDocument(doc)">
          <div class="document-thumbnail" [ngClass]="'document-type-' + doc.type">
            <ion-icon *ngIf="!doc.thumbnail" [name]="doc.icon" class="document-icon"></ion-icon>
            <img *ngIf="doc.thumbnail" [src]="doc.thumbnail" alt="Document thumbnail" class="thumbnail-image">
          </div>
          <div class="document-info">
            <div class="document-title">{{ doc.title }}</div>
            <div class="document-date">{{ formatDate(doc.date) }}</div>
          </div>
        </div>
      </div>
      
      <div class="gallery-footer" *ngIf="documents.length > 0">
        <ion-button fill="clear" size="small">View All Documents</ion-button>
      </div>
      
      <div class="empty-gallery" *ngIf="documents.length === 0">
        <ion-icon name="document-outline"></ion-icon>
        <p>No documents yet</p>
        <ion-button size="small">Upload Document</ion-button>
      </div>
    </div>
  `,
  styles: [
    `
    .gallery-container {
      width: 100%;
    }
    
    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .gallery-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--ion-color-dark);
    }
    
    .document-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }
    
    .document-card {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .document-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .document-thumbnail {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ion-color-light);
    }
    
    .document-type-report {
      background-color: rgba(56, 128, 255, 0.1);
    }
    
    .document-type-image {
      background-color: rgba(61, 194, 255, 0.1);
    }
    
    .document-type-prescription {
      background-color: rgba(82, 96, 255, 0.1);
    }
    
    .document-type-form {
      background-color: rgba(45, 211, 111, 0.1);
    }
    
    .document-type-other {
      background-color: rgba(146, 148, 156, 0.1);
    }
    
    .document-icon {
      font-size: 36px;
      color: var(--ion-color-medium);
    }
    
    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .document-info {
      padding: 12px;
    }
    
    .document-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--ion-color-dark);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .document-date {
      font-size: 12px;
      color: var(--ion-color-medium);
    }
    
    .gallery-footer {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }
    
    .empty-gallery {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      background-color: white;
      border-radius: 12px;
      text-align: center;
    }
    
    .empty-gallery ion-icon {
      font-size: 48px;
      color: var(--ion-color-medium);
      margin-bottom: 16px;
    }
    
    .empty-gallery p {
      margin: 0 0 16px 0;
      color: var(--ion-color-medium);
    }
    `,
  ],
})
export class DocumentGalleryComponent {
  documents: MedicalDocument[] = [
    {
      id: "doc1",
      title: "Blood Test Results",
      date: new Date(2023, 2, 15),
      type: "report",
      icon: "document-text-outline",
    },
    {
      id: "doc2",
      title: "Chest X-Ray",
      date: new Date(2023, 1, 10),
      type: "image",
      icon: "image-outline",
      thumbnail: "assets/placeholder-xray.jpg",
    },
    {
      id: "doc3",
      title: "Prescription",
      date: new Date(2023, 0, 5),
      type: "prescription",
      icon: "medkit-outline",
    },
    {
      id: "doc4",
      title: "Medical History Form",
      date: new Date(2022, 11, 20),
      type: "form",
      icon: "clipboard-outline",
    },
  ]

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  viewDocument(doc: MedicalDocument) {
    console.log("Viewing document:", doc.id)
    // Implement document viewing functionality
  }
}
