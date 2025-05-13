import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response.type';

@Injectable({ providedIn: 'root' })
export abstract class BaseEntityService<T> {
  protected abstract baseUrl: string;

  get apiUrl() {
    return `${environment.apiUrl}${this.baseUrl}`;
  }

  constructor(protected http: HttpClient) {}

  getAll(
    queryParams?: { [key: string]: any },
    path: string = ''
  ): Observable<T[]> {
    const url = this.apiUrl + path;

    let params = new HttpParams();
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          params = params.set(key, queryParams[key]);
        }
      });
    }
    return this.http
      .get<Response<T[]>>(url, { params })
      .pipe(map((r) => r.data));
  }

  getCustom<U>(path: string, params?: Record<string, any>): Observable<U> {
    const url = this.buildUrl(path);
    return this.http
      .get<Response<U>>(url, { params })
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<T> {
    return this.http
      .get<Response<T>>(`${this.apiUrl}/${id}`)
      .pipe(map((r) => r.data));
  }

  create(payload: Partial<T>): Observable<T> {
    return this.http
      .post<Response<T>>(this.apiUrl, payload)
      .pipe(map((r) => r.data));
  }

  update(id: string, changes: Partial<T>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  protected buildUrl(path = ''): string {
    const segs = [this.apiUrl, path]
      .filter((s) => !!s)
      .map((s) => s.replace(/^\/|\/$/g, ''));
    return segs.join('/');
  }
}
