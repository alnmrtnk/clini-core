import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MedicalRecord } from '../models/medical-record.model';
import { BaseEntityService } from './base-entity.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService extends BaseEntityService<MedicalRecord> {
  protected baseUrl = '/api/MedicalRecords';
  constructor(http: HttpClient) {
    super(http);
  }
  
  getByUser(userId: string): Observable<MedicalRecord[]> {
    return this.getAll({ userId });
  }
}