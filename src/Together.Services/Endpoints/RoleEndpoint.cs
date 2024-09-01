using Infrastructure.SharedKernel.Extensions;
using Infrastructure.SharedKernel.ValueObjects;
using MediatR;
using Service.Identity.Application.Features.FeatureRole.Command;
using Service.Identity.Application.Features.FeatureRole.Queries;
using Service.Identity.Application.Features.FeatureRole.Responses;

namespace Service.Identity.Endpoints;

public sealed class RoleEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/role").WithTags("Role");
        
        group.MapGet("/{roleId:guid}", GetRole);
        
        group.MapGet("/list", ListRole);
        
        group.MapPost("/create", CreateRole);
        
        group.MapPost("/assign", AssignRole);
        
        group.MapPut("/update", UpdateRole);
        
        group.MapDelete("/{roleId:guid}", DeleteRole);
    }
    
    private static Task<BaseResponse<GetRoleResponse>> GetRole(ISender sender, Guid roleId)
        => sender.Send(new GetRoleQuery(roleId));
    
    private static Task<BaseResponse<ListRoleResponse>> ListRole(ISender sender, [AsParameters] ListRoleQuery query)
        => sender.Send(query);

    private static Task<BaseResponse<CreateRoleResponse>> CreateRole(ISender sender, CreateRoleCommand command)
        => sender.Send(command);
    
    private static Task<BaseResponse> UpdateRole(ISender sender, UpdateRoleCommand command)
        => sender.Send(command);
    
    private static Task<BaseResponse> AssignRole(ISender sender, AssignRoleCommand command)
        => sender.Send(command);
    
    private static Task<BaseResponse> DeleteRole(ISender sender, Guid roleId)
        => sender.Send(new DeleteRoleCommand(roleId));
}