using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IService;

public interface IChatRoomService : IService<ChatRoom>
{
    ChatRoom CreateChatRoom(string userGuidCreating, string correspondingUsername);
    IEnumerable<ChatRoom> GetChatRoomsByUserGuid(string userGuid);
    bool UserHasAccessToChatRoom(string userGuid, string chatRoomGuid);
    bool DeleteChatRoomsByUserGuid(string userGuid);
}