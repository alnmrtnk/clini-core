import { Component, OnInit, inject, Signal, effect } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  AccessState,
  LoadSharedRecords,
} from 'src/app/store/doctor-access.state';
import {
  DoctorCommentState,
  LoadCommentTypes,
  LoadComments,
  AddComment,
} from 'src/app/store/doctor-comment.state';
import {
  MedicalRecordGroupDto,
  MedicalRecord,
  MedicalRecordFile,
} from 'src/app/models/medical-record.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  DoctorCommentTypeDto,
  DoctorCommentDto,
  CreateDoctorCommentDto,
} from 'src/app/models/doctor-comment.model';
import { DocumentGalleryComponent } from 'src/app/tabs/medical-record-page/components/docunent-gallery/docunent-gallery.component';
import { FileViewerComponent } from 'src/app/tabs/shared/file-viewer/file-viewer.component';

interface NewCommentInput {
  text: string;
  typeId: string;
}

@Component({
  selector: 'app-shared-records',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DocumentGalleryComponent,
    FileViewerComponent,
  ],
  templateUrl: './shared-medical-records.component.html',
  styleUrls: ['./shared-medical-records.component.scss'],
})
export class SharedMedicalRecordsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly sanitizer = inject(DomSanitizer);

  // State signals
  readonly sharedGroups: Signal<MedicalRecordGroupDto[]> = toSignal(
    this.store.select(AccessState.sharedRecords),
    { initialValue: [] }
  );
  readonly commentTypes: Signal<DoctorCommentTypeDto[]> = toSignal(
    this.store.select(DoctorCommentState.types),
    { initialValue: [] }
  );
  readonly comments: Signal<DoctorCommentDto[]> = toSignal(
    this.store.select(DoctorCommentState.comments),
    { initialValue: [] }
  );

  // UI state
  commentVisibility = new Map<string, boolean>();
  newComments: Record<string, NewCommentInput> = {};
  showFileViewer = false;
  selectedFile: MedicalRecordFile | null = null;
  safeFileUrl: SafeResourceUrl | null = null;

  constructor() {
    effect(() => {
      this.sharedGroups().forEach((group) => {
        group.records.forEach((record) => {
          if (!this.newComments[record.id]) {
            this.newComments[record.id] = { text: '', typeId: '' };
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const token = pm.get('token');
      if (token) {
        this.store.dispatch(new LoadSharedRecords(token));
        this.store.dispatch(new LoadCommentTypes());
      }
    });
  }

  toggleComments(recordId: string): void {
    const visible = this.commentVisibility.get(recordId) || false;
    this.commentVisibility.set(recordId, !visible);
    if (!visible) {
      this.store.dispatch(new LoadComments(recordId));
    }
  }

  isCommentVisible(recordId: string): boolean {
    return this.commentVisibility.get(recordId) || false;
  }

  getCommentsForRecord(recordId: string): DoctorCommentDto[] {
    return this.comments().filter((c) => c.medicalRecordId === recordId);
  }

  hasComments(recordId: string): boolean {
    return this.getCommentsForRecord(recordId).length > 0;
  }

  getCommentCount(recordId: string): number {
    return this.getCommentsForRecord(recordId).length;
  }

  clearNewComment(recordId: string): void {
    this.newComments[recordId] = { text: '', typeId: '' };
  }

  saveComment(record: MedicalRecord): void {
    const input = this.newComments[record.id];
    if (!input?.text.trim() || !input?.typeId) {
      return;
    }

    const dto: CreateDoctorCommentDto = {
      token: this.route.snapshot.paramMap.get('token') || undefined,
      medicalRecordId: record.id,
      doctorCommentTypeId: input.typeId,
      content: input.text.trim(),
      date: new Date().toISOString(),
    };

    this.store.dispatch(new AddComment(dto)).subscribe(() => {
      this.clearNewComment(record.id);
      this.store.dispatch(new LoadComments(record.id));
    });
  }

  openFile(file: MedicalRecordFile): void {
    this.selectedFile = file;
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file.url);
    this.showFileViewer = true;
  }

  downloadAllFiles(record: MedicalRecord): void {
    record.files?.forEach((file) => window.open(file.url, '_blank'));
  }

  closeFileViewer(): void {
    this.showFileViewer = false;
    this.selectedFile = null;
    this.safeFileUrl = null;
  }
}
