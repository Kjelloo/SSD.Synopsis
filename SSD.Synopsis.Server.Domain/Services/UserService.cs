using System.Security.Cryptography;
using System.Text;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Domain.Services;

public class UserService : IUserService
{
    private readonly IAuthService _authService;
    private readonly IUserRepository _repo;
    private readonly SHA256 _sha256;

    public UserService(IUserRepository repo, IAuthService authService)
    {
        _sha256 = SHA256.Create();
        _repo = repo;
        _authService = authService;
    }

    public User Add(User entity)
    {
        return _repo.Add(entity);
    }

    public User Get(string guid)
    {
        return _repo.Get(guid);
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
        
        var passwordBytes = _sha256.ComputeHash(Convert.FromBase64String(user.Password));
        
        user.Password = Convert.ToBase64String(passwordBytes);

        if (!user.Password.Equals(userDb.Password))
            throw new InvalidOperationException("Invalid login");
        
        var token = new JWToken
        {
            Guid = userDb.Guid,
            Username = userDb.Username,
            Token = _authService.GenerateToken(userDb)
        };

        return token;
    }

    public User Register(User user)
    {
        var userDb = _repo.GetByUsername(user.Username);

        if (userDb != null)
            throw new InvalidOperationException("Username already taken");

        if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password) ||
            string.IsNullOrEmpty(user.Salt))
            throw new InvalidOperationException("Invalid registration");

        var passwordBytes = _sha256.ComputeHash(Convert.FromBase64String(user.Password));
        
        user.Password = Convert.ToBase64String(passwordBytes);
        
        user.Guid = Guid.NewGuid().ToString();

        return _repo.Add(user);
    }

    public string GetSalt(string username)
    {
        var userDb = _repo.GetByUsername(username);

        if (userDb == null)
            throw new InvalidOperationException("Invalid user");

        return userDb.Salt;
    }
}