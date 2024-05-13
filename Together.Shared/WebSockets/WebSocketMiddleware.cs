using System.Net.WebSockets;
using Microsoft.AspNetCore.Http;

namespace Together.Shared.WebSockets;

public class WebSocketMiddleware(RequestDelegate next, WebSocketHandler webSocketHandler)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.WebSockets.IsWebSocketRequest)
        {
            await next(context);
            return;
        }
        
        var id = context.Request.Query["id"].ToString();
        if (string.IsNullOrEmpty(id)) id = Guid.NewGuid().ToString();

        var ws = await context.WebSockets.AcceptWebSocketAsync();
        await webSocketHandler.OnConnected(id, ws);
        
        await HandleReceiveMessageAsync(ws, Handle);
        return;
        
        async void Handle(WebSocketReceiveResult result, byte[] buffer)
        {
            switch (result.MessageType)
            {
                case WebSocketMessageType.Text:
                    await webSocketHandler.ReceiveAsync(ws, result, buffer);
                    break;
                case WebSocketMessageType.Close:
                    await webSocketHandler.OnDisconnected(ws);
                    break;
                case WebSocketMessageType.Binary:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

    }
    
    private static async Task HandleReceiveMessageAsync(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handle)
    {
        var buffer = new byte[1024 * 4];

        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(
                buffer: new ArraySegment<byte>(buffer),
                cancellationToken: CancellationToken.None);
            
            handle(result, buffer);
        }
    }
}