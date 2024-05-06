using Together.Domain.Abstractions;

namespace Together.Domain.Aggregates.FileAggregate;

public class ApplicationFile : ModifierTrackingEntity, IAggregateRoot
{
    public string SourceName { get; set; } = default!;

    public string FileName { get; set; } = default!;
    
    public long Size { get; set; }

    public string? ContentType { get; set; }

    public string Path { get; set; } = default!;
    
    public string Bucket { get; set; } = default!;
}