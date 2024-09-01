using Infrastructure.PostgreSQL;
using Infrastructure.SharedKernel.ValueObjects;

namespace Service.Community;

public sealed class AppSettings : BaseSettings
{
    public PostgresConfig PostgresConfig { get; set; } = default!;
}