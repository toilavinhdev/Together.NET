using Bogus;
using Microsoft.EntityFrameworkCore;
using Together.API.Extensions;
using Together.Application.WebSockets;
using Together.Domain.Aggregates.FollowAggregate;
using Together.Domain.Aggregates.UserAggregate;
using Together.Persistence;
using Together.Shared.Extensions;

namespace Together.API.Endpoints;

public class TestEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/test").WithTags("Test");

        group.MapGet("/ws/connections", (WebSocketConnectionHandler handler) => handler.ConnectionManager.GetAll());
        
        group.MapPost("/fakers/users",  async (
            TogetherContext context, 
            string username,
            int count, 
            string locale = "vi") =>
        {
            var me = await context.Users.FirstOrDefaultAsync(x => x.Username == username);
            if (me is null) return Results.BadRequest();
            
            var faker = new Faker<User>(locale)
                .RuleFor(x => x.Id, Guid.NewGuid)
                .RuleFor(x => x.FullName, f => f.Name.FullName())
                .RuleFor(x => x.Username, (f, u) => f.Internet.UserName(u.FullName).Replace(".", "_").ToLower())
                .RuleFor(x => x.Email, (f, u) => f.Internet.Email(u.Username, f.Random.Number(1, 6).ToString()).ToLower())
                .RuleFor(x => x.PasswordHash, "q".ToSha256)
                .RuleFor(x => x.Bio, f => f.Lorem.Sentences(2, " "))
                .RuleFor(x => x.Dob, f => f.Date.Past(40))
                .RuleFor(x => x.Gender, f => f.PickRandom<Gender>())
                .RuleFor(x => x.AvatarUrl, f => f.Internet.Avatar())
                .RuleFor(x => x.Followings, (f, u) => [
                    new Follow()
                    {
                        Id = Guid.NewGuid(),
                        TargetId = me.Id,
                        CreatedAt = DateTime.Now
                    }
                ]);

            var users = faker.Generate(count);
            
            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            return Results.Ok("Done");
        });
    }
}