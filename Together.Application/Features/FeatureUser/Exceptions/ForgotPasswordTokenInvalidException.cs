using Together.Shared.Constants;
using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class ForgotPasswordTokenInvalidException(string? parameter = null) : DomainException
{
    public override string Code { get; } = ErrorCodeConstants.User.ForgotPasswordTokenInvalid;

    public override string Detail { get; } = "Yêu cầu đặt lại mật khẩu không hợp lệ hoặc đã hết hạn";

    public override string? Parameter { get; } = parameter;
}