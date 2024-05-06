using System.Text.RegularExpressions;

namespace Together.Shared.Constants;

public static partial class RegexPatterns
{
    public static readonly Regex EmailRegex = EmailGeneratedRegex();
    
    [GeneratedRegex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")] 
    private static partial Regex EmailGeneratedRegex();
}