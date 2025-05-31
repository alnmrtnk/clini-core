import {
  Component,
  inject,
  OnInit,
  HostBinding,
  computed,
  signal,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AddRecord,
  LoadRecord,
  LoadRecordTypes,
  RecordsState,
  UpdateRecord,
} from 'src/app/store/medical-record.state';
import {
  CreateMedicalRecord,
  MedicalRecord,
  MedicalRecordFile,
} from 'src/app/models/medical-record.model';
import { Store } from '@ngxs/store';
import { RecordType } from 'src/app/models/record-type.model';
import { getIcon } from 'src/app/utils/record.utils';
import { take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface MedicalRecordForm {
  recordTypeId: FormControl<string | null>;
  title: FormControl<string | null>;
  date: FormControl<string | null>;
  notes: FormControl<string | null>;
}

@Component({
  selector: 'app-medical-record-add',
  templateUrl: './medical-record-add.component.html',
  styleUrls: ['./medical-record-add.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class MedicalRecordAddComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private readonly sanitizer = inject(DomSanitizer);

  @HostBinding('class.dragging') dragging = false;

  form = this.fb.group<MedicalRecordForm>({
    recordTypeId: this.fb.control<string | null>(null, Validators.required),
    title: this.fb.control<string>('', Validators.required),
    date: this.fb.control<string>(
      new Date().toISOString(),
      Validators.required
    ),
    notes: this.fb.control<string>(''),
  });
  selectedFiles: File[] = [];
  isLoading = false;
  selectedFile: MedicalRecordFile | null = null;
  safeFileUrl: SafeResourceUrl | null = null;
  showFileViewer = false;
  removedFilesFromEdit = signal<MedicalRecordFile[]>([]);

  record = toSignal<MedicalRecord | null>(
    this.store.select(RecordsState.selectedRecord)
  );
  recordTypes = toSignal(inject(Store).select(RecordsState.recordTypes));
  uploading = toSignal(inject(Store).select(RecordsState.uploading));
  uploadProgress = toSignal(
    inject(Store).select(RecordsState.uploadingProgress)
  );

  filesFromEdit = computed(() =>
    this.record()?.files.filter(
      (f) => !this.removedFilesFromEdit().some((r) => r.id === f.id)
    )
  );

  ngOnInit() {
    this.loadRecord();
    this.store.dispatch(new LoadRecordTypes());
  }

  private loadRecord() {
    const recordId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!recordId) return;

    this.isLoading = true;

    this.store
      .dispatch(new LoadRecord(recordId))
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;

        this.fillWithEditRecord();
      });
  }

  private fillWithEditRecord() {
    const currentEditRecord = this.record();
    if (currentEditRecord) {
      this.form.setValue({
        recordTypeId: currentEditRecord.recordType.id,
        title: currentEditRecord.title,
        date: currentEditRecord.date,
        notes: currentEditRecord.notes ?? null,
      });
    }
  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.dragging = true;
  }

  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    this.dragging = false;
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.dragging = false;
    if (evt.dataTransfer?.files.length) {
      this.addFiles(evt.dataTransfer.files);
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(input.files);
    }
  }

  private addFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      this.selectedFiles.push(fileList.item(i) as File);
    }
  }

  removeEditFile(file: MedicalRecordFile) {
    this.removedFilesFromEdit.update((files) => [...files, file]);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  getRecordTypeIcon(type: RecordType) {
    return getIcon(type.name);
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image-outline';
    } else if (extension === 'pdf') {
      return 'document-text-outline';
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return 'document-outline';
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return 'grid-outline';
    } else {
      return 'document-attach-outline';
    }
  }

  getFileSize(file: File): string {
    const bytes = file.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  }

  submit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const dto: CreateMedicalRecord = {
      recordTypeId: formValue.recordTypeId ?? '',
      title: formValue.title ?? '',
      date: formValue.date ?? '',
      notes: formValue.notes ?? '',
    };

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.edit(id, dto);
      return;
    }

    this.store
      .dispatch(new AddRecord(dto, this.selectedFiles))
      .subscribe(() => {
        this.form.reset();
        this.selectedFiles = [];
        this.removedFilesFromEdit.set([]);
        if (!this.uploading()) {
          this.router.navigate(['/tabs/medical-records']);
        }
      });
  }

  edit(id: string, dto: CreateMedicalRecord) {
    this.store
      .dispatch(
        new UpdateRecord(
          id,
          dto,
          this.selectedFiles,
          this.removedFilesFromEdit().map((r) => r.id)
        )
      )
      .subscribe(() => {
        this.form.reset();
        if (!this.uploading()) {
          this.router.navigate(['/tabs/medical-records']);
        }
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
}
