namespace Together.Shared.WebSockets;

public class WebSocketMessage<T>
{
    public string Target { get; set; } = default!;

    public T Data { get; set; } = default!;
}