using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;
using SSD.Synopsis.Server.WebAPI.Dtos;

namespace SSD.Synopsis.Server.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuthService _authService;

    public UserController(IUserService userService, IAuthService authService)
    {
        _userService = userService;
        _authService = authService;
    }

    [HttpGet]
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
                Salt = userDto.Salt
            };

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
                Password = userDto.Password,
                Salt = userDto.Salt
            };

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
}