using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.PostAggregate;

public class ReplyLike : TimeTrackingEntity
{
    public Guid ReplyId { get; set; }
    [ForeignKey((nameof(ReplyId)))]
    public Reply Reply { get; set; } = default!;
    
    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User User { get; set; } = default!;
}