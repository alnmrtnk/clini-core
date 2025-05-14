import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vaccination } from '../models/vaccination.model';
import { BaseEntityService } from './base-entity.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VaccinationService extends BaseEntityService<Vaccination> {
  protected baseUrl = 'Vaccinations';
  constructor(http: HttpClient) {
    super(http);
  }

  getByUser(userId: string): Observable<Vaccination[]> {
    return this.getAll({ userId });
  }
}
