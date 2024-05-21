using Microsoft.Win32.SafeHandles;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Domain.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly IAuthService _authService;

    public UserService(IUserRepository repo, IAuthService authService)
    {
        _repo = repo;
        _authService = authService;
    }

    public User Add(User entity)
    {
        return _repo.Add(entity);
    }

    public User Get(string id)
    {
        return _repo.Get(id);
    }

    public IEnumerable<User> GetAll()
    {
        return _repo.GetAll();
    }

    public User Edit(User entity)
    {
        return _repo.Edit(entity);
    }

    public User Remove(User entity)
    {
        return _repo.Remove(entity);
    }

    public User GetByUsername(string username)
    {
        return _repo.GetByUsername(username);
    }

    public JWToken Login(User user)
    {
        var userDb = _repo.GetByUsername(user.Username);

        if (userDb == null)
            throw new InvalidOperationException("Invalid login");

        if (!(user.Password+userDb.Salt).Equals(userDb.Password))
            throw new InvalidOperationException("Invalid login");

        var token = new JWToken
        {
            UserGuid = userDb.Guid,
            Username = userDb.Username,
            Token = _authService.GenerateToken(userDb)
        };

        return token;
    }

    public User Register(User user)
    {
        if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Salt))
            throw new InvalidOperationException("Invalid registration");
        
        user.Guid = Guid.NewGuid().ToString();
        
        return _repo.Add(user);
    }
}