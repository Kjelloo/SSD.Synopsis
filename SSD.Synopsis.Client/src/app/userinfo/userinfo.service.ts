import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {GDPRDataDto} from "./gdprdata.dto";

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(private httpClient: HttpClient) { }

  getUserInfo(guid: string) {
    return this.httpClient.get<GDPRDataDto>(environment.apiUrl + `User/GDPR/${guid}`);
  }

  deleteAllUserData(guid: string) {
    return this.httpClient.delete(environment.apiUrl + `User/${guid}`);
  }
}
