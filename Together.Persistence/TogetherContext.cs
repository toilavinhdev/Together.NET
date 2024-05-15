using Microsoft.EntityFrameworkCore;
using Together.Domain.Aggregates.ConversationAggregate;
using Together.Domain.Aggregates.FileAggregate;
using Together.Domain.Aggregates.FollowAggregate;
using Together.Domain.Aggregates.PostAggregate;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Persistence;

public class TogetherContext(DbContextOptions<TogetherContext> options) : DbContext(options)
{
    public DbSet<ApplicationFile> Files { get; init; } = default!;
    
    public DbSet<User> Users { get; init; } = default!;
    
    public DbSet<UserToken> UserTokens { get; init; } = default!;
    
    public DbSet<Follow> Follows { get; init; } = default!;
    
    public DbSet<Conversation> Conversations { get; init; } = default!;
    
    public DbSet<ConversationParticipant> ConversationParticipants { get; init; } = default!;
    
    public DbSet<Message> Messages { get; init; } = default!;
    
    public DbSet<Post> Posts { get; init; } = default!;
    
    public DbSet<PostLike> PostLikes { get; init; } = default!;
    
    public DbSet<Reply> Replies { get; init; } = default!;
    
    public DbSet<ReplyLike> ReplyLikes { get; init; } = default!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(PersistenceAssembly.Assembly);
    }
}