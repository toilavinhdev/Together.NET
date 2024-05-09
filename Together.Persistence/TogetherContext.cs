using Microsoft.EntityFrameworkCore;
using Together.Domain.Aggregates.FileAggregate;
using Together.Domain.Aggregates.FollowAggregate;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Persistence;

public class TogetherContext(DbContextOptions<TogetherContext> options) : DbContext(options)
{
    public DbSet<ApplicationFile> Files { get; init; } = default!;
    
    public DbSet<User> Users { get; init; } = default!;
    
    public DbSet<UserToken> UserTokens { get; init; } = default!;
    
    public DbSet<Follow> Follows { get; init; } = default!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(PersistenceAssembly.Assembly);
    }
}