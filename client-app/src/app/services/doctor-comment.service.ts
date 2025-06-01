import { Injectable } from '@angular/core';
import { BaseEntityService } from './base-entity.service';
import {
  CreateDoctorCommentDto,
  DoctorCommentDto,
  DoctorCommentTypeDto,
} from '../models/doctor-comment.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Response } from '../models/response.type';

@Injectable({ providedIn: 'root' })
export class DoctorCommentService extends BaseEntityService<DoctorCommentDto> {
  protected baseUrl = 'DoctorComment';

  constructor(http: HttpClient) {
    super(http);
  }

  getByRecord(medicalRecordId: string): Observable<DoctorCommentDto[]> {
    return this.getAll(undefined, `/record/${medicalRecordId}`);
  }

  createComment(payload: CreateDoctorCommentDto): Observable<DoctorCommentDto> {
    return this.http
      .post<Response<DoctorCommentDto>>(this.apiUrl, payload)
      .pipe(map((r) => r.data));
  }

  updateComment(
    id: string,
    changes: Partial<DoctorCommentDto>
  ): Observable<void> {
    return this.update(id, changes);
  }

  deleteComment(id: string): Observable<void> {
    return this.delete(id);
  }
}
