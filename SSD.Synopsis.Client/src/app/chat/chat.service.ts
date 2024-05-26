import {Injectable} from '@angular/core';
import {ChatRoomDto} from "./db/db";
import {HttpClient} from "@angular/common/http";
import {SecurityService} from "../shared/security.service";
import {environment} from "../../environments/environment";
import {CreateChatRoomDto} from "../shared/dtos/createchatroom.dto";
import {MessageDto} from "../shared/dtos/message.dto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private securityService: SecurityService) {}

  createMessage(message: MessageDto) {
    return this.http.post<MessageDto>(environment.apiUrl + 'Message', message);
  }

  getMessages(chatRoomGuid: string) {
    return this.http.get<MessageDto[]>(environment.apiUrl + `Message/${chatRoomGuid}`);
  }

  createChatRoom(createChatRoom: CreateChatRoomDto)
  {
    return this.http.post<ChatRoomDto>(environment.apiUrl + 'ChatRoom', createChatRoom);
  }

  getChatRooms(userGuid: string) {
    return this.http.get<ChatRoomDto[]>(environment.apiUrl + `ChatRoom/${userGuid}`);
  }
}
