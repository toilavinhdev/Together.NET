namespace Together.Shared.ValueObjects;

public class UserClaimsPrincipal
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = default!;

    public string Username { get; set; } = default!;
    
    public DateTime ExpirationTime { get; set; }
}