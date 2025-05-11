import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import {
  CreateMedicalRecord,
  MedicalRecord,
} from '../models/medical-record.model';
import { BaseEntityService } from './base-entity.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService extends BaseEntityService<MedicalRecord> {
  protected baseUrl = 'MedicalRecords';
  constructor(http: HttpClient) {
    super(http);
  }

  upload(
    dto: CreateMedicalRecord,
    files: File[]
  ): Observable<HttpEvent<{ id: string }>> {
    const formData = new FormData();
    formData.append('recordTypeId', dto.recordTypeId);
    formData.append('title', dto.title);
    formData.append('date', new Date(dto.date).toISOString());
    if (dto.notes) {
      formData.append('notes', dto.notes);
    }
    files.forEach((f) => formData.append('files', f, f.name));

    return this.http.post<{ id: string }>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
