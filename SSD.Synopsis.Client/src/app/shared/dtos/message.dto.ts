export interface MessageDto {
  guid?: string;
  text: string;
  senderGuid: string;
  senderUsername: string;
  chatRoomGuid: string;
  timeSent: Date;
  iv: string;
}
