using Serilog;
using Serilog.Events;

namespace Together.API.Extensions;

public static class SerilogExtensions
{
    public static void SetupSerilog(this WebApplicationBuilder builder)
    {
        var outputPath = Path.Combine(builder.Environment.ContentRootPath, "Logs", "log.txt");
        
        builder.Host.UseSerilog((ctx , configuration) =>
        {
            configuration
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File(
                    path: outputPath,
                    restrictedToMinimumLevel: LogEventLevel.Warning,
                    rollingInterval: RollingInterval.Day);
        });
        builder.Logging.ClearProviders();
        builder.Logging.AddSerilog();
    }
}