import {User} from "../shared/dtos/user.dto";
import {MessageDto} from "../shared/dtos/message.dto";
import {ChatRoomDto} from "../chat/db/db";

export interface GDPRDataDto {
  user: User;
  messages: MessageDto[];
  chatRooms: ChatRoomDto[];
}
