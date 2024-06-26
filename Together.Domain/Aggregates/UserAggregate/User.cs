﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Together.Domain.Abstractions;
using Together.Domain.Aggregates.ConversationAggregate;
using Together.Domain.Aggregates.FollowAggregate;
using Together.Domain.Aggregates.PostAggregate;

namespace Together.Domain.Aggregates.UserAggregate;

[Index(nameof(Username), IsUnique = true)]
public class User : TimeTrackingEntity, IAggregateRoot
{
    [MaxLength(128)]
    public string FullName { get; set; } = default!;

    [MaxLength(32)] 
    public string Username { get; set; } = default!;

    public string Email { get; set; } = default!;
    
    public bool EmailConfirmed { get; set; }
    
    [MaxLength(128)]
    public string? Bio { get; set; }
    
    public DateTime? Dob { get; set; }
    
    public Gender? Gender { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public string PasswordHash { get; set; } = default!;

    public List<UserToken>? UserToken { get; set; }
    
    [InverseProperty(nameof(Follow.Target))]
    public List<Follow>? Followers { get; set; }
    
    [InverseProperty(nameof(Follow.Source))]
    public List<Follow>? Followings { get; set; }
    
    [InverseProperty(nameof(Message.Sender))]
    public List<Message>? SentMessages { get; set; }
    
    [InverseProperty(nameof(ConversationParticipant.User))]
    public List<ConversationParticipant>? ConversationParticipants { get; set; }
    
    [InverseProperty(nameof(Post.CreatedBy))]
    public List<Post>? Posts { get; set; }
    
    [InverseProperty(nameof(PostLike.User))]
    public List<PostLike>? PostLikes { get; set; }
    
    [InverseProperty(nameof(Reply.CreatedBy))]
    public List<Reply>? Replies { get; set; }
    
    [InverseProperty(nameof(ReplyLike.User))]
    public List<ReplyLike>? ReplyLikes { get; set; }
}

public enum Gender
{
    Female = 0,
    Male,
    Other
}