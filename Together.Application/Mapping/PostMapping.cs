using AutoMapper;
using Together.Application.Features.FeaturePost.Responses;
using Together.Domain.Aggregates.PostAggregate;

namespace Together.Application.Mapping;

public class PostMapping : Profile
{
    public PostMapping()
    {
        CreateMap<Post, CreatePostResponse>();
        CreateMap<Reply, CreateReplyResponse>();
    }
}