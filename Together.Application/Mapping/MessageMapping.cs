using AutoMapper;
using Together.Application.Features.FeatureMessage.Responses;
using Together.Domain.Aggregates.ConversationAggregate;

namespace Together.Application.Mapping;

public class MessageMapping : Profile
{
    public MessageMapping()
    {
        CreateMap<Message, SendMessageResponse>();
    }
}