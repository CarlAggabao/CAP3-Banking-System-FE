import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../shared/models/account';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private API_URL = environment.API_URL + '/accounts';
  constructor(private http: HttpClient){}

  getAllAccounts(): Observable<Account[]>{
    return this.http.get<Account[]>(this.API_URL)
  }

  getAccountById(id: number): Observable<Account>{
    return this.http.get<Account>(`${this.API_URL}/${id}`);
  }

  getAccountsByUserId(userId: number): Observable<Account[]>{
    return this.http.get<Account[]>(`${this.API_URL}/user/${userId}`);
  }

    activateAccount(id: number): Observable<Account> {
        return this.http.patch<Account>(`${this.API_URL}/${id}/activate`, {});
    }

    deactivateAccount(id: number): Observable<Account> {
        return this.http.patch<Account>(`${this.API_URL}/${id}/deactivate`, {});
    }



}
