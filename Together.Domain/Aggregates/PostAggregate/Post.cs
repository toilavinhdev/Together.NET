using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.PostAggregate;

public class Post : ModifierTrackingEntity, IAggregateRoot
{
    public string Content { get; set; } = default!;

    [ForeignKey(nameof(CreatedById))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User CreatedBy { get; set; } = default!;
    
    public List<PostLike>? PostLikes { get; set; }
    
    [InverseProperty(nameof(Reply.Post))]
    public List<Reply>? Replies { get; set; }
}