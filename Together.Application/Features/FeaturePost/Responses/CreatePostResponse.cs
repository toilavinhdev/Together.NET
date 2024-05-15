namespace Together.Application.Features.FeaturePost.Responses;

public class CreatePostResponse
{
    public Guid Id { get; set; }

    public string Content { get; set; } = default!;

    public Guid CreatedById { get; set; }
    
    public DateTime CreatedAt { get; set; }
}