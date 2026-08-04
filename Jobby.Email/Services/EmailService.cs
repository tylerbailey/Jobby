using Jobby.Infrastructure.Data;
using Mailjet.Client;
using Mailjet.Client.Resources;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace Jobby.Email.Services
{
    public class EmailService(IDbContextFactory<AppDbContext> dbContextFactory, IOptions<MailJetOptions> mailJetOptions) : IEmailService
    {
        protected readonly IDbContextFactory<AppDbContext> _dbContextFactory = dbContextFactory;
        private readonly MailJetOptions _mailJetOptions = mailJetOptions.Value;

        /// <summary>Sends email alerts for upcoming calendar events that have not yet been notified.</summary>
        public async Task SendEmails()
        {
            var dbContext = await _dbContextFactory.CreateDbContextAsync();
            var alerts = await dbContext.CalendarEvents
                .Include(e => e.User)
                .Include(e => e.JobApp)
                .Where(e => e.User != null
                    && e.User.ReceiveEmailNotifications
                    && e.SendNotification
                    && !e.NotificationSent
                    && e.EventDate > DateTime.UtcNow
                    && DateTime.UtcNow >= e.EventDate.AddMinutes(-e.NotificationMinutesBefore))
                .ToListAsync();

            if (alerts.Count > 0)
            {
                MailjetClient client = new(_mailJetOptions.ApiKey, _mailJetOptions.SecretKey);

                foreach (var alert in alerts)
                {
                    if (alert.User != null)
                    {
                        MailjetRequest request = new MailjetRequest
                        {
                            Resource = Send.Resource,
                        }
                            .Property(Send.FromEmail, "jobby.alerts@proton.me")
                            .Property(Send.FromName, "Jobby")
                            .Property(Send.Subject, "Jobby Upcoming Event Alert")
                            .Property(Send.HtmlPart, $"<h3>You have an upcoming event: {alert.EventTitle}{(alert.JobApp != null ? $" with {alert.JobApp.Company}" : string.Empty)}!</h3></br>" +
                            $"{(alert.JobApp != null ? $"<p>Company: <b>{alert.JobApp.Company}</b></p></br>" : string.Empty)}" +
                            $"{(alert.JobApp != null ? $"<p>Position: <b>{alert.JobApp.Title}</b></p></br>" : string.Empty)}" +
                            $"<p>Date: <b>{alert.EventDate:f}</b></p></br>" +
                            $"<p>Description: <b>{alert.EventDescription}</b></p></br>")
                            .Property(Send.Recipients, new JArray {
                            new JObject {
                             {"Email", alert.User.Email}
                             }
                                });
                        MailjetResponse response = await client.PostAsync(request);
                        Console.Write(response.IsSuccessStatusCode);
                    }
                }
            }

        }
    }
}
