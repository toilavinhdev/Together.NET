using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeaturePost.Exceptions;
using Together.Domain.Aggregates.PostAggregate;
using Together.Persistence;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeaturePost.Commands;

public class LikePostCommand : ICommand
{
    public Guid PostId { get; set; }
    
    public class Validator : AbstractValidator<LikePostCommand>
    {
        public Validator()
        {
            RuleFor(x => x.PostId).NotEmpty();
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : ICommandHandler<LikePostCommand>
    {
        public async Task<Result> Handle(LikePostCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var post = await context.Posts.FirstOrDefaultAsync(x => x.Id == request.PostId, cancellationToken);
            if (post is null) throw new PostNotFoundException(request.PostId.ToString());

            var like = await context.PostLikes.FirstOrDefaultAsync(pl => pl.UserId == currentUserId, cancellationToken);
            if (like is null)
            {
                var newLike = new PostLike
                {
                    Id = Guid.NewGuid(),
                    PostId = post.Id,
                    UserId = currentUserId
                };
                newLike.MarkCreated();
                await context.PostLikes.AddAsync(newLike, cancellationToken);
            }
            else
            {
                context.PostLikes.Remove(like);
            }
            
            await context.SaveChangesAsync(cancellationToken);

            return new Result().IsSuccess(like is null ? "Đã thích bài viết." : "Đã hủy thích bài viết.");
        }
    }
}