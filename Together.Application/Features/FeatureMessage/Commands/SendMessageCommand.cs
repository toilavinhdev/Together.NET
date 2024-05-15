using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureMessage.Exceptions;
using Together.Application.Features.FeatureMessage.Responses;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Application.WebSockets;
using Together.Domain.Aggregates.ConversationAggregate;
using Together.Persistence;
using Together.Shared.Constants;
using Together.Shared.Extensions;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;
using Together.Shared.WebSockets;

namespace Together.Application.Features.FeatureMessage.Commands;

public class SendMessageCommand : ICommand<SendMessageResponse>
{
    public Guid? ConversationId { get; set; }

    public string Text { get; set; } = default!;
    
    public class Validator : AbstractValidator<SendMessageCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Text)
                .NotNull()
                .MaximumLength(512);
            RuleFor(x => x.ConversationId)
                .NotEmpty();
        }
    }
    
    internal class Handler(
        TogetherContext context, 
        IBaseService baseService, 
        IMapper mapper,
        WebSocketConnectionHandler webSocketConnectionHandler
    ) : ICommandHandler<SendMessageCommand, SendMessageResponse>
    {
        public async Task<Result<SendMessageResponse>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;
            var currentUser = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, cancellationToken);
            if (currentUser is null) throw new UserNotFoundException(currentUserId.ToString());

            var conversation = await context.Conversations
                .Include(c => c.ConversationParticipants)
                .FirstOrDefaultAsync(c => c.Id == request.ConversationId, cancellationToken);
            if (conversation is null) throw new ConversationNotFoundException(request.ConversationId.ToString());

            var message = new Message
            {
                Id = Guid.NewGuid(),
                Text = request.Text,
                SenderId = currentUserId,
                ConversationId = conversation.Id,
            };
            message.MarkCreated();

            await context.Messages.AddAsync(message, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            var data = mapper.Map<SendMessageResponse>(message);

            var participantIds = conversation.ConversationParticipants
                .Select(cp => cp.UserId)
                .Where(id => id != currentUserId)
                .ToList();
            
            foreach (var userId in participantIds)
            {
                Console.WriteLine("1");
                await webSocketConnectionHandler.SendMessageAsync(
                    userId.ToString(), 
                    new WebSocketMessage<SendMessageResponse>()
                    {
                        Target = WebSocketTargets.ReceiveMessage,
                        Data = data
                    }.ToJson());
            }

            return new Result<SendMessageResponse>().IsSuccess(data);
        }
    }
}