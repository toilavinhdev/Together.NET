using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Together.Shared.Extensions;
using Together.Shared.ValueObjects;

namespace Together.Shared.Helpers;

public static class JwtBearerProvider
{
    public static string GenerateAccessToken(string tokenSingingKey, 
        IEnumerable<Claim> claimsPrincipal, 
        DateTime? expireAt = null, 
        string? issuer = null, 
        string? audience = null)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSingingKey));
        var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = issuer,
            Audience = audience,
            IssuedAt = DateTime.Now,
            Subject = new ClaimsIdentity(claimsPrincipal),
            Expires = expireAt,
            SigningCredentials = credential
        };
        
        var handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(handler.CreateToken(descriptor));
    }

    public static UserClaimsPrincipal DecodeAccessToken(string accessToken)
    {
        var decodedToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);

        var id = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("id"))?.Value.ToGuid() 
                 ?? throw new NullReferenceException("Claim type 'id' is required");
        var fullName = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("fullName"))?.Value 
                       ?? throw new NullReferenceException("Claim type 'fullName' is required");
        var username = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("username"))?.Value 
                       ?? throw new NullReferenceException("Claim type 'username' is required");
        var exp = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("iat"))?.Value.ToLong()
                  ?? throw new NullReferenceException("Claim type 'username' is required");
        
        return new UserClaimsPrincipal
        {
            Id = id,
            FullName = fullName,
            Username = username,
            ExpirationTime = DateTimeOffset.FromUnixTimeSeconds(exp).DateTime.ToLocalTime()
        };
    }
    
    public static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}
