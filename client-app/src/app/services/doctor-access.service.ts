import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DoctorAccess } from '../models/doctor-access.model';
import { BaseEntityService } from './base-entity.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorAccessService extends BaseEntityService<DoctorAccess> {
  protected baseUrl = 'DoctorAccess';
  constructor(http: HttpClient) {
    super(http);
  }

  getAllAccesses(): Observable<DoctorAccess[]> {
    return this.getAll({}, '/granted');
  }
}