using System.Security.Claims;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Application.Features.FeatureUser.Responses;
using Together.Persistence;
using Together.Shared.Constants;
using Together.Shared.Extensions;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class SignInCommand : ICommand<SignInResponse>
{
    public string Email { get; set; } = default!;
    
    public string Password { get; set; } = default!;
    
    public class Validator : AbstractValidator<SignInCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Email).NotEmpty().Matches(RegexPatterns.EmailRegex);
            RuleFor(x => x.Password).NotEmpty();
        }
    }

    internal class Handler(TogetherContext context, AppSettings appSettings) : ICommandHandler<SignInCommand, SignInResponse>
    {
        public async Task<Result<SignInResponse>> Handle(SignInCommand request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
            if (user is null) throw new UserNotFoundException(request.Email);
            if (user.PasswordHash != request.Password.ToSha256()) throw new IncorrectPasswordException();
            
            var accessToken = JwtBearerProvider.GenerateAccessToken(
                appSettings.JwtTokenConfig.TokenSigningKey,
                new List<Claim>
                {
                    new ("id", user.Id.ToString()),
                    new ("fullName", user.FullName),
                    new ("email", user.Email),
                },
                DateTime.Now.AddMinutes(appSettings.JwtTokenConfig.AccessTokenDurationInMinutes).ToLocalTime(),
                appSettings.JwtTokenConfig.Issuer,
                appSettings.JwtTokenConfig.Audience);

            return new Result<SignInResponse>().IsSuccess(
                new SignInResponse
                {
                    AccessToken = accessToken
                }, "Đăng nhập thành công.");
        }
    }
}