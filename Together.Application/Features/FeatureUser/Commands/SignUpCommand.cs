using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.UserAggregate;
using Together.Persistence;
using Together.Shared.Constants;
using Together.Shared.Extensions;
using Together.Shared.Messaging;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class SignUpCommand : ICommand
{
    public string FullName { get; set; } = default!;
    
    public string Username { get; set; } = default!;

    public string Email { get; set; } = default!;
    
    public string Password { get; set; } = default!;

    public string ConfirmPassword { get; set; } = default!;
    
    public class Validator : AbstractValidator<SignUpCommand>
    {
        public Validator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(128);
            RuleFor(x => x.Username)
                .NotEmpty()
                .MaximumLength(32)
                .Matches(RegexPatterns.UsernameRegex);
            RuleFor(x => x.Email)
                .NotEmpty()
                .Matches(RegexPatterns.EmailRegex);
            RuleFor(x => x.Password)
                .NotEmpty();
            RuleFor(x => x.ConfirmPassword)
                .NotEmpty()
                .Matches(x => x.Password);
        }
    }
    
    internal class Handler(TogetherContext context) : ICommandHandler<SignUpCommand>
    {
        public async Task<Result> Handle(SignUpCommand request, CancellationToken cancellationToken)
        {
            var existedEmail = await context.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
            if (existedEmail) throw new DuplicateEmailException(request.Email);

            var existedUsername = await context.Users.AnyAsync(x => x.Username == request.Username, cancellationToken);
            if (existedUsername) throw new DuplicateUsernameException(request.Username);
            
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = request.FullName,
                Username = request.Username,
                Email = request.Email,
                PasswordHash = request.Password.ToSha256(),
                EmailConfirmed = false
            };
            user.MarkCreated();

            await context.Users.AddAsync(user, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            return new Result().IsSuccess("Đăng ký thành công.");
        }
    }
}