using Microsoft.AspNetCore.Http;

namespace Together.Shared.Helpers;

public static class StaticFileProvider
{
    public static async Task<string> SaveAsync(IFormFile file, 
        string location,
        string fileName, 
        string? bucket = null, 
        CancellationToken cancellationToken = new())
    {
        var rootToBucket = string.IsNullOrEmpty(bucket) 
            ? location 
            : InitialBucket(Path.Combine(location, bucket));
        var rootToFile = Path.Combine(rootToBucket, fileName);
 
        await using var stream = new FileStream(rootToFile, FileMode.Create); 
        await file.CopyToAsync(stream, cancellationToken);

        return bucket is not null ? Path.Combine(bucket, fileName) : fileName;
    }
    
    private static string InitialBucket(string path)
    {
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);
        return path;
    }
}