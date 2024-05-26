using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IRepository;

public interface IMessageRepository : IRepository<Message>
{
    IEnumerable<Message> GetMessagesByChatRoomGuid(string chatRoomsId);
    IEnumerable<Message> GetMessagesByUserGuid(string userId);
    bool DeleteMessagesByUserGuid(string userGuid);
}