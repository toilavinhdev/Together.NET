using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.UserAggregate;
using Together.Persistence;
using Together.Shared.Extensions;
using Together.Shared.Messaging;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class NewPasswordCommand : ICommand
{
    public Guid UserId { get; set; }

    public string Token { get; set; } = default!;
    
    public string NewPassword { get; set; } = default!;

    public string ConfirmPassword { get; set; } = default!;

    public class Validator : AbstractValidator<NewPasswordCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Token).NotEmpty();
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.NewPassword).NotEmpty();
            RuleFor(x => x.ConfirmPassword).NotEmpty().Matches(x => x.NewPassword);
        }
    }
    
    internal class Handler(TogetherContext context) : ICommandHandler<NewPasswordCommand>
    {
        public async Task<Result> Handle(NewPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
            if (user is null) throw new UserNotFoundException();

            var userToken = await context.UserTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => 
                        x.UserId == request.UserId && 
                        x.Type == UserTokenType.ForgotPasswordToken && 
                        x.Token == request.Token.ToSha256(),
                    cancellationToken);
            if (userToken is null) throw new ForgotPasswordTokenInvalidException("Null");
            if (userToken.Expiration < DateTime.Now.ToLocalTime()) throw new ForgotPasswordTokenInvalidException("Expired");

            user.PasswordHash = request.NewPassword.ToSha256();
            user.MarkModified();
            context.Users.Update(user);

            context.UserTokens.Remove(userToken);
            await context.SaveChangesAsync(cancellationToken);

            return new Result().IsSuccess("Cập nhật mật khẩu thành công");
        }
    }
}