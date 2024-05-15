using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureMessage.Responses;
using Together.Persistence;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureMessage.Queries;

public class GetConversationQuery(Guid conversationId, int pageIndex, int pageSize) : IQuery<GetConversationResponse>, IPaginationRequest
{
    public Guid ConversationId { get; set; } = conversationId;

    public int PageIndex { get; set; } = pageIndex;

    public int PageSize { get; set; } = pageSize;
    
    public class Validator : AbstractValidator<GetConversationQuery>
    {
        public Validator()
        {
            Include(new PaginationValidator());
            RuleFor(x => x.ConversationId).NotEmpty();
        }
    }
    
    internal class Handler(TogetherContext context, IBaseService baseService) : IQueryHandler<GetConversationQuery, GetConversationResponse>
    {
        public async Task<Result<GetConversationResponse>> Handle(GetConversationQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var query = context.Messages
                .Include(m => m.Sender)
                .Where(m => m.ConversationId == request.ConversationId)
                .OrderByDescending(m => m.CreatedAt);

            var totalRecord = await query.LongCountAsync(cancellationToken);

            var data = await query
                .Skip(request.PageSize * (request.PageIndex - 1))
                .Take(request.PageSize)
                .Select(m => new MessageViewModel
                {
                    Id = m.Id,
                    Text = m.Text,
                    SenderId = m.Sender.Id,
                    SenderUsername = m.Sender.Username,
                    SenderAvatarUrl = m.Sender.AvatarUrl,
                    SendAt = m.CreatedAt,
                })
                .ToListAsync(cancellationToken);

            var reversed = data
                .OrderBy(m => m.SendAt)
                .ToList();

            return new Result<GetConversationResponse>().IsSuccess(
                new GetConversationResponse(
                    reversed,
                    request.PageIndex,
                    request.PageSize,
                    totalRecord)
                {
                    ConversationId = request.ConversationId
                });
        }
    }
}

