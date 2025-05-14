import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HealthMeasurement } from '../models/health-measurement.model';
import { BaseEntityService } from './base-entity.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthMeasurementService extends BaseEntityService<HealthMeasurement> {
  protected baseUrl = 'HealthMeasurements';
  constructor(http: HttpClient) {
    super(http);
  }

  getByUser(userId: string): Observable<HealthMeasurement[]> {
    return this.getAll({ userId });
  }
}
