using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureMessage.Responses;

public class ListConversationResponse(
    List<ConversationViewModel> result,
    int pageIndex,
    int pageSize,
    long totalRecord) : PaginationResult<ConversationViewModel>(result, pageIndex, pageSize, totalRecord);

public class ConversationViewModel
{
    public Guid Id { get; set; }

    public string LastMessage { get; set; } = default!;
    
    public string LastMessageBySenderUsername { get; set; } = default!;

    public string ConversationTitle { get; set; } = default!;
    
    public string? ConversationImageUrl { get; set; }
    
    public DateTime LastMessageAt { get; set; }
}