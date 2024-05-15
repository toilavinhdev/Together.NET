using MediatR;
using Together.API.Extensions;
using Together.Application.Features.FeaturePost.Commands;
using Together.Application.Features.FeaturePost.Queries;
using Together.Application.Features.FeaturePost.Responses;
using Together.Shared.ValueObjects;

namespace Together.API.Endpoints;

public class PostEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/post").WithTags("Post").RequireAuthorization();
        group.MapGet("/news-feed", NewsFeed);
        group.MapPost("/new-post", CreatePost);
        group.MapPost("/reply", CreateReply);
        group.MapPost("/like", LikePost);
    }
    
    private static Task<Result<NewsFeedResponse>> NewsFeed(ISender sender,[AsParameters] NewsFeedQuery query) 
        => sender.Send(query);

    private static Task<Result<CreatePostResponse>> CreatePost(ISender sender, CreatePostCommand command) 
        => sender.Send(command);
    
    private static Task<Result<CreateReplyResponse>> CreateReply(ISender sender, CreateReplyCommand command) 
        => sender.Send(command);
    
    private static Task<Result> LikePost(ISender sender, LikePostCommand command) 
        => sender.Send(command);
}