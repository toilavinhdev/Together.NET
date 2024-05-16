FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Together.API/Together.API.csproj", "Together.API/"]
COPY ["Together.Shared/Together.Shared.csproj", "Together.Shared/"]
COPY ["Together.Domain/Together.Domain.csproj", "Together.Domain/"]
COPY ["Together.Application/Together.Application.csproj", "Together.Application/"]
COPY ["Together.Persistence/Together.Persistence.csproj", "Together.Persistence/"]
COPY ["Together.Infrastructure/Together.Infrastructure.csproj", "Together.Infrastructure/"]
RUN dotnet restore "Together.API/Together.API.csproj"
COPY . .
WORKDIR "/src/Together.API"
RUN dotnet build "Together.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Together.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Together.API.dll"]
