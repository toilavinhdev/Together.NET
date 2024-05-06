using MediatR;
using Together.API.Extensions;
using Together.Application.Features.FeatureUser.Commands;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Application.Features.FeatureUser.Queries;
using Together.Application.Features.FeatureUser.Responses;
using Together.Shared.ValueObjects;

namespace Together.API.Endpoints;

public class AuthEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth").WithTags("Auth");
        group.MapGet("/me", Me).RequireAuthorization();
        group.MapPost("/sign-in", SignIn);
        group.MapPost("/sign-up", SignUp);
        group.MapPost("/forgot-password", ForgotPassword);
        group.MapGet("/forgot-password/{userId:guid}/{token}", VerifyForgotPassword);
        group.MapPut("/new-password", NewPassword);
    }

    private static Task<Result<SignInResponse>> SignIn(ISender sender, SignInCommand command) => sender.Send(command);
    
    private static Task<Result> SignUp(ISender sender, SignUpCommand command) => sender.Send(command);
    
    private static Task<Result<GetMeResponse>> Me(ISender sender) => sender.Send(new GetMeQuery());
    
    private static Task<Result> ForgotPassword(ISender sender, ForgotPasswordCommand command) => sender.Send(command);
    
    private static Task<Result> VerifyForgotPassword(ISender sender, Guid userId, string token) 
        => sender.Send(new VerifyForgotPasswordQuery(userId, token));
    
    private static Task<Result> NewPassword(ISender sender, NewPasswordCommand command) => sender.Send(command);
}