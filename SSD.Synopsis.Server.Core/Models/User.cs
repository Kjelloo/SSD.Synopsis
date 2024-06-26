﻿namespace SSD.Synopsis.Server.Core.Models;

public class User
{
    public string Guid { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }

    public string? PublicKey { get; set; }
}