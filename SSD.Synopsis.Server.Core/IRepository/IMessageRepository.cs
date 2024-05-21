using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IRepository;

public interface IMessageRepository : IRepository<Message>
{
    IEnumerable<Message> GetMessagesByChatRoomId(string chatRoomsId);
    IEnumerable<Message> GetMessagesByUserId(string userId);
}