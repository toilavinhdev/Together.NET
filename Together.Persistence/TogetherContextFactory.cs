using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Together.Shared.ValueObjects;

namespace Together.Persistence;

public class TogetherContextFactory : IDesignTimeDbContextFactory<TogetherContext>
{
    public TogetherContext CreateDbContext(string[] args)
    {
        var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        var appSettings = new AppSettings();
        var path = Path.Combine(nameof(AppSettings), $"appsettings.{environmentName}.json");
        
        new ConfigurationBuilder()
            .SetBasePath(Environment.CurrentDirectory)
            .AddJsonFile(path)
            .Build()
            .Bind(appSettings);
        
        var optionsBuilder = new DbContextOptionsBuilder<TogetherContext>();
        optionsBuilder.UseSqlServer(appSettings.SqlServerConfig.ConnectionString);
        return new TogetherContext(optionsBuilder.Options);
    }
}