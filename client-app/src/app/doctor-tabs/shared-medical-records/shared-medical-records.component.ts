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
  MedicalRecordGroupDto,
  MedicalRecord,
  MedicalRecordFile,
} from 'src/app/models/medical-record.model';
import { DocumentGalleryComponent } from 'src/app/tabs/medical-record-page/components/docunent-gallery/docunent-gallery.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileViewerComponent } from 'src/app/tabs/medical-record-page/components/file-viewer/file-viewer.component';
import { DoctorCommentTypeDto } from 'src/app/models/doctor-comment.model';
import {
  DoctorCommentState,
  LoadCommentTypes,
} from 'src/app/store/doctor-comment.state';

// Interface for comment structure
interface RecordComment {
  id: string;
  text: string;
  timestamp: Date;
  doctorName: string;
  typeId?: string; // <- new
  typeName?: string; // <- new, for display
  isNew?: boolean;
}

type NewCommentInput = { text: string; typeId: string };

@Component({
  selector: 'app-shared-records',
  templateUrl: './shared-medical-records.component.html',
  styleUrls: ['./shared-medical-records.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DocumentGalleryComponent,
    FileViewerComponent,
  ],
})
export class SharedMedicalRecordsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly sanitizer = inject(DomSanitizer);

  readonly sharedGroups: Signal<MedicalRecordGroupDto[]> = toSignal(
    this.store.select(AccessState.sharedRecords),
    { initialValue: [] }
  );
  commentTypes = toSignal<DoctorCommentTypeDto[]>(
    this.store.select(DoctorCommentState.types)
  );

  // Current doctor info (mock)
  currentDoctor = {
    name: 'Dr. Sarah Johnson',
    id: 'doc-123',
  };

  newComments: Record<string, NewCommentInput> = {};

  showFileViewer = false;
  selectedFile: MedicalRecordFile | null = null;
  safeFileUrl: SafeResourceUrl | null = null;

  // Track existing comments for each record
  existingComments: Record<string, RecordComment[]> = {
    // Mock data - you would load this from your backend
    'record-1': [
      {
        id: 'comment-1',
        text: 'Patient shows normal blood pressure levels. Continue with current medication.',
        timestamp: new Date(2025, 4, 10, 14, 30),
        doctorName: 'Dr. Michael Chen',
      },
    ],
    'record-2': [
      {
        id: 'comment-2',
        text: 'Cholesterol levels are slightly elevated. Recommend dietary changes and follow-up in 3 months.',
        timestamp: new Date(2025, 4, 8, 9, 15),
        doctorName: 'Dr. Sarah Johnson',
      },
      {
        id: 'comment-3',
        text: 'Patient reports improved energy levels after medication adjustment.',
        timestamp: new Date(2025, 4, 11, 11, 45),
        doctorName: 'Dr. Sarah Johnson',
      },
    ],
  };

  commentVisibility = new Map<string, boolean>();

  constructor() {
    effect(() => {
      this.sharedGroups().forEach((group) =>
        group.records.forEach(
          (rec) => (this.newComments[rec.id] = { text: '', typeId: '' })
        )
      );
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

  clearNewComment(recordId: string) {
    this.newComments[recordId] = { text: '', typeId: '' };
  }

  toggleComments(recordId: string): void {
    const currentState = this.commentVisibility.get(recordId) || false;
    this.commentVisibility.set(recordId, !currentState);
  }

  isCommentVisible(recordId: string): boolean {
    return this.commentVisibility.get(recordId) || false;
  }

  getCommentsForRecord(recordId: string): RecordComment[] {
    return this.existingComments[recordId] || [];
  }

  hasComments(recordId: string): boolean {
    return (this.existingComments[recordId]?.length || 0) > 0;
  }

  getCommentCount(recordId: string): number {
    return this.existingComments[recordId]?.length || 0;
  }

  saveComment(record: MedicalRecord): void {
    const input = this.newComments[record.id];
    if (!input?.text?.trim() || !input?.typeId) {
      return;
    }

    // Find the full type DTO so we can show its name later
    const typeDto = this.commentTypes()?.find((t) => t.id === input.typeId);

    const newComment: RecordComment = {
      id: `comment-${Date.now()}`,
      text: input.text.trim(),
      timestamp: new Date(),
      doctorName: this.currentDoctor.name,
      typeId: input.typeId,
      typeName: typeDto?.name,
      isNew: true,
    };

    // prepend to the list
    if (!this.existingComments[record.id]) {
      this.existingComments[record.id] = [];
    }
    this.existingComments[record.id].unshift(newComment);

    // reset the inputs
    this.clearNewComment(record.id);

    // persist to server...
    console.log('Saving comment', newComment);

    // drop the "new" flag after the animation
    setTimeout(() => {
      newComment.isNew = false;
    }, 3000);
  }

  openFile(file: MedicalRecordFile) {
    this.selectedFile = file;
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file.url);

    this.showFileViewer = true;
  }

  downloadAllFiles(record: MedicalRecord) {
    if (!record || !record.files || record.files.length === 0) return;

    record.files.forEach((file) => {
      window.open(file.url, '_blank');
    });
  }

  closeFileViewer() {
    this.showFileViewer = false;
    this.selectedFile = null;
    this.safeFileUrl = null;
  }
}
