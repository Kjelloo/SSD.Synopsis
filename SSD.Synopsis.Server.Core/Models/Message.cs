namespace SSD.Synopsis.Server.Core.Models;

public class Message
{
    public string Guid { get; set; }
    public string Text { get; set; }
    public string SenderGuid { get; set; }
    public string ReceiverGuid { get; set; }
}