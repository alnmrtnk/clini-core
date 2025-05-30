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
  readonly comments: Signal<DoctorCommentDto[]> = toSignal(
    this.store.select(DoctorCommentState.comments),
    {
      initialValue: [],
    }
  );

  // Search and filter properties
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
  isToken = false;

  constructor() {
    effect(() => {
      // Initialize new comments for each record
      this.sharedGroups().forEach((group) => {
        group.records.forEach((record) => {
          if (!this.newComments[record.id]) {
            this.newComments[record.id] = { text: '', typeId: '' };
          }
        });
      });

      // Extract unique record types for filter dropdown
      this.extractRecordTypes();

      // Apply initial filtering
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      this.store.dispatch(new LoadCommentTypes());

      const token = pm.get('token');
      if (token) {
        this.isToken = true;
        this.store.dispatch(new LoadSharedRecords(token));
      } else {
        this.store.dispatch(new LoadSharedRecords(null));
      }
    });
  }

  // Extract unique record types from all records
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

  // Apply search and filters to records
  applyFilters(): void {
    const searchLower = this.searchTerm.toLowerCase().trim();

    // Create a deep copy of the groups to avoid modifying the original data
    const filteredGroups = this.sharedGroups().map((group) => {
      // Filter records within each group
      const filteredRecords = group.records.filter((record) => {
        // Search term filtering
        const matchesSearch =
          !searchLower ||
          record.title.toLowerCase().includes(searchLower) ||
          record.recordType?.name?.toLowerCase().includes(searchLower) ||
          group.ownerName.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // Record filtering
        if (
          this.filters.recordType &&
          record.recordType?.name !== this.filters.recordType
        ) {
          return false;
        }

        // Date range filtering
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
              cutoffDate = new Date(0); // Beginning of time
          }

          if (recordDate < cutoffDate) {
            return false;
          }
        }

        // Has files filtering
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

      // Return a new group object with filtered records
      return {
        ...group,
        records: filteredRecords,
      };
    });

    // Filter out groups with no matching records
    this.filteredGroups = filteredGroups.filter(
      (group) => group.records.length > 0
    );
  }

  // Reset all filters and search
  resetFilters(): void {
    this.searchTerm = '';
    this.filters = {
      recordType: '',
      dateRange: '',
      hasFiles: '',
    };
    this.applyFilters();
  }

  // Get total number of records across all filtered groups
  getTotalRecordsCount(): number {
    return this.filteredGroups.reduce(
      (total, group) => total + group.records.length,
      0
    );
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
