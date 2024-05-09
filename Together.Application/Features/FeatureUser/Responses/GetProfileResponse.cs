using Together.Shared.Enums;

namespace Together.Application.Features.FeatureUser.Responses;

public class GetProfileResponse
{
    public Guid Id { get; set; }
    
    public string FullName { get; set; } = default!;
    
    public string? Username { get; set; }
    
    public string? Bio { get; set; }
    
    public DateTime? Dob { get; set; }
    
    public Gender? Gender { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public bool IsFollowing { get; set; }
    
    public long TotalFollower { get; set; }
    
    public long TotalFollowing { get; set; }
}