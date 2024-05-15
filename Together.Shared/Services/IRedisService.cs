namespace Together.Shared.Services;

public interface IRedisService
{
    Task<T> GetAsync<T>(string key);
    
    Task<bool> SetAsync<T>(string key, T value);

    Task<bool> RemoveAsync(string key);
}