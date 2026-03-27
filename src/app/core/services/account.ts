import { Injectable } from '@angular/core';
<<<<<<< HEAD
=======
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../shared/models/account';
import { environment } from '../../../environments/environment.development';
>>>>>>> dev

@Injectable({
  providedIn: 'root',
})
<<<<<<< HEAD
export class Account {}
=======
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

  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.API_URL}/me`);
  }

  activateAccount(id: number): Observable<Account> {
      return this.http.patch<Account>(`${this.API_URL}/${id}/activate`, {});
  }

  deactivateAccount(id: number): Observable<Account> {
      return this.http.patch<Account>(`${this.API_URL}/${id}/deactivate`, {});
  }



}
>>>>>>> dev
