namespace Together.Shared.Exceptions;

public abstract class DomainException : Exception
{
    public abstract string Code { get; }
    
    public abstract string Detail { get; }
    
    public abstract string? Parameter { get; }
}