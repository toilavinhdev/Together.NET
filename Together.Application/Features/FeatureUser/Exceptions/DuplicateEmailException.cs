using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class DuplicateEmailException(string? email = null) : DomainException
{
    public override string Code { get; } = "DUPLICATE_EMAIL";

    public override string Detail { get; } = "Email đã được sử dụng.";

    public override string? Parameter { get; } = email;
}