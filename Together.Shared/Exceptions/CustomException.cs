namespace Together.Shared.Exceptions;

public class CustomException(string code, string detail, string? parameter = null) : DomainException
{
    public override string Code { get; } = code;

    public override string Detail { get; } = detail;

    public override string? Parameter { get; } = parameter;
}