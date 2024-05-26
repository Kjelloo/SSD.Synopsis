namespace SSD.Synopsis.Server.WebAPI.Dtos;

public class UserRegisterDto
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }
    public string PublicKey { get; set; }
}