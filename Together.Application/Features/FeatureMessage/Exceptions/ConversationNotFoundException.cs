using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureMessage.Exceptions;

public class ConversationNotFoundException(string? parameter = null) : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.Conversation.ConversationNotFound;

    public override string Detail { get; } = "Cuộc trò chuyện không tồn tại.";

    public override string? Parameter { get; } = parameter;
}