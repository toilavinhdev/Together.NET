using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureMessage.Exceptions;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.ConversationAggregate;
using Together.Persistence;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureMessage.Commands;

public class CreateConversationCommand : ICommand<Guid>
{
    public List<Guid> ParticipantIds { get; set; } = default!;
    
    public string? MessageText { get; set; }
    
    public class Validator : AbstractValidator<CreateConversationCommand>
    {
        public Validator()
        {
            RuleFor(x => x.ParticipantIds)
                .NotNull()
                .Must(x => x.Count > 0);
            RuleFor(x => x.MessageText)
                .MaximumLength(512);
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : ICommandHandler<CreateConversationCommand, Guid>
    {
        public async Task<Result<Guid>> Handle(CreateConversationCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;
            var currentUser = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, cancellationToken);
            if (currentUser is null) throw new UserNotFoundException(currentUserId.ToString());

            if (request.ParticipantIds.Count == 1)
            {
                var receiverId = request.ParticipantIds.FirstOrDefault();
                var receiver = await context.Users.FirstOrDefaultAsync(x => x.Id == receiverId, cancellationToken);
                if (receiver is null) throw new UserNotFoundException(receiverId.ToString());
                
                var isExistedConversation = await context.Conversations
                    .Include(x => x.ConversationParticipants)
                    .AnyAsync(c =>
                            c.Type == ConversationType.Normal &&
                            c.ConversationParticipants.Count == 2 &&
                            c.ConversationParticipants.Any(cp => cp.UserId == currentUser.Id) &&
                            c.ConversationParticipants.Any(cp => cp.UserId == receiver.Id),
                        cancellationToken);
                if (isExistedConversation) throw new ConversationExistedException();

                var conversation = new Conversation
                {
                    Id = Guid.NewGuid(),
                    Type = ConversationType.Normal,
                    ConversationParticipants =
                    [
                        new ConversationParticipant
                        {
                            Id = Guid.NewGuid(),
                            UserId = currentUserId
                        },
                        new ConversationParticipant
                        {
                            Id = Guid.NewGuid(),
                            UserId = receiver.Id
                        }
                    ],
                    Messages = request.MessageText is not null 
                        ? [new Message
                            {
                                Id = Guid.NewGuid(),
                                SenderId = currentUserId,
                                Text = request.MessageText,
                                CreatedAt = DateTime.Now.ToLocalTime()
                            }]  
                        : []
                };
                conversation.MarkUserCreated(currentUserId);
                await context.Conversations.AddAsync(conversation, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                return new Result<Guid>().IsSuccess(conversation.Id, "Tạo cuộc trò chuyện thành công.");
            }
            else
            {
                return new Result<Guid>().IsSuccess(Guid.Empty, "Tạo cuộc trò chuyện thành công.");
            }
        }
    }
}