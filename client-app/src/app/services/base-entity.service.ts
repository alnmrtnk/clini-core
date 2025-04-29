import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export abstract class BaseEntityService<T> {
  protected abstract baseUrl: string;

  get apiUrl() {
    return `${environment.apiUrl}${this.baseUrl}`;
  }

  constructor(protected http: HttpClient) {}

  getAll(queryParams?: { [key: string]: any }): Observable<T[]> {
    let params = new HttpParams();
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          params = params.set(key, queryParams[key]);
        }
      });
    }
    return this.http.get<T[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<T>): Observable<T> {
    return this.http.post<T>(this.apiUrl, payload);
  }

  update(id: string, changes: Partial<T>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
