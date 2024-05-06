using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Shared.Enums;

namespace Together.Domain.Aggregates.UserAggregate;

[Index(nameof(Username), IsUnique = true)]
public class User : TimeTrackingEntity, IAggregateRoot
{
    [MaxLength(128)]
    public string FullName { get; set; } = default!;

    [MaxLength(32)]
    public string? Username { get; set; }

    public string Email { get; set; } = default!;
    
    public bool EmailConfirmed { get; set; }
    
    [MaxLength(128)]
    public string? Bio { get; set; }
    
    public DateTime? Dob { get; set; }
    
    public Gender? Gender { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public string PasswordHash { get; set; } = default!;

    public List<UserToken>? UserToken { get; set; }
}