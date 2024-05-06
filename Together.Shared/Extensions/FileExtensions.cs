using Microsoft.AspNetCore.Http;

namespace Together.Shared.Extensions;

public static class FileExtensions
{
    public static string GetExtensions(this IFormFile file) => Path.GetExtension(file.FileName);
    
    public static string ReadAllText(this string path) => File.ReadAllText(path);
}