namespace SSD.Synopsis.Server.WebAPI.Dtos;

public class UserLoginDto
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }
}