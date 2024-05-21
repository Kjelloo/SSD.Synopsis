import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../shared/dtos/user.dto";
import {HttpClient} from "@angular/common/http";
import {RegisterUserDto} from "../shared/dtos/registeruser.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'User/Login', user);
  }

  register(user: RegisterUserDto) {
    return this.http.post(environment.apiUrl + 'User/Register', user);
  }

  validateToken(token: string) {
    return this.http.post<boolean>(environment.apiUrl + 'User/ValidateToken/' + token, null);
  }

  authenticated() {
    const user = JSON.parse(localStorage.getItem('user')!) as User;

    if (user == undefined || user.token == undefined || user.token == '') {
      return of(false);
    }

    return this.validateToken(user.token);
  }
}
