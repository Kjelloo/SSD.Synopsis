using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.WebAPI.Dtos;

namespace SSD.Synopsis.Server.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChatRoomController : ControllerBase
{
    private readonly IChatRoomService _chatRoomService;

    public ChatRoomController(IChatRoomService chatRoomService)
    {
        _chatRoomService = chatRoomService;
    }

    [Authorize]
    [HttpGet("{userGuid}")]
    public IActionResult GetChatRooms(string userGuid)
    {
        try
        {
            var encodedToken = HttpContext.GetTokenAsync("access_token").Result!;
            
            if (string.IsNullOrEmpty(encodedToken))
                return Unauthorized();

            var decodedToken = new JwtSecurityToken(encodedToken);
            var guid = decodedToken.Payload.Claims.First(e => e.ToString().Contains("sid")).Value;

            if (userGuid != guid)
                return Unauthorized();

            var chatRooms = _chatRoomService.GetChatRoomsByUserGuid(userGuid);

            return Ok(chatRooms);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPost]
    public IActionResult CreateChatRoom([FromBody] CreateChatRoomDto request)
    {
        try
        {
            var encodedToken = HttpContext.GetTokenAsync("access_token").Result!;
            
            if (string.IsNullOrEmpty(encodedToken))
                return Unauthorized();

            var decodedToken = new JwtSecurityToken(encodedToken);
            var guid = decodedToken.Payload.Claims.First(e => e.ToString().Contains("sid")).Value;

            if (request.UserCreatingGuid != guid)
                return Unauthorized();

            var chatRoom = _chatRoomService.CreateChatRoom(request.UserCreatingGuid, request.UserReceivingUsername);

            return Ok(chatRoom);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}