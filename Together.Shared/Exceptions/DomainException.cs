using System.Net;

namespace Together.Shared.Exceptions;

public abstract class DomainException : Exception
{
    public virtual HttpStatusCode StatusCode { get; } = HttpStatusCode.BadRequest;
    
    public abstract string Code { get; }
    
    public abstract string Detail { get; }
    
    public abstract string? Parameter { get; }
}