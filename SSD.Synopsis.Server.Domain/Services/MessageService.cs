using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Domain.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _repo;

    public MessageService(IMessageRepository repo)
    {
        _repo = repo;
    }

    public Message Add(Message entity)
    {
        return _repo.Add(entity);
    }

    public Message Get(string id)
    {
        return _repo.Get(id);
    }

    public IEnumerable<Message> GetAll()
    {
        return _repo.GetAll();
    }

    public Message Edit(Message entity)
    {
        return _repo.Edit(entity);
    }

    public Message Remove(Message entity)
    {
        return _repo.Remove(entity);
    }

    public IEnumerable<Message> GetMessagesByChatRoom(string chatRoomId)
    {
        return _repo.GetMessagesByChatRoomId(chatRoomId);
    }

    public IEnumerable<Message> GetMessagesByUserId(string userId)
    {
        return _repo.GetMessagesByUserId(userId);
    }
}