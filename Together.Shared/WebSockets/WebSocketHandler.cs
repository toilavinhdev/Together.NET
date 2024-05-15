using System.Net.WebSockets;
using System.Text;

namespace Together.Shared.WebSockets;

public abstract class WebSocketHandler(ConnectionManager connectionManager)
{
    public ConnectionManager ConnectionManager { get; set; } = connectionManager;
    
    public abstract Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer);

    public virtual Task OnConnected(string id, WebSocket socket)
    {
        ConnectionManager.AddSocket(NormalizeId(id), socket);
        return Task.CompletedTask;
    }

    public virtual async Task OnDisconnected(WebSocket socket)
    {
        await ConnectionManager.RemoveSocketAsync(socket);
    }
    
    private static async Task SendMessageAsync(WebSocket socket, string message)
    {
        if (socket.State != WebSocketState.Open)
            return;

        await socket.SendAsync(
            buffer: new ArraySegment<byte>(
                array: Encoding.UTF8.GetBytes(message),
                offset: 0,
                count: message.Length),
            messageType: WebSocketMessageType.Text,
            endOfMessage: true,
            cancellationToken: CancellationToken.None);
    }
    
    public async Task SendMessageAsync(string socketId, string message)
    {
        var sockets = ConnectionManager.GetSockets(NormalizeId(socketId));
        if (sockets is null) return;

        foreach (var socket in sockets)
        {
            await SendMessageAsync(socket, message);
        }
    }
    
    public async Task SendMessageToAllAsync(string message)
    {
        foreach (var pair in ConnectionManager.GetAll())
        {
            foreach (var socket in pair.Value.Where(socket => socket.State == WebSocketState.Open))
            {
                await SendMessageAsync(socket, message);
            }
        }
    }

    private static string NormalizeId(string id) => id.ToLower();
}