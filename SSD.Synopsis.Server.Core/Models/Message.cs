namespace SSD.Synopsis.Server.Core.Models;

public class Message
{
    public string Guid { get; set; }
    public string Text { get; set; }
    public string SenderGuid { get; set; }
    public string SenderUsername { get; set; }
    public string ChatRoomId { get; set; }
    public DateTime TimeSent { get; set; }
    public string iv { get; set; }
}