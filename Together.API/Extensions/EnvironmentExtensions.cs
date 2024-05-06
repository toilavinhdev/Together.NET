namespace Together.API.Extensions;

public static class EnvironmentExtensions
{
    public static void SetupEnvironment<T>(this WebApplicationBuilder builder, 
        string? external, 
        out T configure) where T : new()
    {
        configure = new T();
        var environment = builder.Environment;
        var json = $"appsettings.{environment.EnvironmentName}.json";
        var path = string.IsNullOrEmpty(external) ? json : Path.Combine(external, json);
        
        new ConfigurationBuilder()
            .SetBasePath(environment.ContentRootPath)
            .AddJsonFile(path)
            .AddEnvironmentVariables()
            .Build()
            .Bind(configure);
    }
}