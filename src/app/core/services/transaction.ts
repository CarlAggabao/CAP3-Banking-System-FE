import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../shared/models/transaction';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = environment.ADMIN_API_URL + '/transactions';

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }
}
