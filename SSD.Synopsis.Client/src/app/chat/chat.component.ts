import {Component, OnInit} from '@angular/core';
import {ChatService} from "./chat.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  receivedMessages: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startConnection().subscribe(() => {
      this.chatService.receiveMessage().subscribe((message) => {
        this.receivedMessages.push(message);
      });
    });
  }

  sendMessage(message: string): void {
    this.chatService.sendMessage(message);
  }

}
