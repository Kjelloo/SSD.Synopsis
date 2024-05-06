using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Core.IService;

public interface IAuthService
{
    string GenerateToken(User user);
    bool ValidateToken(string token);
}