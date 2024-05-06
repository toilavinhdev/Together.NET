using Microsoft.AspNetCore.Http;
using Together.Shared.Helpers;
using Together.Shared.ValueObjects;

namespace Together.Shared.Services;

public interface IBaseService
{
    UserClaimsPrincipal GetUserClaimsPrincipal();
}

public class BaseService(IHttpContextAccessor httpContextAccessor) : IBaseService
{
    public UserClaimsPrincipal GetUserClaimsPrincipal()
    {
        var accessToken = httpContextAccessor.HttpContext?.Request.Headers
            .FirstOrDefault(x => x.Key.Equals("Authorization"))
            .Value
            .ToString()
            .Split(" ")
            .LastOrDefault();

        return string.IsNullOrEmpty(accessToken) 
            ? default! 
            : JwtBearerProvider.DecodeAccessToken(accessToken);
    }
}