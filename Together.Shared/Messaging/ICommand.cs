using MediatR;
using Together.Shared.ValueObjects;

namespace Together.Shared.Messaging;

public interface ICommand : IRequest<Result>
{
    
}

public interface ICommand<TResponse> : IRequest<Result<TResponse>>
{
    
}