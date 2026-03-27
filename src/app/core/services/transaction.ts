import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Transaction } from '../../shared/models/transaction';
import { TransactionRequest } from '../../shared/models/transaction-request';
import { Account } from '../../shared/models/account';


@Injectable({
  providedIn: 'root',
})
export class TransactionService {
    private adminApiUrl = environment.ADMIN_API_URL + '/transactions';

  
  constructor(private http: HttpClient) {}

  transfer(request: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(`${environment.API_URL}/customer/transfer`, request);
  }

  getMyTransactions(accountNumber: string): Observable<Transaction[]>{
    return this.http.get<Transaction[]>(`${environment.API_URL}/customer/transactions/${accountNumber}`);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.adminApiUrl);
  }

  getBalance(accountNumber: string): Observable<Account> {
    return this.http.get<Account>(`${environment.API_URL}/customer/balance/${accountNumber}`);
  }
}
