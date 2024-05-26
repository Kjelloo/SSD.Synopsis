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
public class MessageController : ControllerBase
{
    private readonly IChatRoomService _chatRoomService;
    private readonly IMessageService _messageService;

    public MessageController(IMessageService messageService, IChatRoomService chatRoomService)
    {
        _chatRoomService = chatRoomService;
        _messageService = messageService;
    }

    [Authorize]
    [HttpPost]
    public IActionResult SendMessage([FromBody] CreateMessageDto messageDto)
    {
        try
        {
            var encodedToken = HttpContext.GetTokenAsync("access_token").Result!;
            
            if (string.IsNullOrEmpty(encodedToken))
                return Unauthorized();
            
            var decodedToken = new JwtSecurityToken(encodedToken);
            var guid = decodedToken.Payload.Claims.First(e => e.ToString().Contains("sid")).Value;

            if (messageDto.SenderGuid != guid)
                return Unauthorized();

            var message = new Message
            {
                Text = messageDto.Text,
                SenderGuid = messageDto.SenderGuid,
                SenderUsername = messageDto.SenderUsername,
                ChatRoomId = messageDto.ChatRoomGuid,
                TimeSent = messageDto.TimeSent,
                iv = messageDto.iv
            };

            var messageAdded = _messageService.Add(message);

            return Ok(messageAdded);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [Authorize]
    [HttpGet("{chatRoomId}")]
    public IActionResult GetMessages(string chatRoomId)
    {
        try
        {
            var encodedToken = HttpContext.GetTokenAsync("access_token").Result!;
            
            if (string.IsNullOrEmpty(encodedToken))
                return Unauthorized();
            
            var decodedToken = new JwtSecurityToken(encodedToken);
            var guid = decodedToken.Payload.Claims.First(e => e.ToString().Contains("sid")).Value;

            if (!_chatRoomService.UserHasAccessToChatRoom(guid, chatRoomId))
                return Unauthorized();

            var messages = _messageService.GetMessagesByChatRoom(chatRoomId);

            return Ok(messages);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}