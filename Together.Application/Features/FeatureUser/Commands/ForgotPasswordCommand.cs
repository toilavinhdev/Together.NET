using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.UserAggregate;
using Together.Persistence;
using Together.Shared.Constants;
using Together.Shared.Extensions;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Commands;

public class ForgotPasswordCommand : ICommand
{
    public string Email { get; set; } = default!;
    
    public class Validator : AbstractValidator<ForgotPasswordCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Email).NotEmpty().Matches(RegexPatterns.EmailRegex);
        }
    }
    
    internal class Handler(TogetherContext context, AppSettings appSettings) : ICommandHandler<ForgotPasswordCommand>
    {
        private const int ForgotPasswordTokenDurationInDays = 1;
        
        public async Task<Result> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
            if (user is null) throw new UserNotFoundException(request.Email);

            var existedToken = await context.UserTokens.FirstOrDefaultAsync(
                x => x.UserId == user.Id && x.Type == UserTokenType.ForgotPasswordToken, 
                cancellationToken);
            if (existedToken is not null) context.UserTokens.Remove(existedToken);

            var token = 10.RandomString();

            var userToken = new UserToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Type = UserTokenType.ForgotPasswordToken,
                Token = token.ToSha256(),
                Expiration = DateTime.Now.AddDays(ForgotPasswordTokenDurationInDays).ToLocalTime(),
            };
            userToken.MarkCreated();

            await context.UserTokens.AddAsync(userToken, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            
            var validateUrl = new UriBuilder($"{appSettings.ClientHost}/auth/forgot-password/{user.Id}/{token}").Uri.ToString();
            await EmailProvider.SmtpSendAsync(appSettings.SmtpConfig, new SmtpMailForm
            {
                To = request.Email,
                Title = "TOGETHER.NET RESET PASSWORD",
                Body = TemplatePathProvider.GetPath("ForgotPasswordTemplate.html")
                    .ReadAllText()
                    .Replace("{{full_name}}", user.FullName)
                    .Replace("{{validate_url}}", validateUrl)
                    .Replace("{{contact_email}}", appSettings.SmtpConfig.Mail)
            });
            
            return new Result().IsSuccess("Yêu cầu đã được gửi đến email của bạn.");
        }
    }
}