using System.Net;
using System.Text.Json.Serialization;

namespace Together.Shared.ValueObjects;

public class Result
{
    public HttpStatusCode StatusCode { get; set; }
    
    public bool Success => (int)StatusCode >= 200 && (int)StatusCode <= 299;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Message { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ResultError[]? Errors { get; set; }

    public Result IsSuccess(string? message = null, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return new Result
        {
            StatusCode = statusCode,
            Message = message
        };
    }
}

public class Result<T> : Result
{
    public T Data { get; set; } = default!;
    
    public Result<T> IsSuccess(T data, string? message = null, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return new Result<T>
        {
            Data = data,
            StatusCode = statusCode,
            Message = message
        };
    }
}

public class ResultError(string code, string? message = null, string? parameter = null)
{
    public string Code { get; set; } = code;

    public string? Detail { get; set; } = message;

    public string? Parameter { get; set; } = parameter;
}