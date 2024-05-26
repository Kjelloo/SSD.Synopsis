namespace SSD.Synopsis.Server.WebAPI.Dtos;

public class CreateMessageDto
{
    public string Text { get; set; }
    public string SenderGuid { get; set; }
    public string SenderUsername { get; set; }
    public string ChatRoomGuid { get; set; }
    public DateTime TimeSent { get; set; }
    public string iv { get; set; }
}