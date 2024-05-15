using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeaturePost.Exceptions;

public class ReplyNotFoundException(string? id = null) : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.Post.ReplyNotFound;

    public override string Detail { get; } = "Lượt bình luận không tồn tại.";

    public override string? Parameter { get; } = id;
}