using System.ComponentModel.DataAnnotations.Schema;
using Together.Domain.Abstractions;

namespace Together.Domain.Aggregates.UserAggregate;

public class UserToken : TimeTrackingEntity
{
    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))] 
    public User User { get; set; } = default!;
    
    public UserTokenType Type { get; set; }

    public string Token { get; set; } = default!;
    
    public DateTime Expiration { get; set; }
}

public enum UserTokenType
{
    RefreshToken = 0,
    ForgotPasswordToken
}