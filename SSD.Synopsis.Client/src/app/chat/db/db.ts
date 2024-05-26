import Dexie, { Table } from 'dexie';
import {User} from "../../shared/dtos/user.dto";

export interface ChatRoomDto {
  guid?: string;
  userGuid1?: string,
  username1?: string,
  publicKey1?: string
  userGuid2?: string,
  username2?: string,
  publicKey2?: string
  sharedKey?: string;
}

export class AppDB extends Dexie {
  chatRooms!: Table<ChatRoomDto, string>;
  users!: Table<User, string>;

  constructor() {
    super('ChatDatabaseQuery');

    this.version(1).stores({
      chatRooms: 'guid, userGuid1, username1, publicKey1, userGuid2, username2, publicKey2, sharedKey',
      users: 'guid, username, token, publicKey, privateKey',
    });
  }
}

export const db = new AppDB();
