using Infrastructure.PostgreSQL;
using Infrastructure.SharedKernel;
using Infrastructure.SharedKernel.Extensions;
using Service.Notification;
using Service.Notification.BackgroundServices;
using Service.Notification.Domain;

var (builder, appSettings) = WebApplicationBuilderExtensions.CreateCoreBuilder<AppSettings>(args);

var services = builder.Services;
services.AddSharedKernel<Program>(appSettings);
services.AddPostgresDbContext<NotificationContext>(appSettings.PostgresConfig);
services.AddHostedService<CreateNotificationBackgroundService>();
services.AddHostedService<DeleteNotificationBackgroundService>();

var app = builder.Build();
app.UseSharedKernel(appSettings);
app.UseGrpc(appSettings.GrpcEndpoints.ServiceNotification, _ => {});
await NotificationContextInitialization.SeedAsync(app.Services);
app.Run();