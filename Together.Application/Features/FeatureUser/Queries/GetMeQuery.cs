using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Together.Application.Features.FeatureUser.Exceptions;
using Together.Application.Features.FeatureUser.Responses;
using Together.Persistence;
using Together.Shared.Messaging;
using Together.Shared.Services;
using Together.Shared.ValueObjects;

namespace Together.Application.Features.FeatureUser.Queries;

public class GetMeQuery : IQuery<GetMeResponse>
{
    internal class Handler(TogetherContext context, IBaseService baseService, IMapper mapper) : IQueryHandler<GetMeQuery, GetMeResponse>
    {
        public async Task<Result<GetMeResponse>> Handle(GetMeQuery request, CancellationToken cancellationToken)
        {
            var currentUserId = baseService.GetUserClaimsPrincipal().Id;

            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, cancellationToken);
            if (user is null) throw new UserNotFoundException();

            return new Result<GetMeResponse>().IsSuccess(mapper.Map<GetMeResponse>(user));
        }
    }
}