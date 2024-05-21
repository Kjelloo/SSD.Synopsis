﻿using Microsoft.EntityFrameworkCore;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.Models;
using SSD.Synopsis.Server.Infrastructure.EfCore.Context;

namespace SSD.Synopsis.Server.Infrastructure.EfCore.Repository;

public class MessageRepository : IMessageRepository
{
    private readonly ChattingDbContext _ctx;

    public MessageRepository(ChattingDbContext context)
    {
        _ctx = context;
    }

    public Message Add(Message entity)
    {
        var messageAdded = _ctx.Messages.Add(entity).Entity;
        _ctx.SaveChanges();
        return messageAdded;
    }

    public Message Get(string id)
    {
        return _ctx.Messages.FirstOrDefault(m => m.Guid.Equals(id)) ?? throw new InvalidOperationException();
    }

    public IEnumerable<Message> GetAll()
    {
        return _ctx.Messages;
    }

    public Message Edit(Message entity)
    {
        _ctx.Entry(entity).State = EntityState.Modified;
        _ctx.SaveChanges();
        return entity;
    }

    public Message Remove(Message entity)
    {
        var messageRemove = _ctx.Messages.FirstOrDefault(message => message.Guid.Equals(entity.Guid));
        
        if (messageRemove == null)
            throw new InvalidOperationException();
        
        _ctx.Messages.Remove(messageRemove);
        _ctx.SaveChanges();
        return messageRemove;
    }

    public IEnumerable<Message> GetMessagesByChatRoomId(string chatRoomsId)
    {
        return _ctx.Messages.Where(m => m.ChatRoomId.Equals(chatRoomsId));
    }

    public IEnumerable<Message> GetMessagesByUserId(string userId)
    {
        return _ctx.Messages.Where(m => m.Guid.Equals(userId));
    }
}