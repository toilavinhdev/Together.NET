using AutoMapper;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Application.Features.FeatureUser.Responses;

[AutoMap(typeof(User))]
public class GetMeResponse
{
    public Guid Id { get; set; }
    
    public string FullName { get; set; } = default!;
    
    public string Email { get; set; } = default!;
    
    public string? Username { get; set; }
    
    public string? AvatarUrl { get; set; }
}