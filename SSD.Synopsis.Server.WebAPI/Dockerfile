FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SSD.Synopsis.Server.WebAPI/SSD.Synopsis.Server.WebAPI.csproj", "SSD.Synopsis.Server.WebAPI/"]
RUN dotnet restore "SSD.Synopsis.Server.WebAPI/SSD.Synopsis.Server.WebAPI.csproj"
COPY . .
WORKDIR "/src/SSD.Synopsis.Server.WebAPI"
RUN dotnet build "SSD.Synopsis.Server.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "SSD.Synopsis.Server.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SSD.Synopsis.Server.WebAPI.dll"]
