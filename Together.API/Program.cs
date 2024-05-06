using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Together.API;
using Together.API.Extensions;
using Together.Application;
using Together.Application.Behaviors;
using Together.Persistence;
using Together.Shared.ValueObjects;

var builder = WebApplication.CreateBuilder(args);
builder.SetupEnvironment<AppSettings>(nameof(AppSettings), out var appSettings);

var services = builder.Services;
services.AddSingleton(appSettings);
services.AddCustomCors(Metadata.Name);
services.AddHttpContextAccessor();
services.AddJwtBearerAuth(appSettings.JwtTokenConfig);
services.AddAuthorization();
services.AddEndpointDefinitions(Metadata.Assembly);
services.AddSwaggerDocument(Metadata.Name, "v1");
services.AddMediatR(c =>
{
    c.RegisterServicesFromAssembly(ApplicationAssembly.Assembly);
    c.AddOpenBehavior(typeof(ValidationBehavior<,>));
    c.AddOpenBehavior(typeof(PerformanceBehavior<,>));
});
services.AddValidatorsFromAssembly(ApplicationAssembly.Assembly);
services.AddAutoMapper(ApplicationAssembly.Assembly);
services.AddDbContext<TogetherContext>(o =>
{
    o.UseSqlServer(appSettings.SqlServerConfig.ConnectionString);
});
services.AddServiceCollections();

var app = builder.Build();
app.UseDefaultExceptionHandler();
app.UseCors(Metadata.Name);
app.UseStaticFilesConfigure(appSettings.StaticFileConfig);
app.UseSwaggerDocument(Metadata.Name);
app.MapEndpointDefinitions(app.MapGroup("/api"));
app.UseWebSockets();

app.Map("/", () => Metadata.Name);
app.Run();

