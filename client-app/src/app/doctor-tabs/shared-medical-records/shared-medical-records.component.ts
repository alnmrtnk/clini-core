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
  isPublic: boolean;
}

interface FilterOptions {
  recordType: string;
  dateRange: string;
  hasFiles: string;
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

  readonly sharedGroups: Signal<MedicalRecordGroupDto[]> = toSignal(
    this.store.select(AccessState.sharedRecords),
    {
      initialValue: [],
    }
  );
  readonly commentTypes: Signal<DoctorCommentTypeDto[]> = toSignal(
    this.store.select(DoctorCommentState.types),
    {
      initialValue: [],
    }
  );

  searchTerm = '';
  filters: FilterOptions = {
    recordType: '',
    dateRange: '',
    hasFiles: '',
  };
  filteredGroups: MedicalRecordGroupDto[] = [];
  recordTypes: string[] = [];

  commentVisibility = new Map<string, boolean>();
  newComments: Record<string, NewCommentInput> = {};
  showFileViewer = false;
  selectedFile: MedicalRecordFile | null = null;
  safeFileUrl: SafeResourceUrl | null = null;
  token: string | null = null;

  constructor() {
    effect(() => {
      this.sharedGroups().forEach((group) => {
        group.records.forEach((record) => {
          if (!this.newComments[record.id]) {
            this.newComments[record.id] = {
              text: '',
              typeId: '',
              isPublic: false,
            };
          }
        });
      });

      this.extractRecordTypes();

      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      this.store.dispatch(new LoadCommentTypes());

      const token = pm.get('token');
      if (token) {
        this.token = token;
        this.store.dispatch(new LoadSharedRecords(token));
      } else {
        this.store.dispatch(new LoadSharedRecords(null));
      }
    });
  }

  extractRecordTypes(): void {
    const types = new Set<string>();
    this.sharedGroups().forEach((group) => {
      group.records.forEach((record) => {
        if (record.recordType && record.recordType.name) {
          types.add(record.recordType.name);
        }
      });
    });
    this.recordTypes = Array.from(types).sort();
  }

  applyFilters(): void {
    const searchLower = this.searchTerm.toLowerCase().trim();

    const filteredGroups = this.sharedGroups().map((group) => {
      const filteredRecords = group.records.filter((record) => {
        const matchesSearch =
          !searchLower ||
          record.title.toLowerCase().includes(searchLower) ||
          record.recordType?.name?.toLowerCase().includes(searchLower) ||
          group.ownerName.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        if (
          this.filters.recordType &&
          record.recordType?.name !== this.filters.recordType
        ) {
          return false;
        }

        if (this.filters.dateRange) {
          const recordDate = new Date(record.date);
          const now = new Date();
          let cutoffDate: Date;

          switch (this.filters.dateRange) {
            case 'week':
              cutoffDate = new Date(now.setDate(now.getDate() - 7));
              break;
            case 'month':
              cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
              break;
            case 'quarter':
              cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
              break;
            case 'year':
              cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
              break;
            default:
              cutoffDate = new Date(0);
          }

          if (recordDate < cutoffDate) {
            return false;
          }
        }

        if (this.filters.hasFiles) {
          const hasFiles = record.files && record.files.length > 0;
          if (
            (this.filters.hasFiles === 'yes' && !hasFiles) ||
            (this.filters.hasFiles === 'no' && hasFiles)
          ) {
            return false;
          }
        }

        return true;
      });

      return {
        ...group,
        records: filteredRecords,
      };
    });

    this.filteredGroups = filteredGroups.filter(
      (group) => group.records.length > 0
    );
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filters = {
      recordType: '',
      dateRange: '',
      hasFiles: '',
    };
    this.applyFilters();
  }

  getTotalRecordsCount(): number {
    return this.filteredGroups.reduce(
      (total, group) => total + group.records.length,
      0
    );
  }

  toggleComments(recordId: string): void {
    const visible = this.commentVisibility.get(recordId) || false;
    this.commentVisibility.set(recordId, !visible);
  }

  isCommentVisible(recordId: string): boolean {
    return this.commentVisibility.get(recordId) || false;
  }

  getCommentsForRecord(recordId: string): DoctorCommentDto[] {
    return (
      this.sharedGroups()
        .find((group) => group.records.some((r) => r.id === recordId))
        ?.records.find((r) => r.id === recordId)?.doctorComments ?? []
    );
  }

  hasComments(recordId: string): boolean {
    return this.getCommentsForRecord(recordId).length > 0;
  }

  getCommentCount(recordId: string): number {
    return this.getCommentsForRecord(recordId).length;
  }

  clearNewComment(recordId: string): void {
    this.newComments[recordId] = { text: '', typeId: '', isPublic: false };
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
      isPublic: input.isPublic,
    };

    this.store.dispatch(new AddComment(dto)).subscribe(() => {
      this.clearNewComment(record.id);
      if (this.token) {
        this.store.dispatch(new LoadSharedRecords(this.token));
      } else {
        this.store.dispatch(new LoadSharedRecords(null));
      }
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
