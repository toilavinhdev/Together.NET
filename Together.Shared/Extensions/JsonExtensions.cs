using Newtonsoft.Json;

namespace Together.Shared.Extensions;

public static class JsonExtensions
{
    public static string ToJson<T>(this T input) => JsonConvert.SerializeObject(
        input, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });

    public static T ToObject<T>(this string json) => JsonConvert.DeserializeObject<T>(
        json,new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })!;
}