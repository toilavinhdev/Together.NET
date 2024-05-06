using System.Security.Cryptography;
using System.Text;

namespace Together.Shared.Extensions;

public static class StringExtensions
{
    public static Guid ToGuid(this string input) => Guid.TryParse(input, out var result) ? result : default;

    public static int ToInt(this string input) => int.TryParse(input, out var result) ? result : default;
    
    public static long ToLong(this string input) => long.TryParse(input, out var result) ? result : default;
    
    public static double ToDouble(this string input) => double.TryParse(input, out var result) ? result : default;

    public static bool ToBool(this char value) => value switch
    {
        '1' => true,
        '0' => false,
        _ => throw new ArgumentOutOfRangeException()
    };

    public static string? ToStringNotEmptyOrDefault(this string value) => string.IsNullOrEmpty(value) ? default : value;

    public static string RandomString(this int length)
    {
        const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        return new string(Enumerable.Repeat(characters, length)
            .Select(s => s[new Random().Next(s.Length)]).ToArray());
    }
    
    public static string ToSha256(this string input)
    {
        if (string.IsNullOrEmpty(input)) return default!;
        var data = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        var stringBuilder = new StringBuilder();
        foreach (var byteCode in data)
            stringBuilder.Append(byteCode.ToString("X2"));
        return stringBuilder.ToString();
    }
    
    public static string To16Md5(this string value) => value.To32Md5().Substring(8, 16);
    
    public static string To32Md5(this string input)
    {
        if (string.IsNullOrEmpty(input)) return default!;
        var data = MD5.HashData(Encoding.UTF8.GetBytes(input));
        var builder = new StringBuilder();
        foreach (var byteCode in data)
            builder.Append(byteCode.ToString("X2"));
        return builder.ToString();
    }
}