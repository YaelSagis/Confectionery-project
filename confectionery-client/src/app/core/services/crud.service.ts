import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../config';

/** Matches the REST shape shared by every controller in Clean.API. */
export abstract class CrudService<T, TInput> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly resource: string;

  private get url(): string {
    return `${API_BASE}/${this.resource}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(body: TInput): Observable<void> {
    return this.http.post<void>(this.url, body);
  }

  update(id: number, body: TInput): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
