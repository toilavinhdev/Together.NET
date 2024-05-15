using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeaturePost.Exceptions;
using Together.Application.Features.FeaturePost.Responses;
using Together.Domain.Aggregates.PostAggregate;
using Together.Persistence;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeaturePost.Commands;

public class CreateReplyCommand : ICommand<CreateReplyResponse>
{
    public Guid PostId { get; set; }
    
    public Guid? ParentId { get; set; }

    public string Content { get; set; } = default!;
    
    public class Validator : AbstractValidator<CreateReplyCommand>
    {
        public Validator()
        {
            RuleFor(x => x.PostId).NotEmpty();
            RuleFor(x => x.Content)
                .NotEmpty()
                .MaximumLength(2014);
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService, IMapper mapper) : ICommandHandler<CreateReplyCommand, CreateReplyResponse>
    {
        public async Task<Result<CreateReplyResponse>> Handle(CreateReplyCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var post = await context.Posts.FirstOrDefaultAsync(p => p.Id == request.PostId, cancellationToken);
            if (post is null) throw new PostNotFoundException(request.PostId.ToString());

            if (request.ParentId is not null)
            {
                var parentExists = await context.Replies.AnyAsync(r => r.Id == request.ParentId, cancellationToken);
                if (!parentExists) throw new ReplyNotFoundException(request.ParentId.ToString());
            }

            var reply = new Reply
            {
                Id = Guid.NewGuid(),
                PostId = post.Id,
                ParentId = request.ParentId,
                Content = request.Content,
            };
            reply.MarkUserCreated(currentUserId);

            await context.Replies.AddAsync(reply, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            return new Result<CreateReplyResponse>().IsSuccess(
                mapper.Map<CreateReplyResponse>(reply), 
                "Tạo bình luận thành công.");
        }
    }
}