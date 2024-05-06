namespace Together.Domain.Abstractions;

public abstract class TimeTrackingEntity : BaseEntity
{
    public DateTime CreatedAt { get; set; }
    
    public DateTime? ModifiedAt { get; set; }

    public void MarkCreated()
    {
        CreatedAt = DateTime.UtcNow.ToLocalTime();
    }

    public void MarkModified()
    {
        ModifiedAt = DateTime.Now.ToLocalTime();
    }
}