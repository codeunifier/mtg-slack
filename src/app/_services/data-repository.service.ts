import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserRegister } from '../_models/user-register';

@Injectable({
  providedIn: 'root'
})
export class DataRepositoryService {

  constructor(private http: HttpClient) { }

  validateLogin(email: string, password: string): Observable<any> {
    return this.http.post('mongo/login', {email: email, password: password}).pipe(map((resp: any) => resp));
  }

  registerUser(user: UserRegister): Observable<boolean> {
    return this.http.post('mongo/register', user).pipe(map((resp: boolean) => resp));
  }
}
