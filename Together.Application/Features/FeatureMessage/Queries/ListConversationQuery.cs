using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureMessage.Responses;
using Together.Domain.Aggregates.ConversationAggregate;
using Together.Persistence;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureMessage.Queries;

public class ListConversationQuery : IQuery<ListConversationResponse>, IPaginationRequest
{
    public int PageIndex { get; set; }
    
    public int PageSize { get; set; }
    
    public class Validator : AbstractValidator<ListConversationQuery>
    {
        public Validator()
        {
            Include(new PaginationValidator());
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : IQueryHandler<ListConversationQuery, ListConversationResponse>
    {
        public async Task<Result<ListConversationResponse>> Handle(ListConversationQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var query = context.Conversations
                .Include(c => c.ConversationParticipants)
                .Include(c => c.Messages)!
                .ThenInclude(m => m.Sender)
                .AsSplitQuery()
                .Where(c => c.ConversationParticipants.Any(cp => cp.UserId == currentUserId))
                .OrderByDescending(c => c.Messages!.Max(m => m.CreatedAt));
            
            var conversationIds = await query
                .Select(c => c.Id)
                .Skip(request.PageSize * (request.PageIndex - 1))
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecord = await query.LongCountAsync(cancellationToken);

            var data = new List<ConversationViewModel>();

            foreach (var conversationId in conversationIds)
            {
                var lastMessage = await context.Messages
                    .Include(m => m.Conversation)
                    .ThenInclude(conversation => conversation.ConversationParticipants)
                    .ThenInclude(conversationParticipant => conversationParticipant.User)
                    .Include(m => m.Sender)
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefaultAsync(m => m.ConversationId == conversationId, cancellationToken);
                
                data.Add(new ConversationViewModel
                {
                    Id = conversationId,
                    LastMessage = lastMessage!.Text,
                    LastMessageAt = lastMessage.CreatedAt,
                    LastMessageBySenderUsername = lastMessage.Sender.Username,
                    ConversationTitle = lastMessage.Conversation.Type == ConversationType.Normal 
                        ? lastMessage.Conversation.ConversationParticipants.FirstOrDefault(x => x.UserId != currentUserId)!.User.Username
                        : string.Empty,
                    ConversationImageUrl = lastMessage.Conversation.Type == ConversationType.Normal 
                        ? lastMessage.Conversation.ConversationParticipants.FirstOrDefault(x => x.UserId != currentUserId)?.User.AvatarUrl
                        : null,
                });
            }
            
            return new Result<ListConversationResponse>().IsSuccess(
                new ListConversationResponse(
                    data, 
                    request.PageIndex, 
                    request.PageSize, 
                    totalRecord));
        }
    }
}