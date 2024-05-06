using System.Security.Claims;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Application.Features.FeatureUser.Responses;
using Together.Domain.Aggregates.UserAggregate;
using Together.Persistence;
using Together.Shared.Extensions;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class VerifyForgotPasswordCommand(Guid userId, string token) : IQuery<VerifyForgotPasswordResponse>
{
    public Guid UserId { get; set; } = userId;
    
    public string Token { get; set; } = token;
    
    public class Validator : AbstractValidator<VerifyForgotPasswordCommand>
    {
        public Validator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Token).NotEmpty();
        }
    }
    
    internal class Handler(TogetherContext context, AppSettings appSettings) : IQueryHandler<VerifyForgotPasswordCommand, VerifyForgotPasswordResponse>
    {
        public async Task<Result<VerifyForgotPasswordResponse>> Handle(VerifyForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var userToken = await context.UserTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => 
                        x.UserId == request.UserId && 
                        x.Type == UserTokenType.ForgotPasswordToken && 
                        x.Token == request.Token.ToSha256(),
                    cancellationToken);
            if (userToken is null) throw new ForgotPasswordTokenInvalidException("Null");
            if (userToken.Expiration < DateTime.Now.ToLocalTime()) throw new ForgotPasswordTokenInvalidException("Expired");
            
            var accessToken = JwtBearerProvider.GenerateAccessToken(
                appSettings.JwtTokenConfig.TokenSigningKey,
                new List<Claim>
                {
                    new ("id", userToken.User.Id.ToString()),
                    new ("fullName", userToken.User.FullName),
                    new ("email", userToken.User.Email),
                },
                DateTime.Now.AddMinutes(appSettings.JwtTokenConfig.AccessTokenDurationInMinutes).ToLocalTime(),
                appSettings.JwtTokenConfig.Issuer,
                appSettings.JwtTokenConfig.Audience);

            context.UserTokens.Remove(userToken);
            await context.SaveChangesAsync(cancellationToken);

            return new Result<VerifyForgotPasswordResponse>().IsSuccess(
                new VerifyForgotPasswordResponse
                {
                    AccessToken = accessToken,
                    ExpiresInMinutes = appSettings.JwtTokenConfig.AccessTokenDurationInMinutes
                });
        }
    }
}