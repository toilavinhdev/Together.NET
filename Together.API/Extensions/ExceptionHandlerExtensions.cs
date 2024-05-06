using System.Net;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Together.Shared.Exceptions;
using Together.Shared.ValueObjects;

namespace Together.API.Extensions;

public static class ExceptionHandlerExtensions
{
    public static WebApplication UseDefaultExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(errApp =>
        {
            errApp.Run(async ctx =>
            {
                var feature = ctx.Features.Get<IExceptionHandlerFeature>();

                if (feature is not null)
                {
                    var exception = feature.Error;
                    await WriteResponseAsync(ctx, exception);
                }
            });
        });
        
        return app;
    }
    
    private static async Task WriteResponseAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)GetStatusCode(exception);
        await context.Response.WriteAsJsonAsync(
            new Result
            {
                StatusCode = GetStatusCode(exception),
                Errors = GetResponseErrors(exception)
            });
    }

    private static HttpStatusCode GetStatusCode(Exception ex) => ex switch
    {
        UnauthorizedAccessException => HttpStatusCode.Unauthorized,
        DomainException dEx => dEx.StatusCode,
        ValidationException => HttpStatusCode.BadRequest,
        _ => HttpStatusCode.InternalServerError
    };
    
    private static ResultError[] GetResponseErrors(Exception ex)
    {
        switch (ex)
        {
            case UnauthorizedAccessException:
                return [new ResultError("UNAUTHORIZED", "Unauthorized")];
            case ValidationException vEx:
                return vEx.Errors
                    .Select(failure => new ResultError(failure.ErrorCode, failure.ErrorMessage, failure.PropertyName))
                    .ToArray();
            default:
            {
                var errorCount = 5;
                var errors = new List<ResultError> { ex.ToResponseError() };

                var inner = ex.InnerException;
        
                while (inner is not null && errorCount-- > 0)
                {
                    errors.Add(inner.ToResponseError());
                    inner = inner.InnerException;
                }

                return errors.ToArray();
            }
        }
    }

    private static ResultError ToResponseError(this Exception ex)
    {
        return ex is DomainException dEx 
            ? new ResultError(dEx.Code, dEx.Detail, dEx.Parameter)
            : new ResultError("INTERNAL_SERVER_ERROR", ex.Message);
    }
}