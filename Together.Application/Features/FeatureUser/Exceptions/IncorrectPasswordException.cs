using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class IncorrectPasswordException : DomainException
{
    public override string Code { get; } = "INCORRECT_PASSWORD";

    public override string Detail { get; } = "Mật khẩu không chính xác.";

    public override string? Parameter { get; } = default;
}