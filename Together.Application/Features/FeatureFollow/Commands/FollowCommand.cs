using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureFollow.Exceptions;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.FollowAggregate;
using Together.Persistence;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureFollow.Commands;

public class FollowCommand : ICommand<bool>
{
    public Guid TargetId { get; set; }
    
    public class Validator : AbstractValidator<FollowCommand>
    {
        public Validator()
        {
            RuleFor(x => x.TargetId).NotEmpty();
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : ICommandHandler<FollowCommand, bool>
    {
        public async Task<Result<bool>> Handle(FollowCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;
            if (currentUserId == request.TargetId) throw new DuplicateFollowException("NOT_ME");

            var target = await context.Users.FirstOrDefaultAsync(x => x.Id == request.TargetId, cancellationToken);
            if (target is null) throw new UserNotFoundException(request.TargetId.ToString());

            var existed = await context.Follows.FirstOrDefaultAsync(x => 
                    x.SourceId == currentUserId && 
                    x.TargetId == request.TargetId,
                    cancellationToken);

            if (existed is null)
            {
                var follow = new Follow
                {
                    Id = Guid.NewGuid(),
                    SourceId = currentUserId,
                    TargetId = target.Id
                };
                follow.MarkCreated();
                await context.Follows.AddAsync(follow, cancellationToken);
            }
            else
            {
                context.Follows.Remove(existed);

            }
            
            await context.SaveChangesAsync(cancellationToken);

            return new Result<bool>().IsSuccess(
                existed is null,
                existed is null ? "Tạo lượt theo dõi thành công" : "Hủy theo dõi thành công");
        }
    }
}