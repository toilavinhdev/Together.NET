using Infrastructure.Redis;
using Infrastructure.SharedKernel;
using Infrastructure.SharedKernel.Extensions;
using Infrastructure.WebSocket;
using Service.Socket;
using Service.Socket.BackgroundServices;

var (builder, appSettings) = WebApplicationBuilderExtensions.CreateCoreBuilder<AppSettings>(args);

var services = builder.Services;
services.AddSharedKernel<Program>(appSettings);
services.AddWebSocketHandlers<Program>();
services.AddHostedService<SendMessageSocketBackgroundService>();
services.AddHostedService<SendNotificationSocketBackgroundService>();

var app = builder.Build();
app.UseSharedKernel(appSettings);
app.UseGrpc(appSettings.GrpcEndpoints.ServiceSocket, _ => {});
app.UseWebSockets();
app.MapWebSocketHandler<SocketHandler>("/socket/ws");
app.MapGet("/api/socket/connections", (SocketHandler handler) => handler.ConnectionManager.GetAll());
await app.Services
    .GetRequiredService<IRedisService>()
    .KeyDeleteAsync(RedisKeys.SocketOnlineUsers());
app.Run();