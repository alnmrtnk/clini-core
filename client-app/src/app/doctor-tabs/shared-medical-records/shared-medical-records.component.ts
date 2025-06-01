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
import { LoadCommentTypes } from 'src/app/store/doctor-comment.state';
import {
  MedicalRecordGroupDto,
  MedicalRecord,
  MedicalRecordFile,
} from 'src/app/models/medical-record.model';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DoctorCommentDto } from 'src/app/models/doctor-comment.model';
import { DocumentGalleryComponent } from 'src/app/tabs/medical-record-page/components/docunent-gallery/docunent-gallery.component';
import { FileViewerComponent } from 'src/app/tabs/shared/file-viewer/file-viewer.component';
import { NewCommentComponent } from './components/new-comment/new-comment.component';
import { CommentsComponent } from './components/comments/comments.component';

export interface NewCommentInput {
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
    NewCommentComponent,
    CommentsComponent,
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
    { initialValue: [] }
  );

  showDetailsMap = new Map<string, boolean>();

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

        group.esculabRecords?.forEach((order) => {
          const key = order.id;
          if (!this.newComments[key]) {
            this.newComments[key] = {
              text: '',
              typeId: '',
              isPublic: false,
            };
          }

          if (!this.showDetailsMap.has(order.id)) {
            this.showDetailsMap.set(order.id, false);
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
        if (!searchLower.length) return true;

        const matchesSearch =
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
          const hasFiles =
            Array.isArray(record.files) && record.files.length > 0;
          if (
            (this.filters.hasFiles === 'yes' && !hasFiles) ||
            (this.filters.hasFiles === 'no' && hasFiles)
          ) {
            return false;
          }
        }

        return true;
      });

      const filteredEsculab = (group.esculabRecords ?? []).filter((order) => {
        if (!searchLower) return true;

        const packetMatch = order.packet.toLowerCase().includes(searchLower);
        const ownerMatch = group.ownerName.toLowerCase().includes(searchLower);
        return packetMatch || ownerMatch;
      });

      return {
        ...group,
        records: filteredRecords,
        esculabRecords: filteredEsculab,
      } as MedicalRecordGroupDto;
    });

    this.filteredGroups = filteredGroups.filter(
      (group) =>
        group.records.length > 0 ||
        (Array.isArray(group.esculabRecords) && group.esculabRecords.length > 0)
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
    return this.filteredGroups.reduce((sum, group) => {
      return sum + group.records.length + (group.esculabRecords?.length ?? 0);
    }, 0);
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

  getCommentsForEsculabRecord(recordId: string): DoctorCommentDto[] {
    return (
      this.sharedGroups()
        .find((group) =>
          group.esculabRecords.some((r) => r.id === recordId)
        )
        ?.esculabRecords.find((r) => r.id === recordId)
        ?.doctorComments ?? []
    );
  }
  esculabHasComments(recordId: string): boolean {
    return this.getCommentsForEsculabRecord(recordId).length > 0;
  }
  getEsculabCommentsCount(recordId: string): number {
    return this.getCommentsForEsculabRecord(recordId).length;
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

  toggleDetails(orderId: string): void {
    const currently = this.showDetailsMap.get(orderId) || false;
    this.showDetailsMap.set(orderId, !currently);
  }

  isDetailVisible(orderId: string): boolean {
    return this.showDetailsMap.get(orderId) || false;
  }

  formatNormRange(normString: string | undefined): string {
    if (!normString) return 'Not specified';
    try {
      const normObj = JSON.parse(normString.replace(/'/g, '"'));
      return Object.entries(normObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    } catch {
      return normString.replace(/[{}"]/g, '');
    }
  }
}
