using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class DuplicateUsernameException(string? username = null) : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.User.UsernameDuplicate;

    public override string Detail { get; } = "Username đã được sử dụng.";

    public override string? Parameter { get; } = username; 
}