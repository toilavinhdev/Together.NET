using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureFollow.Responses;
using Together.Persistence;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureFollow.Queries;

public class ListFollowQuery : IQuery<ListFollowResponse>, IPaginationRequest
{
    public int PageIndex { get; set; }
    
    public int PageSize { get; set; }
    
    public Guid UserId { get; set; }

    public bool Follower { get; set; } = true;
    
    public class Validator : AbstractValidator<ListFollowQuery>
    {
        public Validator()
        {
            Include(new PaginationValidator());
            RuleFor(x => x.UserId).NotEmpty();
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : IQueryHandler<ListFollowQuery, ListFollowResponse>
    {
        public async Task<Result<ListFollowResponse>> Handle(ListFollowQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            if (request.Follower)
            {
                var query = context.Follows
                    .Include(x => x.Source)
                    .ThenInclude(x => x.Followers!.Where(f => f.TargetId == currentUserId))
                    .Where(x => x.TargetId == request.UserId)
                    .OrderByDescending(x => x.Source.Followers!.Any(f => f.SourceId == currentUserId))
                    .ThenByDescending(x => x.CreatedAt);
                
                var follow = await query
                    .Skip(request.PageSize * (request.PageIndex - 1))
                    .Take(request.PageSize)
                    .Select(follow => new FollowViewModel
                    {
                        Id = follow.Id,
                        UserId = follow.Source.Id,
                        FullName = follow.Source.FullName,
                        Username = follow.Source.Username,
                        AvatarUrl = follow.Source.AvatarUrl,
                        IsFollowing = follow.Source.Followers!.Any(x => x.SourceId == currentUserId)
                    })
                    .ToListAsync(cancellationToken);

                var totalRecord = await query.LongCountAsync(cancellationToken);

                return new Result<ListFollowResponse>().IsSuccess(
                    new ListFollowResponse(follow, request.PageIndex, request.PageSize, totalRecord));
            }
            else
            {
                var query = context.Follows
                    .Include(x => x.Target)
                    .ThenInclude(x => x.Followers!.Where(f => f.SourceId == currentUserId))
                    .Where(x => x.SourceId == request.UserId)
                    .OrderByDescending(x => x.Target.Followers!.Any(f => f.SourceId == currentUserId))
                    .ThenByDescending(x => x.CreatedAt);
                
                var follow = await query
                    .Skip(request.PageSize * (request.PageIndex - 1))
                    .Take(request.PageSize)
                    .Select(follow => new FollowViewModel
                    {
                        Id = follow.Id,
                        UserId = follow.Target.Id,
                        FullName = follow.Target.FullName,
                        Username = follow.Target.Username,
                        AvatarUrl = follow.Target.AvatarUrl,
                        IsFollowing = follow.Target.Followers!.Any(x => x.SourceId == currentUserId)
                    })
                    .ToListAsync(cancellationToken);

                var totalRecord = await query.LongCountAsync(cancellationToken);

                return new Result<ListFollowResponse>().IsSuccess(
                    new ListFollowResponse(follow, request.PageIndex, request.PageSize, totalRecord));
            }
        }
    }
}