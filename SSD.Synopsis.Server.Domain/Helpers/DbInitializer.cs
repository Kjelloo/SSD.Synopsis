using SSD.Synopsis.Server.Infrastructure.EfCore.Context;

namespace SSD.Synopsis.Server.Domain.Helpers;

public class DbInitializer : IDbInitialzier<ChattingDbContext>
{
    public void Initialize(ChattingDbContext context)
    { 
        context.Database.EnsureCreated();
    }
}