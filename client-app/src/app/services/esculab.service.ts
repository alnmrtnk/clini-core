import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  EsculabOrderDto,
  LabResultDto,
  PatientDto,
} from '../models/esculab.model';

@Injectable({
  providedIn: 'root',
})
export class EsculabService {
  private apiUrl = `${environment.apiUrl}Esculab/`;

  constructor(private http: HttpClient) {}

  requestVerificationCode(phone: string): Observable<string> {
    return this.http
      .post<any>(
        `${this.apiUrl}authorize?phone=${encodeURIComponent(phone)}`,
        {}
      )
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  verifyCode(uuid: string, code: string): Observable<string> {
    return this.http
      .post<any>(`${this.apiUrl}accept-token?code=${code}&uuid=${uuid}`, {})
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }
  
  findPatient(esculabToken: string): Observable<PatientDto> {
    return this.http
      .get<any>(`${this.apiUrl}find-patient?esculabToken=${esculabToken}`)
      .pipe(
        map((response) => {
          return response.data;
          //throw new Error(response.message || 'Failed to find patient');
        })
      );
  }

  getLabOrders(esculabToken: string): Observable<EsculabOrderDto[]> {
    return this.http
      .get<any>(`${this.apiUrl}get-all-orders?esculabToken=${esculabToken}`)
      .pipe(
        map((response) => {
          return response.data;
          //throw new Error(response.message || 'Failed to get lab orders');
        })
      );
  }

  /**
   * Get detailed results for a specific lab order
   */
  getOrderDetails(
    orderId: number,
    esculabToken: string
  ): Observable<LabResultDto[]> {
    return this.http
      .get<any>(
        `${this.apiUrl}get-order/${orderId}?esculabToken=${esculabToken}`
      )
      .pipe(
        map((response) => {
          return response.data;
          //throw new Error(response.message || 'Failed to get order details');
        })
      );
  }
}
