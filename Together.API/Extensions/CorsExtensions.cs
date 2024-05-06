namespace Together.API.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddCustomCors(this IServiceCollection services, string policyName)
    {
        services.AddCors(o =>
        {
            o.AddPolicy(Metadata.Name, b =>
            {
                b.AllowCredentials().AllowAnyHeader().AllowAnyMethod();
                b.SetIsOriginAllowed(_ => true);
            });
        });
        return services;
    }
}