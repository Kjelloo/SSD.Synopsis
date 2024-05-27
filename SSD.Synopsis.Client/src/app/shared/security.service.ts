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

  // async generateKeyPair() {
  //   return await window.crypto.subtle.generateKey(
  //     {
  //       name: "ECDH",
  //       namedCurve: "P-384",
  //     },
  //     true,
  //     ["deriveKey"]
  //   );
  // }

  // async deriveSharedKey(remotePublicKey: string) {
  //   let userId = JSON.parse(localStorage.getItem('user')!).guid;
  //
  //   let ownPrivateKey = await this.getPrivateKey(userId);
  //
  //   let remotePublicKeyImported = await window.crypto.subtle.importKey(
  //     "raw",
  //     this.base64ToArrayBuffer(remotePublicKey),
  //     {
  //       name: "ECDH",
  //       namedCurve: "P-384",
  //     },
  //     true,
  //     []
  //   );
  //
  //   let derivedKey = await window.crypto.subtle.deriveKey(
  //     {
  //       name: "ECDH",
  //       public: remotePublicKeyImported,
  //     },
  //     ownPrivateKey,
  //     {
  //       name: "AES-CBC",
  //       length: 256,
  //     },
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  //
  //   let sharedKey = await window.crypto.subtle.exportKey("raw", derivedKey);
  //
  //   return this.arrayBufferToBase64(sharedKey);
  // }

  // async encryptMessage(message: MessageDto, sharedKey: string) {
  //
  //   let IV = this.base64ToArrayBuffer(message.iv);
  //
  //   let key = await crypto.subtle.importKey(
  //     "raw",
  //     this.base64ToArrayBuffer(sharedKey),
  //     "AES-CBC",
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  //
  //   let encryptedText = await window.crypto.subtle.encrypt(
  //     {
  //       name: "AES-CBC",
  //       iv: IV
  //     },
  //     key,
  //     new TextEncoder().encode(message.text)
  //   );
  //
  //   return {
  //     ...message,
  //     text: this.arrayBufferToBase64(encryptedText),
  //   };
  // }

  // async decryptMessages(messages: MessageDto[], sharedKey: string): Promise<MessageDto[]> {
  //   let decryptedMessages: MessageDto[] = [];
  //
  //   const key = await crypto.subtle.importKey(
  //     "raw",
  //     this.base64ToArrayBuffer(sharedKey),
  //     "AES-CBC",
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  //
  //   for (let message of messages) {
  //
  //     let decryptedMessage = await this.decryptMessage(message, key);
  //     decryptedMessages.push(decryptedMessage);
  //   }
  //   return decryptedMessages;
  // }

  // async decryptMessage(message: MessageDto, sharedKey: CryptoKey): Promise<MessageDto> {
  //   let iv = this.base64ToArrayBuffer(message.iv);
  //
  //   let decryptedText = await window.crypto.subtle.decrypt(
  //     {
  //       name: "AES-CBC",
  //       iv: iv
  //     },
  //     sharedKey,
  //     this.base64ToArrayBuffer(message.text)
  //   );
  //
  //   return {
  //     ...message,
  //     text: new TextDecoder().decode(decryptedText)
  //   };
  // }

  // async decryptMessageString(message: MessageDto, sharedKey: string): Promise<MessageDto> {
  //
  //   const key = await crypto.subtle.importKey(
  //     "raw",
  //     this.base64ToArrayBuffer(sharedKey),
  //     "AES-CBC",
  //     true,
  //     ["encrypt", "decrypt"]
  //   );
  //
  //   let iv = this.base64ToArrayBuffer(message.iv);
  //   let decryptedText = await window.crypto.subtle.decrypt(
  //     {
  //       name: "AES-CBC",
  //       iv: iv
  //     },
  //     key,
  //     this.base64ToArrayBuffer(message.text)
  //   );
  //
  //   return {
  //     ...message,
  //     text: new TextDecoder().decode(decryptedText)
  //   };
  // }

  // async getPrivateKey(userGuid: string) {
  //   let jwk = await db.users.get((userGuid)).then((user) => {
  //     return user!.privateKey!;
  //   });
  //
  //   if (!jwk) {
  //     throw new Error("Private key not found");
  //   }
  //
  //   return window.crypto.subtle.importKey(
  //     "jwk",
  //     JSON.parse(jwk!),
  //     {
  //       name: "ECDH",
  //       namedCurve: "P-384",
  //     },
  //     true,
  //     ["deriveKey"]
  //   );
  // }

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
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-512",
      },
      true,
      ["encrypt", "decrypt"],
    );
  }

  async encryptMessage(message: MessageDto, publicKey: string) {
    let keyImported = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(publicKey),
      {
        name: "RSA-OAEP",
        hash: "SHA-512"
      },
      true,
      ["encrypt"]
    );


    let encryptedMessage = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      keyImported,
      new TextEncoder().encode(message.text)
    );

    return {
      ...message,
      text: this.arrayBufferToBase64(encryptedMessage),
    };
  }

  async createMessage(text: string, chatRoomGuid: string, senderGuid: string, senderUsername: string, publicKey: string): Promise<MessageDto> {
    let IV = crypto.getRandomValues(new Uint8Array(16));

    console.log(this.arrayBufferToBase64(IV));

    let message: MessageDto = {
      text: text,
      chatRoomGuid: chatRoomGuid,
      senderGuid: senderGuid,
      senderUsername: senderUsername,
      timeSent: new Date(),
      iv: this.arrayBufferToBase64(IV),
    };

    return await this.encryptMessage(message, publicKey);
  }

  async decryptMessages(messages: MessageDto[], privateKey: string): Promise<MessageDto[]> {
    let decryptedMessages: MessageDto[] = [];

    let keyImported = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(privateKey),
      {
        name: "RSA-OAEP",
        hash: "SHA-512"
      },
      true,
      ["decrypt"]
    );

    for (let message of messages) {

      let decryptedMessage = await this.decryptMessage(message, keyImported);
      decryptedMessages.push(decryptedMessage);
    }
    return decryptedMessages;
  }

  async decryptMessage(message: MessageDto, privateKey: CryptoKey): Promise<MessageDto> {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      this.base64ToArrayBuffer(message.text)
    );

    return {
      ...message,
      text: new TextDecoder().decode(decrypted)
    };
  }

  async decryptMessageString(message: MessageDto, privateKey: string): Promise<MessageDto> {
    let importedKey = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(privateKey),
      {
        name: "RSA-OAEP",
        hash: "SHA-512",
        length: 4096
      },
      true,
      ["decrypt"]
    );

    let decryptedText = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
        length: 4096,
      },
      importedKey,
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
        name: "RSA-OAEP",
        hash: "SHA-512"
      },
      true,
      ["encrypt"]
    );
  }
}
