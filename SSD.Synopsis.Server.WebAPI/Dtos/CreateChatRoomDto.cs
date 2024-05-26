namespace SSD.Synopsis.Server.WebAPI.Dtos;

public class CreateChatRoomDto
{
    public string UserCreatingGuid { get; set; }
    public string UserReceivingUsername { get; set; }
}