using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SSD.Synopsis.Server.Core.IRepository;
using SSD.Synopsis.Server.Core.IService;
using SSD.Synopsis.Server.Domain.Helpers;
using SSD.Synopsis.Server.Domain.Services;
using SSD.Synopsis.Server.Infrastructure.EfCore.Context;
using SSD.Synopsis.Server.Infrastructure.EfCore.Repository;
using SSD.Synopsis.Server.Infrastructure.Security;

var builder = WebApplication.CreateBuilder(args);
var secret = RandomNumberGenerator.GetBytes(32);
// Add services to the container.
builder.Services.AddDbContext<ChattingDbContext>(opt => 
    opt.UseSqlite("Data Source=ChatDb.db"));
builder.Services.AddTransient<IDbInitialzier<ChattingDbContext>, DbInitializer>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();

builder.Services.AddSingleton<IAuthService>(sp => new AuthService(secret));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MyAPI", Version = "v1" });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddSignalR();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dev-cors", builder =>
    {
        builder
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:4200");
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secret)
        }; 
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ChattingDbContext>();
        var dbInit = services.GetService<IDbInitialzier<ChattingDbContext>>();
        dbInit.Initialize(context);
    }
    
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("dev-cors");
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapHub<ChattingHub>("/chat");
app.MapControllers();

app.Run();