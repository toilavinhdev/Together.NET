using Microsoft.AspNetCore.Http;
using Together.Domain.Aggregates.FileAggregate;
using Together.Persistence;
using Together.Shared.Extensions;
using Together.Shared.Helpers;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureStorage.Commands;

public class UploadFileCommand : ICommand<string>
{
    public IFormFile File { get; set; } = default!;
    
    internal class Handler(TogetherContext context, AppSettings appSettings, IBaseService baseService) : ICommandHandler<UploadFileCommand, string>
    {
        public async Task<Result<string>> Handle(UploadFileCommand request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;
            
            var fileName = $"{Guid.NewGuid()}{request.File.GetExtensions()}";

            var path = await StaticFileProvider.SaveAsync(
                request.File,
                appSettings.StaticFileConfig.Location,
                fileName,
                currentUserId.ToString(),
                cancellationToken);

            var file = new ApplicationFile
            {
                Id = Guid.NewGuid(),
                SourceName = request.File.FileName,
                FileName = fileName,
                Bucket = currentUserId.ToString(),
                Path = path,
                Size = request.File.Length,
                ContentType = request.File.ContentType
            };
            file.MarkUserCreated(currentUserId);

            await context.Files.AddAsync(file, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            return new Result<string>().IsSuccess(path, "Tải lên thành công");
        }
    }
}