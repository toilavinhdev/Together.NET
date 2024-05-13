using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class IncorrectPasswordException : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.User.IncorrectPassword;

    public override string Detail { get; } = "Mật khẩu không chính xác.";

    public override string? Parameter { get; } = default;
}