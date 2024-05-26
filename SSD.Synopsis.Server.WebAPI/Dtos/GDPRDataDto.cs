using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.WebAPI.Dtos;

public class GDPRDataDto
{
    public User User { get; set; }
    public IEnumerable<Message> Messages { get; set; }
    public IEnumerable<ChatRoom> ChatRooms { get; set; }
}