using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Together.Shared.Extensions;

public static class JsonExtensions
{
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
}