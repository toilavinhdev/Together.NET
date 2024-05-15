using StackExchange.Redis;
using Together.Shared.Extensions;
using Together.Shared.Services;

namespace Together.Infrastructure.Redis;

public class RedisService(IConnectionMultiplexer connection) : IRedisService
{
    private IDatabase Database(int idx = -1) => connection.GetDatabase(idx);
    
    public async Task<T> GetAsync<T>(string key)
    {
        var value = await Database().StringGetAsync(key);
        return value.ToString().ToObject<T>();
    }

    public async Task<bool> SetAsync<T>(string key, T value)
    {
        return await Database().StringSetAsync(key, value.ToJson());
    }

    public async Task<bool> RemoveAsync(string key)
    {
        return await Database().KeyDeleteAsync(key);
    }
}