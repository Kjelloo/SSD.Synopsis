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

    let decodedKey = this.arrayBufferToBase64(exportKey);
    let decodedSalt = this.arrayBufferToBase64(salt);

    return {
      username: userLogin.username,
      password: decodedKey,
      salt: decodedSalt
    };
  }

  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64: string) {
    let binaryString = atob(base64);
    let bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async deriveKey(password: string, salt: ArrayBuffer, iter: number): Promise<CryptoKey> {
    let key = await crypto.subtle.importKey("raw", this.base64ToArrayBuffer(password), "PBKDF2", false, ["deriveKey"]);
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
