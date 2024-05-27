using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Infrastructure.Security;

public class AuthService : IAuthService
{
    private readonly byte[] _secret;

    public AuthService(byte[] secret)
    {
        _secret = secret;
    }

    public string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Sid, user.Guid),
            new(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            new JwtHeader(new SigningCredentials(
                new SymmetricSecurityKey(_secret),
                SecurityAlgorithms.HmacSha256)),
            new JwtPayload(null, 
                null, 
                claims.ToArray(),
                DateTime.Now, // notBefore
                DateTime.Now.AddMonths(1))); // expires

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(_secret);

        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        }, out var validatedToken);

        return validatedToken != null;
    }
}