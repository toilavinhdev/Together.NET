﻿using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Infrastructure.SharedKernel.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Infrastructure.SharedKernel.Extensions;

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

    public static string ToJson<T>(this T input) => JsonConvert.SerializeObject(
        input,
        new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            }
        }
    );

    public static T ToObject<T>(this string json) => JsonConvert.DeserializeObject<T>(
        json,
        new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        }
    )!;

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

    public static string RandomString(this int length, string? pattern = null)
    {
        const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        return new string(Enumerable.Repeat(pattern ?? characters, length)
            .Select(s => s[new Random().Next(s.Length)]).ToArray());
    }

    public static string ToUnderscoreCase(this string input)
    {
        return input.ToSnakeCase('_');
    }

    public static string ToKebabCase(this string input)
    {
        return input.ToSnakeCase('-');
    }

    private static string ToSnakeCase(this string input, char separator)
    {
        if (string.IsNullOrEmpty(input)) return default!;
        var inspect = input.Select(
            (x, idx) => idx > 0 && char.IsUpper(x)
                ? $"{separator}{x}"
                : string.IsNullOrWhiteSpace(x.ToString())
                    ? string.Empty
                    : x.ToString());
        return string.Concat(inspect).ToLower();
    }

    public static string RemoveVietnameseDiacritics(this string input)
    {
        if (string.IsNullOrEmpty(input)) return input;
        input = input.ToLower().Trim();
        input = RegexUtils.LineBreakRegex.Replace(input, " ");
        input = RegexUtils.SpacesTabsRegex.Replace(input, " ");
        input = RegexUtils.SpecialCharactersRegex.Replace(input, "");
        input = RegexUtils.CharacterVariantARegex.Replace(input, "a");
        input = RegexUtils.CharacterVariantDRegex.Replace(input, "d");
        input = RegexUtils.CharacterVariantERegex.Replace(input, "e");
        input = RegexUtils.CharacterVariantIRegex.Replace(input, "i");
        input = RegexUtils.CharacterVariantORegex.Replace(input, "o");
        input = RegexUtils.CharacterVariantURegex.Replace(input, "u");
        input = RegexUtils.CharacterVariantYRegex.Replace(input, "y");
        return input;
    }

    public static string Slugify(this string input)
    {
        var regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
        var slug = input
            .Normalize(NormalizationForm.FormD)
            .Trim()
            .ToLower();

        slug = regex.Replace(slug, String.Empty)
            .Replace('\u0111', 'd').Replace('\u0110', 'D')
            .Replace(",", "-").Replace(".", "-").Replace("!", "")
            .Replace("(", "").Replace(")", "").Replace(";", "-")
            .Replace("/", "-").Replace("%", "ptram").Replace("&", "va")
            .Replace("?", "").Replace('"', '-').Replace(' ', '-');

        return slug;
    }
}