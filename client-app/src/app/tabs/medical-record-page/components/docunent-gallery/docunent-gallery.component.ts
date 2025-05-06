import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MedicalRecordFile } from 'src/app/models/medical-record.model';

@Component({
  selector: 'app-document-gallery',
  imports: [CommonModule, IonicModule],
  templateUrl: 'docunent-gallery.component.html',
  styleUrls: ['docunent-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentGalleryComponent {
  readonly files = input<MedicalRecordFile[]>([]);
  readonly fileSelected = output<MedicalRecordFile>();

  readonly viewMode = signal<'grid' | 'list'>('grid');

  readonly isGridView = computed(() => this.viewMode() === 'grid');
  readonly isListView = computed(() => this.viewMode() === 'list');

  setViewMode( mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  selectFile(file: MedicalRecordFile) {
    this.fileSelected.emit(file);
  }

  downloadFile(file: MedicalRecordFile, event: Event) {
    event.stopPropagation();
    window.open(file.url, '_blank');
  }

  isImageFile(file: MedicalRecordFile): boolean {
    const ext = this.getFileExtension(file.fileName).toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop() ?? '';
  }

  getShortFileName(fileName: string): string {
    const ext = this.getFileExtension(fileName);
    const nameWithoutExt = fileName.slice(0, -ext.length - 1);
    return nameWithoutExt.length <= 15
      ? fileName
      : nameWithoutExt.slice(0, 15) + '...' + (ext ? '.' + ext : '');
  }

  getFileTypeClass(file: MedicalRecordFile): string {
    const ext = this.getFileExtension(file.fileName).toLowerCase();

    if (this.isImageFile(file)) return 'file-type-image';
    if (ext === 'pdf') return 'file-type-pdf';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'file-type-doc';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'file-type-xls';
    if (['ppt', 'pptx'].includes(ext)) return 'file-type-ppt';

    return 'file-type-other';
  }

  getFileIcon(file: MedicalRecordFile): string {
    const ext = this.getFileExtension(file.fileName).toLowerCase();

    if (this.isImageFile(file)) return 'image-outline';
    if (ext === 'pdf') return 'document-text-outline';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'document-outline';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'grid-outline';
    if (['ppt', 'pptx'].includes(ext)) return 'easel-outline';

    return 'document-attach-outline';
  }

  getFileIconColor(file: MedicalRecordFile): string {
    const ext = this.getFileExtension(file.fileName).toLowerCase();

    if (this.isImageFile(file)) return 'secondary';
    if (ext === 'pdf') return 'danger';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'primary';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'success';
    if (['ppt', 'pptx'].includes(ext)) return 'warning';

    return 'medium';
  }
}
