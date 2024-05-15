using AutoMapper;
using FluentValidation;
using Together.Application.Features.FeaturePost.Responses;
using Together.Domain.Aggregates.PostAggregate;
using Together.Persistence;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeaturePost.Commands;

public class CreatePostCommand : ICommand<CreatePostResponse>
{
    public string Content { get; set; } = default!;
    
    public class Validator : AbstractValidator<CreatePostCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Content).NotEmpty();
        }
    }
    
    internal class Handler(
        TogetherContext context, 
        IBaseService baseService,
        IMapper mapper) : ICommandHandler<CreatePostCommand, CreatePostResponse>
    {
        public async Task<Result<CreatePostResponse>> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var post = new Post
            {
                Id = Guid.NewGuid(),
                Content = request.Content
            };
            post.MarkUserCreated(currentUserId);

            await context.Posts.AddAsync(post, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return new Result<CreatePostResponse>().IsSuccess(mapper.Map<CreatePostResponse>(post), "Tạo bài viết thành công");
        }
    }
}