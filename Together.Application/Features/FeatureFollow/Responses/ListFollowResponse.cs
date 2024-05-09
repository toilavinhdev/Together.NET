using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureFollow.Responses;

public class ListFollowResponse(
    List<FollowViewModel> result,
    int pageIndex,
    int pageSize,
    long totalRecord) : PaginationResult<FollowViewModel>(result, pageIndex, pageSize, totalRecord);

public class FollowViewModel
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    
    public string FullName { get; set; } = default!;
    
    public string Username { get; set; } = default!;
    
    public string? AvatarUrl { get; set; }
    
    public bool IsFollowing { get; set; }
}