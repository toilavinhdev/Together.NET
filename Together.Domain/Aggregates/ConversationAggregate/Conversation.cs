using System.ComponentModel.DataAnnotations;
using Together.Domain.Abstractions;

namespace Together.Domain.Aggregates.ConversationAggregate;

public class Conversation : ModifierTrackingEntity, IAggregateRoot
{
    [MaxLength(256)]
    public string? Title { get; set; }
    
    public ConversationType Type { get; set; }

    public List<Message>? Messages { get; set; }

    public List<ConversationParticipant> ConversationParticipants { get; set; } = default!;
}

public enum ConversationType
{
    Normal = 0,
    Group,
}