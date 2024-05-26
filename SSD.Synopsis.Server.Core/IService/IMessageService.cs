using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IService;

public interface IMessageService : IService<Message>
{
    IEnumerable<Message> GetMessagesByChatRoom(string chatRoomId);
    IEnumerable<Message> GetMessagesByUserId(string userId);
    bool DeleteMessagesByUserGuid(string userGuid);
}