namespace Together.Domain.Abstractions;

public abstract class ModifierTrackingEntity : TimeTrackingEntity
{
    public Guid CreatedById { get; set; }
    
    public Guid? ModifiedById { get; set; }

    public void MarkUserCreated(Guid userId)
    {
        MarkCreated();
        CreatedById = userId;
    }

    public void MarkUserModified(Guid userId)
    {
        MarkCreated();
        ModifiedById = userId;
    }
}