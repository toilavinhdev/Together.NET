using Together.Shared.Services;

namespace Together.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServiceCollections(this IServiceCollection services)
    {
        services.AddTransient<IBaseService, BaseService>();
        return services;
    }
}