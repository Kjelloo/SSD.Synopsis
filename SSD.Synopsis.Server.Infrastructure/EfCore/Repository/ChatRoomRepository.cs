using Microsoft.EntityFrameworkCore;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.Models;
using SSD.Synopsis.Server.Infrastructure.EfCore.Context;

namespace SSD.Synopsis.Server.Infrastructure.EfCore.Repository;

public class ChatRoomRepository : IChatRoomRepository
{
    private readonly ChattingDbContext _ctx;

    public ChatRoomRepository(ChattingDbContext context)
    {
        _ctx = context;
    }

    public ChatRoom Add(ChatRoom entity)
    {
        var chatRoomAdded = _ctx.ChatRooms.Add(entity).Entity;
        _ctx.SaveChanges();
        return chatRoomAdded;
    }

    public ChatRoom Get(string id)
    {
        return _ctx.ChatRooms.FirstOrDefault(c => c.Guid.Equals(id)) ?? throw new InvalidOperationException();
    }

    public IEnumerable<ChatRoom> GetAll()
    {
        return _ctx.ChatRooms;
    }

    public ChatRoom Edit(ChatRoom entity)
    {
        _ctx.Entry(entity).State = EntityState.Modified;
        _ctx.SaveChanges();
        return entity;
    }

    public ChatRoom Remove(ChatRoom entity)
    {
        var chatRoomRemove = _ctx.ChatRooms.FirstOrDefault(chatRoom => chatRoom.Guid.Equals(entity.Guid));
        
        if (chatRoomRemove == null)
            throw new InvalidOperationException();
        
        _ctx.ChatRooms.Remove(chatRoomRemove);
        _ctx.SaveChanges();
        return chatRoomRemove;
    }

    public IEnumerable<ChatRoom> GetChatsByUserGuid(string userGuid)
    {
        return _ctx.ChatRooms.Where(c => c.UserGuid1.Equals(userGuid) || c.UserGuid2.Equals(userGuid));
    }
}