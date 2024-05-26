import {Component, OnInit} from '@angular/core';
import {User} from "../shared/dtos/user.dto";
import {MessageDto} from "../shared/dtos/message.dto";
import {ChatRoomDto, db} from "../chat/db/db";
import {UserinfoService} from "./userinfo.service";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-userinfo',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgClass,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    NgbAccordionItem
  ],
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.css'
})
export class UserinfoComponent implements OnInit {
  constructor(private userInfoService: UserinfoService) { }

  user?: User;
  messages?: MessageDto[];
  chatRooms?: ChatRoomDto[];

  currentUser = JSON.parse(localStorage.getItem('user')!) as User;

  ngOnInit(): void {
    this.userInfoService.getUserInfo(this.currentUser.guid!).subscribe(userInfo => {
      this.user = userInfo.user;
      this.messages = userInfo.messages;
      this.chatRooms = userInfo.chatRooms;
    });
  }

  deleteAllUserData() {
    this.userInfoService.deleteAllUserData(this.currentUser.guid!).subscribe({
      next: () => {
        this.user = undefined;
        this.messages = undefined;
        this.chatRooms = undefined;
        db.users.delete(this.currentUser.guid!);
        db.chatRooms.where('userGuid1').equals(this.currentUser.guid!).delete();
        db.chatRooms.where('userGuid2').equals(this.currentUser.guid!).delete();
        localStorage.clear();
      },
      error: error => {
        alert('Error deleting user data. Please try again later.')
        console.error('Error deleting user data:', error);
      }
    });
  }
}
