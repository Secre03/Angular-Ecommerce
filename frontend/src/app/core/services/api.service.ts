import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api/v1';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k] != null) httpParams = httpParams.set(k, params[k]); });
    return this.http.get<T>(`${this.base}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`);
  }

  upload<T>(path: string, formData: FormData): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, formData);
  }

  postUpload<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, formData);
  }
}