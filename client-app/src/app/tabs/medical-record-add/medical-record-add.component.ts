import { Component, inject, type OnInit, HostBinding } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  type FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AddRecord,
  LoadRecordTypes,
  RecordsState,
} from 'src/app/store/medical-record.state';
import type { CreateMedicalRecord } from 'src/app/models/medical-record.model';
import { Store } from '@ngxs/store';
import { RecordType } from 'src/app/models/record-type.model';
import { getIcon } from 'src/app/utils/record.utils';

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
  @HostBinding('class.dragging') dragging = false;
  selectedFiles: File[] = [];

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private store = inject(Store);

  form = this.fb.group<MedicalRecordForm>({
    recordTypeId: this.fb.control<string | null>(null, Validators.required),
    title: this.fb.control<string>('', Validators.required),
    date: this.fb.control<string>(
      new Date().toISOString(),
      Validators.required
    ),
    notes: this.fb.control<string>(''),
  });

  recordTypes = toSignal(inject(Store).select(RecordsState.recordTypes));
  uploading = toSignal(inject(Store).select(RecordsState.uploading));
  uploadProgress = toSignal(
    inject(Store).select(RecordsState.uploadingProgress)
  );

  ngOnInit() {
    this.store.dispatch(new LoadRecordTypes());
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

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  getRecordTypeIcon(type: RecordType) {
    return getIcon(type.name);
  }

  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

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

    this.store
      .dispatch(new AddRecord(dto, this.selectedFiles))
      .subscribe(() => {
        if (!this.uploading()) {
          this.router.navigate(['/tabs/medical-records']);
        }
      });
  }
}
