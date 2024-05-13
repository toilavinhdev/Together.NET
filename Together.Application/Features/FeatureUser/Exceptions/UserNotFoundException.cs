using System.Net;
using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class UserNotFoundException(string? parameter = null) : DomainException
{
    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.NotFound;

    public override string Code { get; } = ErrorCodeConstants.User.NotFound;

    public override string Detail { get; } = "Người dùng không tồn tại.";

    public override string? Parameter { get; } = parameter;
}