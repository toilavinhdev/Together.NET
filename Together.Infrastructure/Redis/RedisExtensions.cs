using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using Together.Shared.Services;

namespace Together.Infrastructure.Redis;

public static class RedisExtensions
{
    public static IServiceCollection AddRedis(this IServiceCollection services, string connectionString)
    {
        services.AddSingleton<IConnectionMultiplexer>(_ =>
        {
            var lazyConnection = new Lazy<ConnectionMultiplexer>(
                () => ConnectionMultiplexer.Connect(connectionString));
            return lazyConnection.Value;
        });
        
        services.AddSingleton<IRedisService, RedisService>();
        
        return services;
    }
}