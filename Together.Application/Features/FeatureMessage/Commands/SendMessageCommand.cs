using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureMessage.Responses;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Domain.Aggregates.ConversationAggregate;
using Together.Persistence;
using Together.Shared.Constants;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureMessage.Commands;

public class SendMessageCommand : ICommand<SendMessageResponse>
{
    public Guid? ReceiveId { get; set; }
    
    public Guid? ConversationId { get; set; }

    public string Text { get; set; } = default!;
    
    public class Validator : AbstractValidator<SendMessageCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Text)
                .NotNull()
                .MaximumLength(512);
            RuleFor(x => new { x.ConversationId, x.ReceiveId })
                .Must(x => x.ConversationId.HasValue ^ x.ReceiveId.HasValue)
                .WithErrorCode(ErrorCodeConstants.Conversation.RequestSendMessageInvalid)
                .When(x => x.ConversationId.HasValue && x.ReceiveId.HasValue);
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService, IMapper mapper) : ICommandHandler<SendMessageCommand, SendMessageResponse>
    {
        public async Task<Result<SendMessageResponse>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;
            var currentUser = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, cancellationToken);
            if (currentUser is null) throw new UserNotFoundException(currentUserId.ToString());
            
            if (request.ReceiveId is not null)
            {
                var receiver = await context.Users.FirstOrDefaultAsync(x => x.Id == request.ReceiveId, cancellationToken);
                if (receiver is null) throw new UserNotFoundException(request.ReceiveId.ToString());

                var conversation = await context.Conversations
                    .Include(x => x.ConversationParticipants)
                    .FirstOrDefaultAsync(c =>
                            c.Type == ConversationType.Normal &&
                            c.ConversationParticipants.Count == 2 &&
                            c.ConversationParticipants.Any(cp => cp.UserId == currentUser.Id) &&
                            c.ConversationParticipants.Any(cp => cp.UserId == receiver.Id),
                        cancellationToken);

                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    Text = request.Text,
                    SenderId = currentUserId,
                };
                message.MarkCreated();
                
                if (conversation is not null)
                {
                    message.ConversationId = conversation.Id;
                    await context.Messages.AddAsync(message, cancellationToken);
                }
                else
                {
                    conversation = new Conversation
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
                        Messages = [message]
                    };
                    conversation.MarkUserCreated(currentUserId);
                        
                    await context.Conversations.AddAsync(conversation, cancellationToken);
                }

                await context.SaveChangesAsync(cancellationToken);
                
                return new Result<SendMessageResponse>().IsSuccess(mapper.Map<SendMessageResponse>(message));
            }
            else
            {
                return new Result<SendMessageResponse>().IsSuccess(
                    new SendMessageResponse
                    {

                    });
            }
        }
    }
}