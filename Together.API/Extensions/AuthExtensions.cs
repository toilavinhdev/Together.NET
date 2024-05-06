using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Together.Shared.ValueObjects;

namespace Together.API.Extensions;

public static class AuthExtensions
{
    public static IServiceCollection AddJwtBearerAuth(this IServiceCollection services, JwtTokenConfig config)
    {
        services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(
                o =>
                {
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.TokenSigningKey));

                    o.TokenValidationParameters.IssuerSigningKey = key;
                    o.TokenValidationParameters.ValidateIssuerSigningKey = true;
                    o.TokenValidationParameters.ValidateLifetime = true;
                    o.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
                    o.TokenValidationParameters.ValidAudience = config.Audience;
                    o.TokenValidationParameters.ValidateAudience = true;
                    o.TokenValidationParameters.ValidIssuer = config.Issuer;
                    o.TokenValidationParameters.ValidateIssuer = true;
                });
        
        return services;
    }
}