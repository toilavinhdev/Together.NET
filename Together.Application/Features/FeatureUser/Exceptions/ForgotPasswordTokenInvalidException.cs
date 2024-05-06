using Together.Shared.Exceptions;

namespace Together.Application.Features.FeatureUser.Exceptions;

public class ForgotPasswordTokenInvalidException(string? parameter = null) : DomainException
{
    public override string Code { get; } = "FORGOT_PASSWORD_TOKEN_INVALID";

    public override string Detail { get; } = "Yêu cầu đặt lại mật khẩu không hợp lệ hoặc đã hết hạn";

    public override string? Parameter { get; } = parameter;
}