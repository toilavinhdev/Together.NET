using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Together.Shared.WebSockets;

public static class WebSocketExtensions
{
    public static IServiceCollection AddWebSocketManager(this IServiceCollection services, Assembly assembly)
    {
        services.AddTransient<ConnectionManager>();
        
        assembly.ExportedTypes
            .Where(t => t.GetTypeInfo().BaseType == typeof(WebSocketHandler))
            .ToList()
            .ForEach(t => services.AddSingleton(t));
        
        return services;
    }
    
    public static WebApplication MapWebSocketHandler<THandler>(this WebApplication app, PathString path)
        where THandler : WebSocketHandler
    {
        var handlerService = app.Services.GetService<THandler>();

        app.Map(path, c => c.UseMiddleware<WebSocketMiddleware>(handlerService));
        
        return app;
    }
}