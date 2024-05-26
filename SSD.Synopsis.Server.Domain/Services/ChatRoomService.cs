using Microsoft.IdentityModel.Tokens;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Core.Models;

namespace SSD.Synopsis.Server.Domain.Services;

public class ChatRoomService : IChatRoomService
{
    private readonly IChatRoomRepository _repo;
    private readonly IUserRepository _userRepo;

    public ChatRoomService(IChatRoomRepository repo, IUserRepository userRepo)
    {
        _repo = repo;
        _userRepo = userRepo;
    }

    public ChatRoom Add(ChatRoom entity)
    {
        return _repo.Add(entity);
    }

    public ChatRoom Get(string guid)
    {
        return _repo.Get(guid);
    }

    public IEnumerable<ChatRoom> GetAll()
    {
        return _repo.GetAll();
    }

    public ChatRoom Edit(ChatRoom entity)
    {
        return _repo.Edit(entity);
    }

    public ChatRoom Remove(ChatRoom entity)
    {
        return _repo.Remove(entity);
    }

    public ChatRoom CreateChatRoom(string userGuidCreating, string correspondingUsername)
    {
        try
        {
            var userCreating = _userRepo.Get(userGuidCreating);
            var userCorresponding = _userRepo.GetByUsername(correspondingUsername);

            if (userCreating.Guid.IsNullOrEmpty() || userCorresponding.Guid.IsNullOrEmpty()) return null;

            var chatRoom = new ChatRoom
            {
                Guid = Guid.NewGuid().ToString(),
                UserGuid1 = userCreating.Guid,
                Username1 = userCreating.Username,
                PublicKey1 = userCreating.PublicKey!,
                UserGuid2 = userCorresponding.Guid,
                Username2 = userCorresponding.Username,
                PublicKey2 = userCorresponding.PublicKey!
            };

            return _repo.Add(chatRoom);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public IEnumerable<ChatRoom> GetChatRoomsByUserGuid(string userGuid)
    {
        return _repo.GetChatsByUserGuid(userGuid);
    }

    public bool UserHasAccessToChatRoom(string userGuid, string chatRoomGuid)
    {
        var chatRoom = _repo.Get(chatRoomGuid);

        return chatRoom.UserGuid1.Equals(userGuid) || chatRoom.UserGuid2.Equals(userGuid);
    }

    public bool DeleteChatRoomsByUserGuid(string userGuid)
    {
        return _repo.DeleteChatRoomsByUserGuid(userGuid);
    }
}