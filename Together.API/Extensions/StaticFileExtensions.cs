using Microsoft.Extensions.FileProviders;
using Together.Shared.ValueObjects;

namespace Together.API.Extensions;

public static class StaticFilesExtensions
{
    public static IApplicationBuilder UseStaticFilesConfigure(
        this IApplicationBuilder app,
        StaticFileConfig config)
    {
        if (!Directory.Exists(config.Location)) Directory.CreateDirectory(config.Location);
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(config.Location),
            RequestPath = new PathString(config.SubPath)
        });
        return app;
    }
}
