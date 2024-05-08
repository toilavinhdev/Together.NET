using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Persistence;
using Together.Shared.Enums;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class UpdateProfileCommand : ICommand
{
    public string FullName { get; set; } = default!;
    
    public string? Bio { get; set; }
    
    public DateTime? Dob { get; set; }
    
    public Gender? Gender { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public class Validator : AbstractValidator<UpdateProfileCommand>
    {
        public Validator()
        {
            RuleFor(x => x.FullName).NotEmpty().MaximumLength(128);
            RuleFor(x => x.Bio).MaximumLength(128);
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : ICommandHandler<UpdateProfileCommand>
    {
        public async Task<Result> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, cancellationToken);
            if (user is null) throw new UserNotFoundException();

            user.FullName = request.FullName;
            user.Bio = request.Bio;
            user.Dob = request.Dob;
            user.Gender = request.Gender;
            user.AvatarUrl = request.AvatarUrl;
            user.MarkModified();
            context.Users.Update(user);
            await context.SaveChangesAsync(cancellationToken);

            return new Result().IsSuccess("Cập nhật thông tin thành công.");
        }
    }
}