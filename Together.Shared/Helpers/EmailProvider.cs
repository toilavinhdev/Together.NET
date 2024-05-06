using MimeKit;
using Together.Shared.ValueObjects;

namespace Together.Shared.Helpers;

public static class EmailProvider
{
    public static async Task SmtpSendAsync(SmtpConfig config, SmtpMailForm form)
    {
        var mimeMessage = new MimeMessage();
        mimeMessage.Sender = new MailboxAddress(config.DisplayName, config.Mail);
        mimeMessage.From.Add(new MailboxAddress(config.DisplayName, config.Mail));
        mimeMessage.To.Add(MailboxAddress.Parse(form.To));
        mimeMessage.Subject = form.Title;
        mimeMessage.Body = new TextPart("html") { Text = form.Body };
        
        using var smtp = new MailKit.Net.Smtp.SmtpClient();
        
        try {
            await smtp.ConnectAsync(config.Host, config.Port, false);
            await smtp.AuthenticateAsync (config.Mail, config.Password);
            await smtp.SendAsync(mimeMessage);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Có lỗi xảy ra", ex);
        }
    }
}

public class SmtpMailForm
{
    public string To { get; set; } = default!;

    public string Title { get; set; } = default!;

    public string Body { get; set; } = default!;
}