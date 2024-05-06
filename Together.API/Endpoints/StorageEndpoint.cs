using MediatR;
using Together.API.Extensions;
using Together.Application.Features.FeatureStorage.Commands;
using Together.Shared.ValueObjects;

namespace Together.API.Endpoints;

public class StorageEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/storage").WithTags("Storage").RequireAuthorization();
        group.MapPost("/upload", UploadFile).DisableAntiforgery();
    }

    private static Task<Result<string>> UploadFile(ISender sender, IFormFile file) 
        => sender.Send(new UploadFileCommand { File = file });
}