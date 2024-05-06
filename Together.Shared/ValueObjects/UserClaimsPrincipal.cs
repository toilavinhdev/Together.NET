using System.IdentityModel.Tokens.Jwt;
using Together.Shared.Extensions;

namespace Together.Shared.ValueObjects;

public class UserClaimsPrincipal
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = default!;

    public string Email { get; set; } = default!;
    
    public DateTime ExpirationTime { get; set; }
    
    public static UserClaimsPrincipal DecodeAccessToken(string accessToken)
    {
        var decodedToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);

        var id = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("id"))?.Value.ToGuid() 
                 ?? throw new NullReferenceException("Claim type 'id' is required");
        var fullName = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("fullName"))?.Value 
                       ?? throw new NullReferenceException("Claim type 'fullName' is required");
        var email = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("email"))?.Value 
                       ?? throw new NullReferenceException("Claim type 'email' is required");
        var exp = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("iat"))?.Value.ToLong()
                  ?? throw new NullReferenceException("Claim type 'exp' is required");
        
        return new UserClaimsPrincipal
        {
            Id = id,
            FullName = fullName,
            Email = email,
            ExpirationTime = DateTimeOffset.FromUnixTimeSeconds(exp).DateTime.ToLocalTime()
        };
    }
}