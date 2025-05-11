import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseEntityService } from './base-entity.service';
import { RecordType } from '../models/record-type.model';

@Injectable({ providedIn: 'root' })
export class RecordTypeService extends BaseEntityService<RecordType> {
  protected baseUrl = 'RecordTypes';

  constructor(http: HttpClient) {
    super(http);
  }
}