using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Application.Features.FeatureUser.Responses;
using Together.Persistence;
using Together.Shared.Constants;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Queries;

public class GetProfileQuery(string username) : IQuery<GetProfileResponse>
{
    public string Username { get; set; } = username;
    
    public class Validator : AbstractValidator<GetProfileQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .MaximumLength(32)
                .Matches(RegexPatterns.UsernameRegex);
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : IQueryHandler<GetProfileQuery, GetProfileResponse>
    {
        public async Task<Result<GetProfileResponse>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var user = await context.Users.FirstOrDefaultAsync(x => x.Username == request.Username, cancellationToken);
            if (user is null) throw new UserNotFoundException(request.Username);

            var isFollowing = await context.Follows.AnyAsync(x => 
                x.SourceId == currentUserId && 
                x.TargetId == user.Id, 
                cancellationToken);

            var totalFollower = await context.Follows.LongCountAsync(x => x.TargetId == user.Id, cancellationToken);
            var totalFollowing = await context.Follows.LongCountAsync(x => x.SourceId == user.Id, cancellationToken);

            var profile = new GetProfileResponse
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Bio = user.Bio,
                Dob = user.Dob,
                IsFollowing = isFollowing,
                TotalFollower = totalFollower,
                TotalFollowing = totalFollowing,
            };

            return new Result<GetProfileResponse>().IsSuccess(profile);
        }
    }
}