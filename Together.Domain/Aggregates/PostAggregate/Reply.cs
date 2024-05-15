using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.PostAggregate;

public class Reply : ModifierTrackingEntity
{
    public Guid PostId { get; set; }
    [ForeignKey(nameof(PostId))]
    public Post Post { get; set; } = default!;

    [ForeignKey(nameof(CreatedById))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User CreatedBy { get; set; } = default!;
    
    public Guid? ParentId { get; set; }
    [ForeignKey(nameof(ParentId))]
    public Reply? Parent { get; set; }
    
    [MaxLength(1024)]
    public string Content { get; set; } = default!;
    
    [InverseProperty(nameof(Parent))]
    public List<Reply>? Children { get; set; }
    
    [InverseProperty(nameof(ReplyLike.Reply))]
    public List<ReplyLike>? ReplyLikes { get; set; }
}