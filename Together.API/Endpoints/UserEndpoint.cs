using MediatR;
using Together.API.Extensions;
using Together.Application.Features.FeatureUser.Commands;
using Together.Application.Features.FeatureUser.Queries;
using Together.Application.Features.FeatureUser.Responses;
using Together.Shared.ValueObjects;

namespace Together.API.Endpoints;

public class UserEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/user").WithTags("User").RequireAuthorization();
        group.MapGet("/profile/{username}", GetProfile);
        group.MapPut("/update", UpdateProfile);
    }

    private static Task<Result<GetProfileResponse>> GetProfile(ISender sender, string username) 
        => sender.Send(new GetProfileQuery(username));
    
    private static Task<Result> UpdateProfile(ISender sender, UpdateProfileCommand command) => sender.Send(command);
}