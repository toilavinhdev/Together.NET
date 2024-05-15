namespace Together.Application.Features.FeatureMessage.Responses;

public class SendMessageResponse
{
    public Guid Id { get; set; }
    
    public Guid ConversationId { get; set; }    
    
    public Guid SenderId { get; set; }

    public string SenderUsername { get; set; } = default!;
    
    public string? SenderAvatarUrl { get; set; }
    
    public DateTime CreatedAt { get; set; }

    public string Text { get; set; } = default!;
}