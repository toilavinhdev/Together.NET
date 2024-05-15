using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeaturePost.Exceptions;

public class PostNotFoundException(string? parameter = null) : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.Post.PostNotFound;

    public override string Detail { get; } = "Bài viết không tồn tại.";

    public override string? Parameter { get; } = parameter;
}