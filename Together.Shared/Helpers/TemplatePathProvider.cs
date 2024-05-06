namespace Together.Shared.Helpers;

public static class TemplatePathProvider
{
    public static string GetPath(string fileName)
    {
        var templatePath = Path.Combine(
            Directory.GetCurrentDirectory(), 
            $@"..\Together.Application\Templates\{fileName}");
        return templatePath;
    }
}