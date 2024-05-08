using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.UserAggregate;
using Together.Persistence;
using Together.Shared.Extensions;
using Together.Shared.Messaging;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Queries;

public class VerifyForgotPasswordQuery(Guid userId, string token) : IQuery
{
    public Guid UserId { get; set; } = userId;
    
    public string Token { get; set; } = token;
    
    public class Validator : AbstractValidator<VerifyForgotPasswordQuery>
    {
        public Validator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Token).NotEmpty();
        }
    }
    
    internal class Handler(TogetherContext context) : IQueryHandler<VerifyForgotPasswordQuery>
    {
        public async Task<Result> Handle(VerifyForgotPasswordQuery request, CancellationToken cancellationToken)
        {
            var userToken = await context.UserTokens
                .FirstOrDefaultAsync(x => 
                        x.UserId == request.UserId && 
                        x.Type == UserTokenType.ForgotPasswordToken && 
                        x.Token == request.Token.ToSha256(),
                    cancellationToken);
            if (userToken is null) throw new ForgotPasswordTokenInvalidException("Null");
            if (userToken.Expiration < DateTime.Now.ToLocalTime()) throw new ForgotPasswordTokenInvalidException("Expired");

            return new Result().IsSuccess();
        }
    }
}