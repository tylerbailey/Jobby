using Jobby.Email.Services;

namespace Jobby.Email
{
    public class Worker(ILogger<Worker> logger, IEmailService emailService) : BackgroundService
    {
        private readonly IEmailService _emailService = emailService;
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await _emailService.SendEmails();
                //if (logger.IsEnabled(LogLevel.Information))
                //{
                //    logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                //}
                await Task.Delay(60000, stoppingToken);
            }
        }
    }
}
