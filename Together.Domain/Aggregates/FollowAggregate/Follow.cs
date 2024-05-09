using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.FollowAggregate;

public class Follow : TimeTrackingEntity, IAggregateRoot
{
    public Guid SourceId { get; set; }
    [ForeignKey(nameof(SourceId))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User Source { get; set; } = default!;
    
    public Guid TargetId { get; set; }
    [ForeignKey(nameof(TargetId))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User Target { get; set; } = default!;
}