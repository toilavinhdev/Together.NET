using MediatR;
using Together.API.Extensions;
using Together.Application.Features.FeatureMessage.Commands;
using Together.Application.Features.FeatureMessage.Queries;
using Together.Application.Features.FeatureMessage.Responses;
using Together.Shared.ValueObjects;

namespace Together.API.Endpoints;

public class MessageEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/message").WithTags("Message").RequireAuthorization();
        group.MapGet("/conversation/{conversationId:guid}", GetConversation);
        group.MapGet("/conversations", ListConversations);
        group.MapPost("/send", SendMessage);
    }

    private static Task<Result<SendMessageResponse>> SendMessage(ISender sender, SendMessageCommand command) 
        => sender.Send(command);
    
    private static Task<Result<ListConversationResponse>> ListConversations(ISender sender, [AsParameters]ListConversationQuery query) 
        => sender.Send(query);
    
    private static Task<Result<GetConversationResponse>> GetConversation(ISender sender, Guid conversationId, int pageIndex, int pageSize) 
        => sender.Send(new GetConversationQuery(conversationId, pageIndex, pageSize));
}