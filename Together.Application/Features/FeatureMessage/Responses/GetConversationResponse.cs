using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureMessage.Responses;

public class GetConversationResponse(
    List<MessageViewModel> result,
    int pageIndex,
    int pageSize,
    long totalRecord) : PaginationResult<MessageViewModel>(result, pageIndex, pageSize, totalRecord);

public class MessageViewModel
{
    public Guid Id { get; set; }

    public string Text { get; set; } = default!;

    public string SenderUsername { get; set; } = default!;
    
    public string? SenderAvatarUrl { get; set; }
}