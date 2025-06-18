import { Component, computed, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  MedicalRecord,
  MedicalRecordFile,
} from 'src/app/models/medical-record.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DocumentGalleryComponent } from './components/docunent-gallery/docunent-gallery.component';
import { LoadRecord, RecordsState } from 'src/app/store/medical-record.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { DoctorCommentDto } from 'src/app/models/doctor-comment.model';
import { FileViewerComponent } from '../shared/file-viewer/file-viewer.component';
import { DoctorCommentsComponent } from "../shared/doctor-comments/doctor-comments.component";

@Component({
  selector: 'app-medical-record-page',
  templateUrl: './medical-record-page.component.html',
  styleUrls: ['./medical-record-page.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FileViewerComponent,
    DocumentGalleryComponent,
    DoctorCommentsComponent
],
})
export class MedicalRecordPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  record = toSignal<MedicalRecord | null>(
    this.store.select(RecordsState.selectedRecord)
  );
  isLoading = true;
  errorMessage: string | null = null;
  showFileViewer = false;
  selectedFile: MedicalRecordFile | null = null;
  safeFileUrl: SafeResourceUrl | null = null;

  ngOnInit() {
    this.loadRecord();
  }

  loadRecord() {
    this.isLoading = true;
    this.errorMessage = null;

    const recordId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!recordId) {
      this.isLoading = false;
      this.errorMessage = 'Record ID not found';
      return;
    }

    this.store
      .dispatch(new LoadRecord(recordId))
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  openFile(file: MedicalRecordFile) {
    this.selectedFile = file;
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file.url);

    this.showFileViewer = true;
  }

  closeFileViewer() {
    this.showFileViewer = false;
    this.selectedFile = null;
    this.safeFileUrl = null;
  }

  downloadAllFiles() {
    const record = this.record();
    if (!record || !record.files || record.files.length === 0) return;

    record.files.forEach((file) => {
      window.open(file.url, '_blank');
    });
  }

  editRecord() {
    const record = this.record();
    if (!record) return;
    this.router.navigate(['/tabs/medical-records/add', record.id]);
  }
}
