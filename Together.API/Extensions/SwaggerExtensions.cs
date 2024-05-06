using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace Together.API.Extensions;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerDocument(this IServiceCollection services, 
                                                        string title, 
                                                        string version, 
                                                        Action<SwaggerGenOptions>? options = null)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(
            o =>
            {
                o.SwaggerDoc(version, new OpenApiInfo
                {
                    Title = title,
                    Version = version
                });
                
                o.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. " +
                                  "\r\n\r\n Enter 'Bearer' [space] and then your token in the text input below." +
                                  "\r\n\r\nExample: \"Bearer accessToken\"",
                });
                
                o.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        }, []
                    }
                });
                
                options?.Invoke(o);
            });

        return services;
    }
    
    public static WebApplication UseSwaggerDocument(this WebApplication app, 
                                                         string? title = null,
                                                         Action<SwaggerUIOptions>? uiOptions = null,
                                                         Action<SwaggerOptions>? options = null)
    {
        app.UseSwagger(o =>
        {
            options?.Invoke(o);
        });
        app.UseSwaggerUI(o =>
        {
            o.DocumentTitle = title ?? "Swagger UI";
            uiOptions?.Invoke(o);
        });
        return app;
    }
}