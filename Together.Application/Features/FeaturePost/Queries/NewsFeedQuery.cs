using System.Linq.Expressions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeaturePost.Responses;
using Together.Domain.Aggregates.PostAggregate;
using Together.Persistence;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeaturePost.Queries;

public class NewsFeedQuery : IQuery<NewsFeedResponse>, IPaginationRequest
{
    public int PageIndex { get; set; }
    
    public int PageSize { get; set; }

    public bool? Following { get; set; }
    
    public class Validator : AbstractValidator<NewsFeedQuery>
    {
        public Validator()
        {
            Include(new PaginationValidator());
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : IQueryHandler<NewsFeedQuery, NewsFeedResponse>
    {
        public async Task<Result<NewsFeedResponse>> Handle(NewsFeedQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            Expression<Func<Post, bool>> whereExpression = x => true;

            if (request.Following is not null && request.Following.Value)
            {
                whereExpression = whereExpression.And(x => x.CreatedBy.Followers!.Any(f => f.TargetId == currentUserId));
            }

            var posts = await context.Posts
                .Include(p => p.CreatedBy)
                .ThenInclude(u => u.Followings)
                .Include(p => p.Replies)
                .Include(p => p.PostLikes)!
                .ThenInclude(pl => pl.User)
                .Where(whereExpression)
                .OrderByDescending(p => p.CreatedAt)
                .Skip(request.PageSize * (request.PageIndex - 1))
                .Take(request.PageSize)
                .Select(p => new PostViewModel
                {
                    Id = p.Id,
                    Author = p.CreatedBy.Username,
                    AuthorAvatarUrl = p.CreatedBy.AvatarUrl,
                    Content = p.Content,
                    TotalLike = p.PostLikes!.Count,
                    TotalReply = p.Replies!.Count,
                    Liked = p.PostLikes.Any(pl => pl.UserId == currentUserId)
                })
                .ToListAsync(cancellationToken);

            return new Result<NewsFeedResponse>().IsSuccess(
                new NewsFeedResponse
                {
                    Posts = posts
                });
        }
    }
}