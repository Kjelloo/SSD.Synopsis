using Microsoft.EntityFrameworkCore;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.Models;
using SSD.Synopsis.Server.Infrastructure.EfCore.Context;

namespace SSD.Synopsis.Server.Infrastructure.EfCore.Repository;

public class UserRepository : IUserRepository
{
    private readonly ChattingDbContext _ctx;

    public UserRepository(ChattingDbContext context)
    {
        _ctx = context;
    }

    public User Add(User entity)
    {
        var userAdded = _ctx.Users.Add(entity).Entity;
        _ctx.SaveChanges();
        return userAdded;
    }

    public User Get(string guid)
    {
        return _ctx.Users.FirstOrDefault(u => u.Guid.Equals(guid)) ?? throw new InvalidOperationException();
    }

    public IEnumerable<User> GetAll()
    {
        return _ctx.Users;
    }

    public User Edit(User entity)
    {
        _ctx.Entry(entity).State = EntityState.Modified;
        _ctx.SaveChanges();
        return entity;
    }

    public User Remove(User entity)
    {
        var userRemove = _ctx.Users.FirstOrDefault(user => user.Guid.Equals(entity.Guid));

        if (userRemove == null)
            throw new InvalidOperationException();

        _ctx.Users.Remove(userRemove);
        _ctx.SaveChanges();
        return userRemove;
    }

    public User GetByUsername(string username)
    {
        username = username.ToLower();
        return _ctx.Users.FirstOrDefault(user => user.Username.Equals(username));
    }
}