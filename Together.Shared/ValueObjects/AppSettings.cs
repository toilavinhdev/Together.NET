using System.Diagnostics.CodeAnalysis;

namespace Together.Shared.ValueObjects;

public sealed class AppSettings
{
    public string Host { get; set; } = default!;
    
    public string ClientHost { get; set; } = default!;
    
    public StaticFileConfig StaticFileConfig { get; set; } = default!;

    public SQLServerConfig SqlServerConfig { get; set; } = default!;

    public JwtTokenConfig JwtTokenConfig { get; set; } = default!;
    

    public SmtpConfig SmtpConfig { get; set; } = default!;
}

[SuppressMessage("ReSharper", "InconsistentNaming")]
public class SQLServerConfig
{
    public string ConnectionString { get; set; } = default!;
}

public class JwtTokenConfig
{
    public string TokenSigningKey { get; set; } = default!;
    
    public int AccessTokenDurationInMinutes { get; set; }
    
    public int RefreshTokenDurationInDays { get; set; }

    public string Issuer { get; set; } = default!;
    
    public string Audience { get; set; } = default!;
}

public class StaticFileConfig
{
    public string Location { get; set; } = default!;
    
    public string? SubPath { get; set; }
}

public class SmtpConfig
{
    public string Host { get; set; } = default!;
    
    public int Port { get; set; }
    
    public string DisplayName { get; set; } = default!;
    
    public string Mail { get; set; } = default!;
    
    public string Password { get; set; } = default!;
}