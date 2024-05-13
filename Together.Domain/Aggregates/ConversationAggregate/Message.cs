using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.ConversationAggregate;

public class Message : TimeTrackingEntity, ISoftDeleteEntity
{
    public Guid ConversationId { get; set; }
    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; } = default!;
    
    public Guid SenderId { get; set; }
    [ForeignKey(nameof(SenderId))] 
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User Sender { get; set; } = default!;

    [MaxLength(512)]
    public string Text { get; set; } = default!;
    
    public DateTime? SeenAt { get; set; }

    public Guid? DeletedById { get; set; }
    
    public DateTime? DeletedAt { get; set; }
    
    public void MarkDeleted(Guid userId)
    {
        DeletedById = userId;
        DeletedAt = DateTime.Now.ToLocalTime();
    }
}