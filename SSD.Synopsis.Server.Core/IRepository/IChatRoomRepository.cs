using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IRepository;

public interface IChatRoomRepository : IRepository<ChatRoom>
{
    IEnumerable<ChatRoom> GetChatsByUserGuid(string userGuid);
    bool DeleteChatRoomsByUserGuid(string userGuid);
}