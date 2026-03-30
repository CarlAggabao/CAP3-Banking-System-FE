import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLogPage } from '../../shared/models/audit-log';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = environment.ADMIN_API_URL + '/audit-logs';

  constructor(private http: HttpClient) {}

  search(
    actor?: string,
    action?: string,
    from?: string,
    to?: string,
    page: number = 0,
    size: number = 20
  ): Observable<AuditLogPage> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (actor) params = params.set('actor', actor);
    if (action) params = params.set('action', action);
    if (from)   params = params.set('from', from);
    if (to)     params = params.set('to', to);

    return this.http.get<AuditLogPage>(this.apiUrl, { params });
  }
}