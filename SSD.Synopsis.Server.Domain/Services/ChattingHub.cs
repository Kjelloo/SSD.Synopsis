using Microsoft.AspNetCore.SignalR;

namespace SSD.Synopsis.Server.Domain.Services;

public class ChattingHub : Hub {
    public override Task OnConnectedAsync()
    {
        Console.WriteLine("SignalR Connected");
        return base.OnConnectedAsync();
    }
    
    public async Task ReceiveMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", "message received");
    }
    
    public async Task SendMessage(string user, string message)
    {
        Console.WriteLine("Message Received: " + message + " from " + user);
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}