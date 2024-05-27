import {Component, OnInit} from '@angular/core';
import {ChatService} from "./chat.service";
import {SecurityService} from "../shared/security.service";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ChatRoomDto, db} from "./db/db";
import {liveQuery} from "dexie";
import {BehaviorSubject, from, map, Observable, switchMap} from "rxjs";
import {User} from "../shared/dtos/user.dto";
import {CreateChatRoomDto} from "../shared/dtos/createchatroom.dto";
import {MessageDto} from "../shared/dtos/message.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  chatRooms$: any;

  selectedChatRoom: ChatRoomDto | undefined;
  messages$: Observable<MessageDto[]> | undefined;
  newMessage = '';
  newChatRoomName = '';
  user = JSON.parse(localStorage.getItem('user')!) as User;
  currentUser: User | undefined;

  constructor(private chatService: ChatService, private securityService: SecurityService, private router: Router) {}

  ngOnInit(): void {
    db.users.get(this.user.guid!).then(user => this.currentUser = user!);
    this.syncChatRooms().then(() => {
      this.chatRooms$ = liveQuery(() => db.chatRooms.toArray());
    });
  }

  async syncChatRooms() {
    this.chatService.getChatRooms(this.user.guid!).subscribe({
      next: async (chatRooms: ChatRoomDto[]) => {
        if (chatRooms.length === 0) {
          console.log('No chat rooms to sync.');
          return;
        }

        const localChatRooms: ChatRoomDto[] = await db.chatRooms.toArray();

        const newChatRooms = chatRooms.filter(chatRoom =>
          !localChatRooms.some(localChatRoom => localChatRoom.guid === chatRoom.guid)
        );

        if (newChatRooms.length > 0) {
          let publicKeyLoggedIn = await db.users.get(this.user.guid!).then(user => user!.publicKey);

          for (let chatRoom of newChatRooms) {
            let publicKey = chatRoom.publicKey1 === publicKeyLoggedIn! ? chatRoom.publicKey2 : chatRoom.publicKey1;
            // todo: decrypt with private key
            // chatRoom.sharedKey = await this.securityService.deriveSharedKey(publicKey!);
          }

          await db.chatRooms.bulkAdd(newChatRooms);
          console.log('New chat rooms added to the local database:', newChatRooms);
        } else {
          console.log('No new chat rooms to add.');
        }
      },
      error: (error) => {
        console.error('Error fetching chat rooms:', error);
      }
    });
  }

  async sendMessage(message: string): Promise<void> {
    let publicKey = this.selectedChatRoom?.publicKey1 === this.currentUser?.publicKey ? this.selectedChatRoom?.publicKey2 : this.selectedChatRoom?.publicKey1;

    let encryptedMessage = await this.securityService.createMessage(message, this.selectedChatRoom!.guid!, this.user.guid!, this.user.username!, publicKey!);

    this.chatService.createMessage(encryptedMessage).subscribe({
      next: async (message) => {
        let decryptedMessage = await this.securityService.decryptMessageString(message, this.currentUser?.privateKey!);
        this.messages$!.subscribe(messages => {
          messages.push(decryptedMessage);
        });
        this.newMessage = '';
      },
      error: (error) => {
        console.error(error);
        alert('Failed to send message');
      }
    });
  }

  async createChatRoom() {
    let createChatRoom: CreateChatRoomDto = {
      userCreatingGuid: this.user.guid!,
      userReceivingUsername: this.newChatRoomName
    };

    let chatRoom = this.chatService.createChatRoom(createChatRoom)

    chatRoom.subscribe({
      next: async (chatRoom) => {
        db.chatRooms.add(chatRoom);
        this.selectChatRoom(chatRoom);
      },
      error: (error) => {
        console.error(error);
        alert('Failed to create chat room');
      }
    });
  }

  protected selectChatRoom(chatRoom: ChatRoomDto) {
    this.selectedChatRoom = chatRoom;
    this.messages$ = this.chatService.getMessages(chatRoom.guid!).pipe(
      switchMap(messages => from(this.securityService.decryptMessages(messages, this.currentUser?.privateKey!))
    ));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
