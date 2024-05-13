using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.UserAggregate;

namespace Together.Domain.Aggregates.ConversationAggregate;

public class ConversationParticipant : BaseEntity
{
    public Guid ConversationId { get; set; }
    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; } = default!;
    
    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public User User { get; set; } = default!;
}