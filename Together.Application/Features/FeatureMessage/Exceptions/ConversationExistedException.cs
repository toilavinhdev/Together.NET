using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureMessage.Exceptions;

public class ConversationExistedException : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.Conversation.ConversationExisted;

    public override string Detail { get; } = "Cuộc trò chuyện đã tồn tại.";

    public override string? Parameter { get; } = default;
}