using Microsoft.EntityFrameworkCore;
using SSD.Synopsis.Server.Core.Models;
using SSD.Synopsis.Server.Infrastructure.EfCore.Repository;

namespace SSD.Synopsis.Server.Infrastructure.EfCore.Context;

public class ChattingDbContext : DbContext
{ 
    public DbSet<Message> Messages { get; set; } 
    public DbSet<User> Users { get; set; }
    public DbSet<ChatRoom> ChatRooms { get; set; }
    public ChattingDbContext(DbContextOptions<ChattingDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChatRoom>()
            .HasKey(cr => cr.Guid);
        modelBuilder.Entity<Message>()
            .HasKey(m => m.Guid);
        modelBuilder.Entity<User>().HasKey(u => u.Guid);
    }
}