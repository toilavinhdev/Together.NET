namespace Together.Domain.Abstractions;

public interface ISoftDeleteEntity
{
    bool IsDeleted { get; set; }
    
    DateTime DeletedAt { get; set; }
}