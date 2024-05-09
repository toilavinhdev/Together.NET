using System.ComponentModel;
using System.Text.RegularExpressions;

namespace Together.Shared.Constants;

public static partial class RegexPatterns
{
    public static readonly Regex EmailRegex = EmailGeneratedRegex();
    [GeneratedRegex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")] 
    private static partial Regex EmailGeneratedRegex();
    
    public static readonly Regex UsernameRegex = UsernameGeneratedRegex();
    [Description("Chỉ chứa kí tự a-z 0-9 và _")]
    [GeneratedRegex(@"^[a-z0-9_]*$")] 
    private static partial Regex UsernameGeneratedRegex();
}