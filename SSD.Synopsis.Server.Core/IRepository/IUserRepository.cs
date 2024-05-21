using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IRepository;

public interface IUserRepository : IRepository<User>
{
    User GetByUsername(string username);
}