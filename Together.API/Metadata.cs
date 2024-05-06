using System.Reflection;

namespace Together.API;

public static class Metadata
{
    public static readonly Assembly Assembly = typeof(Metadata).Assembly;
    
    public static readonly string Name = Assembly.GetName().Name ?? string.Empty;
}