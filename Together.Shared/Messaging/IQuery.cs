using MediatR;
using Together.Shared.ValueObjects;

namespace Together.Shared.Messaging;

public interface IQuery : IRequest<Result>
{
    
}

public interface IQuery<TResponse> : IRequest<Result<TResponse>>
{
    
}