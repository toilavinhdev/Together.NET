using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace Together.Shared.WebSockets;

public class ConnectionManager
{
    private readonly ConcurrentDictionary<string, List<WebSocket>> _sockets = new();
    
    public ConcurrentDictionary<string, List<WebSocket>> GetAll() => _sockets;

    public IEnumerable<WebSocket>? GetSockets(string id) => _sockets.GetValueOrDefault(id.ToUpper());
    
    public string? GetId(WebSocket socket) => _sockets.FirstOrDefault(x => x.Value.Any(s => s == socket)).Key;
    
    public void AddSocket(string id, WebSocket socket)
    {
        var existed = _sockets.GetValueOrDefault(id);
        if (existed is null)
        {
            _sockets[id] = [socket];
            return;
        }
        existed.Add(socket);
    }
    
    public async Task RemoveSocketAsync(WebSocket socket)
    {
        foreach (var pair in _sockets)
        {
            var removed = pair.Value.Remove(socket);
            
            if (removed)
            {
                await socket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure,
                    "Closed connection by server",
                    CancellationToken.None);
            }

            if (pair.Value.Count == 0) _sockets.TryRemove(pair);
        }
    }
}