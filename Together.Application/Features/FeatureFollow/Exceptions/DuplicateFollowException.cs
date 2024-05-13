using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureFollow.Exceptions;

public class DuplicateFollowException(string? para = null) : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.Follow.FollowDuplicate;

    public override string Detail { get; } = "Lượt theo dõi đã tồn tại.";

    public override string? Parameter { get; } = para;
}