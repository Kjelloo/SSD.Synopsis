import { Injectable } from '@angular/core';
import {AuthUserDto} from "./dtos/authuser.dto";
import {RegisterUserDto} from "./dtos/registeruser.dto";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  async createUser(userLogin: AuthUserDto): Promise<RegisterUserDto> {
    let salt = crypto.getRandomValues(new Uint8Array(16));

    let key = await this.deriveKey(userLogin.password, salt, environment.passwordIter);

    let exportKey = await crypto.subtle.exportKey("raw", key);

    let decoder = new TextDecoder();

    return {
      username: userLogin.username,
      password: decoder.decode(exportKey),
      salt: decoder.decode(salt)
    };
  }


  async deriveKey(password: string, salt: ArrayBuffer, iter: number): Promise<CryptoKey> {
    let key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: iter,
        hash: "SHA-256"
      },
      key,
      {name: "AES-CBC", length: 256},
      true,
      ["encrypt", "decrypt"]
    );
  }
}
