using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Persistence;
using Together.Shared.Extensions;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class NewPasswordCommand : ICommand
{
    public string NewPassword { get; set; } = default!;

    public string ConfirmPassword { get; set; } = default!;
    
    public class Validator : AbstractValidator<NewPasswordCommand>
    {
        public Validator()
        {
            RuleFor(x => x.NewPassword).NotEmpty();
            RuleFor(x => x.ConfirmPassword).NotEmpty().Matches(x => x.NewPassword);
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : ICommandHandler<NewPasswordCommand>
    {
        public async Task<Result> Handle(NewPasswordCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, cancellationToken);
            if (user is null) throw new UserNotFoundException();

            user.PasswordHash = request.NewPassword.ToSha256();
            user.MarkModified();

            context.Users.Update(user);
            await context.SaveChangesAsync(cancellationToken);

            return new Result().IsSuccess("Cập nhật mật khẩu thành công");
        }
    }
}