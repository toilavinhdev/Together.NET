using System.Net.WebSockets;
using System.Text;
using Together.Shared.Constants;
using Together.Shared.Extensions;
using Together.Shared.WebSockets;

namespace Together.Application.WebSockets;

public class WebSocketConnectionHandler(ConnectionManager connectionManager) : WebSocketHandler(connectionManager)
{
    public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
    {
        var socketId = ConnectionManager.GetId(socket);
        if (socketId is null) return;
        
        var messageString = Encoding.UTF8.GetString(buffer, 0, result.Count);
        var message = messageString.ToObject<WebSocketMessage<dynamic>>();

        switch (message.Target)
        {
            case WebSocketTargets.Ping:
                await SendMessageAsync(socketId, "Pong");
                break;
            case WebSocketTargets.TypingMessage:
                break;
        }
        
        Console.WriteLine(socketId + "-" + messageString);
    }
}