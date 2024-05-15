namespace Together.Application.Features.FeaturePost.Responses;

public class NewsFeedResponse
{
    public List<PostViewModel> Posts { get; set; } = default!;
}

public class PostViewModel
{
    public Guid Id { get; set; }

    public string Author { get; set; } = default!;
    
    public string? AuthorAvatarUrl { get; set; }

    public string Content { get; set; } = default!;
    
    public long TotalLike { get; set; }
    
    public long TotalReply { get; set; }
    
    public bool Liked { get; set; }
}