using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IService;

public interface IUserService : IService<User>
{
    User GetByUsername(string username);
    JWToken Login(User user);
    User Register(User user);
}