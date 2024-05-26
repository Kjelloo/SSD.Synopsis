using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;
using SSD.Synopsis.Server.WebAPI.Dtos;

namespace SSD.Synopsis.Server.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMessageService _messageService;
    private readonly IChatRoomService _chatRoomService;
    private readonly IUserService _userService;

    public UserController(
        IUserService userService, 
        IAuthService authService, 
        IMessageService messageService,
        IChatRoomService chatRoomService)
    {
        _userService = userService;
        _authService = authService;
        _messageService = messageService;
        _chatRoomService = chatRoomService;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        try
        {
            return Ok(_userService.GetAll());
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpPost("Register")]
    public IActionResult Register([FromBody] UserRegisterDto userDto)
    {
        try
        {
            // convert dto to model
            var user = new User
            {
                Username = userDto.Username,
                Password = userDto.Password,
                Salt = userDto.Salt,
                PublicKey = userDto.PublicKey
            };

            // password should be run through pbkdf2 for another x amount of iterations
            // before storing to avoid having the real kdf stored in the database
            return Ok(_userService.Register(user));
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] UserLoginDto userDto)
    {
        try
        {
            // convert dto to model
            var user = new User
            {
                Username = userDto.Username,
                Password = userDto.Password
            };

            // password should be run through pbkdf2 for another x amount of iterations
            return Ok(_userService.Login(user));
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpPost("ValidateToken/{token}")]
    public ActionResult<bool> ValidateToken(string token)
    {
        try
        {
            var validated = _authService.ValidateToken(token);

            return Ok(validated);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("Salt/{username}")]
    public ActionResult<string> Prepare(string username)
    {
        try
        {
            var salt = _userService.GetSalt(username);

            return Ok(salt);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [Authorize]
    [HttpGet("GDPR/{userId}")]
    public IActionResult GetUserData(string userId)
    {
        try
        {
            var encodedToken = HttpContext.GetTokenAsync("access_token").Result!;
            var decodedToken = new JwtSecurityToken(encodedToken);
            var guid = decodedToken.Payload.Claims.First(e => e.ToString().Contains("sid")).Value;

            if (guid != userId)
                return Unauthorized();
            
            var user = _userService.Get(userId);
            var messages = _messageService.GetMessagesByUserId(userId).ToArray();
            var chatRooms = _chatRoomService.GetChatRoomsByUserGuid(userId).ToArray();
            
            var data = new GDPRDataDto
            {
                User = user,
                Messages = messages,
                ChatRooms = chatRooms
            };
            
            Console.WriteLine("______________________");
            Console.WriteLine(messages.Length);
            
            return Ok(data);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [Authorize]
    [HttpDelete("{userId}")]
    public IActionResult DeleteAllUserData(string userId)
    {
        try
        {
            var encodedToken = HttpContext.GetTokenAsync("access_token").Result!;
            
            if (string.IsNullOrEmpty(encodedToken))
                return Unauthorized();
            
            var decodedToken = new JwtSecurityToken(encodedToken);
            var guid = decodedToken.Payload.Claims.First(e => e.ToString().Contains("sid")).Value;

            if (guid != userId)
                return Unauthorized();
            
            var user = _userService.Get(userId);
            _userService.Remove(user);
            _messageService.DeleteMessagesByUserGuid(userId);
            _chatRoomService.DeleteChatRoomsByUserGuid(userId);
            
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}