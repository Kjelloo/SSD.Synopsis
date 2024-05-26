import {Injectable} from '@angular/core';
import {AuthUserDto} from "./dtos/authuser.dto";
import {RegisterUserDto} from "./dtos/registeruser.dto";
import {environment} from "../../environments/environment";
import {db} from "../chat/db/db";
import {MessageDto} from "./dtos/message.dto";

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
      salt: decodedSalt,
      publicKey: undefined,
    };
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

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    let binaryString = atob(base64);
    let bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async generateKeyPair() {
    return await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      true,
      ["deriveKey"]
    );
  }

  async deriveSharedKey(remotePublicKey: string) {
    let userId = JSON.parse(localStorage.getItem('user')!).guid;

    let ownPrivateKey = await this.getPrivateKey(userId);

    let remotePublicKeyImported = await window.crypto.subtle.importKey(
      "raw",
      this.base64ToArrayBuffer(remotePublicKey),
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      true,
      []
    );

    let derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: remotePublicKeyImported,
      },
      ownPrivateKey,
      {
        name: "AES-CBC",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    let sharedKey = await window.crypto.subtle.exportKey("raw", derivedKey);

    return this.arrayBufferToBase64(sharedKey);
  }

  async createMessage(text: string, chatRoomGuid: string, senderGuid: string, senderUsername: string, sharedKey: string): Promise<MessageDto> {
    let IV = crypto.getRandomValues(new Uint8Array(16));

    let message: MessageDto = {
      text: text,
      chatRoomGuid: chatRoomGuid,
      senderGuid: senderGuid,
      senderUsername: senderUsername,
      timeSent: new Date(),
      iv: this.arrayBufferToBase64(IV),
    };

    return await this.encryptMessage(message, sharedKey);
  }

  async encryptMessage(message: MessageDto, sharedKey: string) {

    let IV = this.base64ToArrayBuffer(message.iv);

    let key = await crypto.subtle.importKey(
      "raw",
      this.base64ToArrayBuffer(sharedKey),
      "AES-CBC",
      true,
      ["encrypt", "decrypt"]
    );

    let encryptedText = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: IV
      },
      key,
      new TextEncoder().encode(message.text)
    );

    return {
      ...message,
      text: this.arrayBufferToBase64(encryptedText),
    };
  }

  async decryptMessages(messages: MessageDto[], sharedKey: string): Promise<MessageDto[]> {
    let decryptedMessages: MessageDto[] = [];

    const key = await crypto.subtle.importKey(
      "raw",
      this.base64ToArrayBuffer(sharedKey),
      "AES-CBC",
      true,
      ["encrypt", "decrypt"]
    );

    for (let message of messages) {

      let decryptedMessage = await this.decryptMessage(message, key);
      decryptedMessages.push(decryptedMessage);
    }
    return decryptedMessages;
  }

  async decryptMessage(message: MessageDto, sharedKey: CryptoKey): Promise<MessageDto> {
    let iv = this.base64ToArrayBuffer(message.iv);

    let decryptedText = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      sharedKey,
      this.base64ToArrayBuffer(message.text)
    );

    return {
      ...message,
      text: new TextDecoder().decode(decryptedText)
    };
  }

  async decryptMessageString(message: MessageDto, sharedKey: string): Promise<MessageDto> {

    const key = await crypto.subtle.importKey(
      "raw",
      this.base64ToArrayBuffer(sharedKey),
      "AES-CBC",
      true,
      ["encrypt", "decrypt"]
    );

    let iv = this.base64ToArrayBuffer(message.iv);
    let decryptedText = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      key,
      this.base64ToArrayBuffer(message.text)
    );

    return {
      ...message,
      text: new TextDecoder().decode(decryptedText)
    };
  }

  async getPrivateKey(userGuid: string) {
    let jwk = await db.users.get((userGuid)).then((user) => {
      return user!.privateKey!;
    });

    if (!jwk) {
      throw new Error("Private key not found");
    }

    return window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(jwk!),
      {
        name: "ECDH",
        namedCurve: "P-384",
      },
      true,
      ["deriveKey"]
    );
  }
}
