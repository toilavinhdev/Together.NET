using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.PostAggregate;

public class PostLike : TimeTrackingEntity
{
    public Guid PostId { get; set; }
    [ForeignKey(nameof(PostId))]
    public Post Post { get; set; } = default!;
    
    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User User { get; set; } = default!;
}