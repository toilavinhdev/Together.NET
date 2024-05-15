namespace Together.Application.Features.FeaturePost.Responses;

public class CreateReplyResponse
{
    public Guid Id { get; set; }
    
    public Guid PostId { get; set; }
    
    public Guid? ParentId { get; set; }

    public string Content { get; set; } = default!;
}