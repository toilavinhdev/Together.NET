using Microsoft.EntityFrameworkCore;

namespace Together.Persistence;

public class TogetherContext(DbContextOptions<TogetherContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(PersistenceAssembly.Assembly);
    }
}