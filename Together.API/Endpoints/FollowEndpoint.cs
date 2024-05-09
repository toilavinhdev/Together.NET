using MediatR;
using Together.API.Extensions;
using Together.Application.Features.FeatureFollow.Commands;
using Together.Application.Features.FeatureFollow.Queries;
using Together.Application.Features.FeatureFollow.Responses;
using Together.Shared.ValueObjects;

namespace Together.API.Endpoints;

public class FollowEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/follow").WithTags("Follow").RequireAuthorization();
        group.MapGet("/list", ListFollow);
        group.MapPost("/", Follow);
    }

    private static Task<Result<bool>> Follow(ISender sender, FollowCommand command) => sender.Send(command);
    
    private static Task<Result<ListFollowResponse>> ListFollow(ISender sender, [AsParameters]ListFollowQuery query) => sender.Send(query);
}