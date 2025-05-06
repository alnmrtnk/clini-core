import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MedicalRecordFile } from 'src/app/models/medical-record.model';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class FileViewerComponent {
  readonly file = input<MedicalRecordFile | null>(null);
  readonly safeUrl = input<SafeResourceUrl | null>(null);

  isLoading = true;
  hasError = false;
  errorMessage = 'Failed to load file. Please try downloading instead.';
  zoomLevel = 1;

  readonly fileExtension = computed(() => {
    const file = this.file();
    if (!file) return '';
    return file.fileName.split('.').pop() || '';
  });

  readonly isPdfFile = computed(() => {
    return this.fileExtension().toLowerCase() === 'pdf';
  });

  readonly isImageFile = computed(() => {
    const ext = this.fileExtension().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
  });

  readonly fileIcon = computed(() => {
    if (!this.file) return 'document-outline';

    const ext = this.fileExtension().toLowerCase();

    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return 'document-outline';
    }

    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return 'grid-outline';
    }

    if (['ppt', 'pptx'].includes(ext)) {
      return 'easel-outline';
    }

    if (['zip', 'rar', '7z'].includes(ext)) {
      return 'archive-outline';
    }

    return 'document-attach-outline';
  })

  constructor() {
    effect(() => {
      console.log(this.file(), this.safeUrl());
      this.isLoading = true;
      this.hasError = false;
      this.zoomLevel = 1;
    });
  }

  onFileLoaded() {
    this.isLoading = false;
    this.hasError = false;
  }

  onFileError() {
    this.isLoading = false;
    this.hasError = true;
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
    this.applyZoom();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.5);
    this.applyZoom();
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.applyZoom();
  }

  applyZoom() {
    const imgElement = document.querySelector(
      '.image-viewer img'
    ) as HTMLImageElement;
    if (imgElement) {
      imgElement.style.transform = `scale(${this.zoomLevel})`;
    }
  }

  downloadFile() {
    const file = this.file();
    if (!file) return;
    window.open(file.url, '_blank');
  }

  shareFile() {
    const file = this.file();
    if (!file) return;

    if (navigator.share) {
      navigator
        .share({
          title: file.fileName,
          url: file.url,
        })
        .catch((error) => {
          console.error('Error sharing file:', error);
        });
    } else {
      alert(
        'Share feature is not supported in your browser. You can copy the link instead.'
      );
    }
  }
}
