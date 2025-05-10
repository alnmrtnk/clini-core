import { Injectable } from '@angular/core';
import { BaseEntityService } from './base-entity.service';
import { CreateDoctorCommentDto, DoctorCommentDto, DoctorCommentTypeDto } from '../models/doctor-comment.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorCommentTypeService extends BaseEntityService<DoctorCommentTypeDto> {
  protected baseUrl = '/DoctorComment';

  constructor(http: HttpClient) {
    super(http);
  }

  getTypes(): Observable<DoctorCommentTypeDto[]> {
    return this.getAll(undefined, `/types`);
  }
}
