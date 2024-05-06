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
        var bucketToFile = string.IsNullOrEmpty(bucket) 
            ? fileName 
            : Path.Combine(InitialBucket(bucket), fileName);
        var rootToFile = Path.Combine(location, bucketToFile);
 
        await using var stream = new FileStream(rootToFile, FileMode.Create); 
        await file.CopyToAsync(stream, cancellationToken);

        return bucketToFile;
    }
    
    private static string InitialBucket(string path)
    {
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);
        return path;
    }
}